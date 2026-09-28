import axios from 'axios';
import type {
  MovieDetail,
  MovieInput,
  PaginatedMoviesResponse,
  Review,
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

export const getMovies = async (
  page = 1,
  size = 12,
  search = '',
  customOnly = false,
  sort = '',
  genre = '',
) => {
  const params: any = {
    page,
    size,
  };

  if (search) {
    params.search = search;
  }

  if (customOnly) {
    params.custom_only = true;
  }

  if (sort) {
    params.sort = sort;
  }

  if (genre) {
    params.genre = genre;
  }

  const response = await api.get('/movies', { params });

  return response.data as PaginatedMoviesResponse;
};

export const getGenres = async () => {
  const response = await api.get('/movies/genres');
  return response.data as string[];
};

export const getMovieById = async (sk_movie_id: string) => {
  const response = await api.get(`/movies/${sk_movie_id}`);
  return response.data as MovieDetail;
};

export const createMovie = async (movieData: MovieInput) => {
  const response = await api.post('/movies', movieData);
  return response.data as MovieDetail;
};

export const updateMovie = async (
  sk_movie_id: string,
  movieData: MovieInput
) => {
  const response = await api.put(`/movies/${sk_movie_id}`, movieData);
  return response.data as MovieDetail;
};

export const deleteMovie = async (sk_movie_id: string) => {
  await api.delete(`/movies/${sk_movie_id}`);
};

export const addReview = async (
  sk_movie_id: string,
  review: {
    nome: string;
    nota: number;
    comentario: string;
  }
) => {
  const response = await api.post(
    `/movies/${sk_movie_id}/reviews`,
    review
  );

  return response.data as Review;
};

export const addToWatchlist = async (sk_movie_id: string) => {
  const response = await api.post(`/watchlist/${sk_movie_id}`);
  return response.data;
};

export const getWatchlist = async () => {
  const response = await api.get('/watchlist');
  return response.data;
};

export const removeFromWatchlist = async (sk_movie_id: string) => {
  await api.delete(`/watchlist/${sk_movie_id}`);
};

export const getReviews = async (search = '') => {
  const params: Record<string, string> = {};

  if (search) {
    params.search = search;
  }

  const response = await api.get('/movies/reviews', { params });

  return response.data;
};

export const deleteReview = async (sk_movie_review_id: string) => {
  await api.delete(`/movies/reviews/${sk_movie_review_id}`);
};

export default api;