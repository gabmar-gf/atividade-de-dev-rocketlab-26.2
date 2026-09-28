import math
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.movies.models import (
    DimGenre,
    DimMovie,
    DimPerson,
    DimReview,
    MovieReview,
    bridge_movie_genre,
)
from app.movies.schemas import (
    MovieCreate,
    MovieDetailResponse,
    PaginatedMoviesResponse,
    MovieUpdate,
    ReviewCreate,
    ReviewResponse,
)

router = APIRouter()


@router.get("/genres")
async def list_genres(
    db: AsyncSession = Depends(get_db),
):
    """Lista todos os gêneros cadastrados."""

    query = (
        select(DimGenre.nome_genero)
        .order_by(DimGenre.nome_genero)
    )

    result = await db.execute(query)

    return result.scalars().all()


@router.get("/reviews")
async def list_all_reviews(
    db: AsyncSession = Depends(get_db),
    search: str | None = Query(
        None,
        description="Busca por usuário, filme ou comentário",
    ),
):
    """Lista todas as avaliações cadastradas."""

    query = (
        select(MovieReview, DimMovie.titulo)
        .join(
            DimMovie,
            DimMovie.sk_movie_id == MovieReview.sk_movie_id,
        )
    )

    if search:
        search_filter = f"%{search}%"

        query = query.where(
            or_(
                MovieReview.nome.ilike(search_filter),
                MovieReview.comentario.ilike(search_filter),
                DimMovie.titulo.ilike(search_filter),
            )
        )

    query = query.order_by(
        MovieReview.created_at.desc()
    )

    result = await db.execute(query)

    rows = result.all()

    reviews = []

    for review, titulo in rows:
        reviews.append(
            {
                "sk_movie_review_id": review.sk_movie_review_id,
                "sk_movie_id": review.sk_movie_id,
                "titulo": titulo,
                "nome": review.nome,
                "nota": review.nota,
                "comentario": review.comentario,
                "created_at": review.created_at,
            }
        )

    return reviews


@router.delete(
    "/reviews/{sk_movie_review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_movie_review(
    sk_movie_review_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Remove uma avaliação e atualiza a média do filme."""

    query = select(MovieReview).where(
        MovieReview.sk_movie_review_id == sk_movie_review_id
    )

    result = await db.execute(query)

    review = result.scalar_one_or_none()

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Avaliação não encontrada",
        )

    sk_movie_id = review.sk_movie_id

    await db.delete(review)
    await db.flush()

    all_reviews_query = select(MovieReview).where(
        MovieReview.sk_movie_id == sk_movie_id
    )

    all_reviews = (
        await db.execute(all_reviews_query)
    ).scalars().all()

    total_reviews = len(all_reviews)

    summary_query = select(DimReview).where(
        DimReview.sk_movie_id == sk_movie_id
    )

    summary_result = await db.execute(summary_query)

    summary = summary_result.scalar_one_or_none()

    if total_reviews == 0:
        if summary:
            await db.delete(summary)
    else:
        avg_score = (
            sum(r.nota for r in all_reviews) / total_reviews
        )

        if not summary:
            summary = DimReview(
                sk_movie_id=sk_movie_id,
                qtd_avaliacoes_usuarios=total_reviews,
                nota_media_usuarios=avg_score,
            )

            db.add(summary)
        else:
            summary.qtd_avaliacoes_usuarios = total_reviews
            summary.nota_media_usuarios = avg_score

    await db.commit()

    return None


@router.get("", response_model=PaginatedMoviesResponse)
async def list_movies(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1, description="Número da página"),
    size: int = Query(12, ge=1, le=100, description="Itens por página"),
    search: str | None = Query(None, description="Busca por título ou sinopse"),
    custom_only: bool = Query(
        False,
        description="Mostra apenas filmes adicionados manualmente",
    ),
    sort: str | None = Query(
        None,
        description=(
            "Ordenação: az, za, rating_desc ou rating_asc"
        ),
    ),
    genre: str | None = Query(
        None,
        description="Filtra pelo nome do gênero",
    ),
):
    """Lista filmes com suporte a busca, filtros e ordenação."""

    query = select(DimMovie)

    if search:
        search_filter = f"%{search}%"
        query = query.where(
            or_(
                DimMovie.titulo.ilike(search_filter),
                DimMovie.sinopse.ilike(search_filter),
            )
        )

    if custom_only:
        query = query.where(
            DimMovie.id_filme.like("custom_%")
        )

    if genre:
        query = query.join(
            bridge_movie_genre,
            bridge_movie_genre.c.sk_movie_id == DimMovie.sk_movie_id,
        ).join(
            DimGenre,
            DimGenre.sk_genre_id == bridge_movie_genre.c.sk_genre_id,
        ).where(
            DimGenre.nome_genero == genre
        )

    if sort in {"rating_desc", "rating_asc"}:
        query = query.outerjoin(
            DimReview,
            DimReview.sk_movie_id == DimMovie.sk_movie_id,
        )

    count_query = select(func.count()).select_from(
        query.distinct().subquery()
    )

    total = (await db.execute(count_query)).scalar_one()

    query = query.options(
        selectinload(DimMovie.reviews_summary)
    )

    if sort == "az":
        query = query.order_by(
            DimMovie.titulo.asc()
        )

    elif sort == "za":
        query = query.order_by(
            DimMovie.titulo.desc()
        )

    elif sort == "rating_desc":
        query = query.order_by(
            DimReview.nota_media_usuarios.desc().nulls_last(),
            DimMovie.titulo.asc(),
        )

    elif sort == "rating_asc":
        query = query.order_by(
            DimReview.nota_media_usuarios.asc().nulls_last(),
            DimMovie.titulo.asc(),
        )

    else:
        query = query.order_by(
            DimMovie.ano_lancamento.desc().nulls_last(),
            DimMovie.titulo,
        )

    query = query.offset(
        (page - 1) * size
    ).limit(size)

    result = await db.execute(query)

    movies = result.unique().scalars().all()

    items = []

    for m in movies:
        nota_media = (
            m.reviews_summary.nota_media_usuarios
            if m.reviews_summary
            else None
        )

        item_dict = m.__dict__.copy()
        item_dict["nota_media"] = nota_media
        items.append(item_dict)

    pages = math.ceil(total / size) if size > 0 else 0

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages,
    }


@router.get(
    "/{sk_movie_id}",
    response_model=MovieDetailResponse,
)
async def get_movie_detail(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Obtém detalhes do filme, seus relacionamentos e lista de avaliações."""

    query = (
        select(DimMovie)
        .where(DimMovie.sk_movie_id == sk_movie_id)
        .options(
            selectinload(DimMovie.genres),
            selectinload(DimMovie.people),
            selectinload(DimMovie.reviews),
            selectinload(DimMovie.reviews_summary),
        )
    )

    result = await db.execute(query)

    movie = result.scalar_one_or_none()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Filme não encontrado",
        )

    total_avaliacoes = len(movie.reviews)

    nota_media = (
        movie.reviews_summary.nota_media_usuarios
        if movie.reviews_summary
        else None
    )

    if total_avaliacoes > 0 and nota_media is None:
        nota_media = (
            sum(r.nota for r in movie.reviews) / total_avaliacoes
        )

    res_dict = movie.__dict__.copy()
    res_dict["nota_media"] = nota_media
    res_dict["total_avaliacoes"] = total_avaliacoes
    res_dict["genres"] = movie.genres
    res_dict["people"] = movie.people
    res_dict["reviews"] = movie.reviews

    return res_dict


@router.post(
    "",
    response_model=MovieDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_movie(
    movie_in: MovieCreate,
    db: AsyncSession = Depends(get_db),
):
    """Cadastra um novo filme."""

    genre_query = select(DimGenre).where(
        DimGenre.nome_genero == movie_in.genero
    )

    genre_result = await db.execute(genre_query)
    genre = genre_result.scalar_one_or_none()

    if not genre:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Gênero não encontrado",
        )

    movie_data = movie_in.model_dump(
        exclude={"genero", "diretor"}
    )

    id_filme = f"custom_{uuid4().hex[:10]}"

    movie = DimMovie(
        id_filme=id_filme,
        **movie_data,
    )

    movie.genres.append(genre)

    if movie_in.diretor:
        director_query = select(DimPerson).where(
            DimPerson.nome_pessoa == movie_in.diretor,
            DimPerson.tipo_pessoa == "Diretor",
        )

        director_result = await db.execute(director_query)
        director = director_result.scalar_one_or_none()

        if not director:
            director = DimPerson(
                nome_pessoa=movie_in.diretor,
                tipo_pessoa="Diretor",
            )
            db.add(director)

        movie.people.append(director)

    db.add(movie)

    await db.commit()
    await db.refresh(movie)

    return await get_movie_detail(movie.sk_movie_id, db)


@router.put(
    "/{sk_movie_id}",
    response_model=MovieDetailResponse,
)
async def update_movie(
    sk_movie_id: str,
    movie_in: MovieUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Atualiza as informações de um filme."""

    query = select(DimMovie).where(
        DimMovie.sk_movie_id == sk_movie_id
    )

    result = await db.execute(query)

    movie = result.scalar_one_or_none()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Filme não encontrado",
        )

    update_data = movie_in.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(movie, field, value)

    await db.commit()

    return await get_movie_detail(
        sk_movie_id,
        db,
    )


@router.delete(
    "/{sk_movie_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_movie(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Remove um filme."""

    query = select(DimMovie).where(
        DimMovie.sk_movie_id == sk_movie_id
    )

    result = await db.execute(query)

    movie = result.scalar_one_or_none()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Filme não encontrado",
        )

    await db.delete(movie)

    await db.commit()

    return None


@router.post(
    "/{sk_movie_id}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_movie_review(
    sk_movie_id: str,
    review_in: ReviewCreate,
    db: AsyncSession = Depends(get_db),
):
    """Adiciona uma nova avaliação a um filme e atualiza a média geral."""

    query = select(DimMovie).where(
        DimMovie.sk_movie_id == sk_movie_id
    )

    result = await db.execute(query)

    movie = result.scalar_one_or_none()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Filme não encontrado",
        )

    review = MovieReview(
        sk_movie_id=sk_movie_id,
        nome=review_in.nome,
        nota=review_in.nota,
        comentario=review_in.comentario,
    )

    db.add(review)

    await db.flush()

    all_reviews_query = select(MovieReview).where(
        MovieReview.sk_movie_id == sk_movie_id
    )

    all_reviews = (
        await db.execute(all_reviews_query)
    ).scalars().all()

    total_reviews = len(all_reviews)

    avg_score = (
        sum(r.nota for r in all_reviews) / total_reviews
        if total_reviews > 0
        else 0
    )

    summary_query = select(DimReview).where(
        DimReview.sk_movie_id == sk_movie_id
    )

    summary_result = await db.execute(summary_query)

    summary = summary_result.scalar_one_or_none()

    if not summary:
        summary = DimReview(
            sk_movie_id=sk_movie_id,
            qtd_avaliacoes_usuarios=total_reviews,
            nota_media_usuarios=avg_score,
        )

        db.add(summary)

    else:
        summary.qtd_avaliacoes_usuarios = total_reviews
        summary.nota_media_usuarios = avg_score

    await db.commit()

    await db.refresh(review)

    return review