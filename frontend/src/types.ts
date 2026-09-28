export interface Genre {
  sk_genre_id?: string;
  nome_genero: string;
}

export interface Person {
  sk_person_id?: string;
  nome_pessoa: string;
  tipo_pessoa: string;
}

export interface Review {
  sk_movie_review_id?: string;
  sk_movie_id?: string;
  nome: string;
  nota: number;
  comentario: string;
  created_at?: string;
}

export interface Movie {
  sk_movie_id: string;
  id_filme?: string;
  titulo: string;
  sinopse?: string;
  ano_lancamento?: number;
  duracao_minutos?: number;
  url_poster?: string;
  url_backdrop?: string;
  nota_media?: number;
  genres?: Genre[];
}

export interface MovieDetail extends Movie {
  data_lancamento?: string;
  status_filme?: string;
  people?: Person[];
  reviews?: Review[];
  total_avaliacoes?: number;
}

export interface MovieInput {
  titulo?: string;
  genero: string;
  diretor?: string;
  sinopse?: string;
  ano_lancamento?: number;
  data_lancamento?: string;
  duracao_minutos?: number;
  status_filme?: string;
  url_poster?: string;
  url_backdrop?: string;
}

export interface PaginatedMoviesResponse {
  items: Movie[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface WatchlistItem {
  sk_watchlist_id: string;
  sk_movie_id: string;
  created_at: string;
  titulo: string;
  ano_lancamento?: number;
  sinopse?: string;
  url_poster?: string;
  url_backdrop?: string;
  nota_media?: number;
}