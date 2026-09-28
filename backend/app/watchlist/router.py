from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.movies.models import DimMovie, DimReview, Watchlist
from app.movies.schemas import WatchlistResponse

router = APIRouter()


@router.post(
    "/{sk_movie_id}",
    response_model=WatchlistResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_to_watchlist(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db),
):
    movie_query = select(DimMovie).where(
        DimMovie.sk_movie_id == sk_movie_id
    )

    result = await db.execute(movie_query)
    movie = result.scalar_one_or_none()

    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Filme não encontrado",
        )

    watchlist_query = select(Watchlist).where(
        Watchlist.sk_movie_id == sk_movie_id
    )

    result = await db.execute(watchlist_query)
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Filme já está na watchlist",
        )

    watchlist_item = Watchlist(
        sk_movie_id=sk_movie_id
    )

    db.add(watchlist_item)

    await db.commit()
    await db.refresh(watchlist_item)

    review_query = select(DimReview).where(
        DimReview.sk_movie_id == sk_movie_id
    )

    review_result = await db.execute(review_query)
    review = review_result.scalar_one_or_none()

    return {
        "sk_watchlist_id": watchlist_item.sk_watchlist_id,
        "sk_movie_id": watchlist_item.sk_movie_id,
        "created_at": watchlist_item.created_at,
        "titulo": movie.titulo,
        "ano_lancamento": movie.ano_lancamento,
        "sinopse": movie.sinopse,
        "url_poster": movie.url_poster,
        "url_backdrop": movie.url_backdrop,
        "nota_media": (
            review.nota_media_usuarios
            if review
            else None
        ),
    }


@router.get(
    "",
    response_model=list[WatchlistResponse],
)
async def get_watchlist(
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Watchlist, DimMovie, DimReview)
        .join(
            DimMovie,
            Watchlist.sk_movie_id == DimMovie.sk_movie_id,
        )
        .outerjoin(
            DimReview,
            DimMovie.sk_movie_id == DimReview.sk_movie_id,
        )
        .order_by(Watchlist.created_at.desc())
    )

    result = await db.execute(query)

    items = []

    for watchlist, movie, review in result.all():
        items.append(
            {
                "sk_watchlist_id": watchlist.sk_watchlist_id,
                "sk_movie_id": watchlist.sk_movie_id,
                "created_at": watchlist.created_at,
                "titulo": movie.titulo,
                "ano_lancamento": movie.ano_lancamento,
                "sinopse": movie.sinopse,
                "url_poster": movie.url_poster,
                "url_backdrop": movie.url_backdrop,
                "nota_media": (
                    review.nota_media_usuarios
                    if review
                    else None
                ),
            }
        )

    return items


@router.delete(
    "/{sk_movie_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def remove_from_watchlist(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db),
):
    query = select(Watchlist).where(
        Watchlist.sk_movie_id == sk_movie_id
    )

    result = await db.execute(query)
    watchlist_item = result.scalar_one_or_none()

    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Filme não está na watchlist",
        )

    await db.delete(watchlist_item)
    await db.commit()

    return None