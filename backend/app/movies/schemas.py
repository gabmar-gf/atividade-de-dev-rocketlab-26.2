from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


#  SCHEMAS DE AVALIAÇÃO (REVIEWS)

class ReviewCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=120, example="João Silva")
    nota: float = Field(..., ge=0, le=10, description="Nota de 0 a 10", example=8.5)
    comentario: str = Field(..., min_length=1, max_length=4000, example="Excelente filme!")

class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sk_movie_review_id: str
    sk_movie_id: str
    nome: str
    nota: float
    comentario: str
    created_at: datetime


#  SCHEMAS DE FILME (MOVIES)

class MovieBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=500)
    sinopse: str | None = None
    ano_lancamento: int | None = None
    data_lancamento: date | None = None
    duracao_minutos: int | None = None
    status_filme: str | None = "Released"
    url_poster: str | None = None
    url_backdrop: str | None = None

class MovieCreate(MovieBase):
    genero: str = Field(..., min_length=1, max_length=50)
    diretor: str | None = Field(None, min_length=1, max_length=255)

class MovieUpdate(BaseModel):
    titulo: str | None = None
    sinopse: str | None = None
    ano_lancamento: int | None = None
    data_lancamento: date | None = None
    duracao_minutos: int | None = None
    status_filme: str | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None

class GenreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    sk_genre_id: str
    nome_genero: str

class PersonResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    sk_person_id: str
    nome_pessoa: str
    tipo_pessoa: str

class MovieListResponse(BaseModel):
    """Schema otimizado para a listagem paginada no catálogo."""
    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    titulo: str
    ano_lancamento: int | None = None
    sinopse: str | None = None
    url_poster: str | None = None
    nota_media: float | None = None

class MovieDetailResponse(MovieBase):
    """Schema completo para a tela de detalhes do filme."""
    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    genres: list[GenreResponse] = []
    people: list[PersonResponse] = []
    reviews: list[ReviewResponse] = []
    nota_media: float | None = None
    total_avaliacoes: int = 0


class PaginatedMoviesResponse(BaseModel):
    items: list[MovieListResponse]
    total: int
    page: int
    size: int
    pages: int

class WatchlistResponse(BaseModel):
    sk_watchlist_id: str
    sk_movie_id: str
    created_at: datetime

    titulo: str
    ano_lancamento: int | None = None
    sinopse: str | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None
    nota_media: float | None = None