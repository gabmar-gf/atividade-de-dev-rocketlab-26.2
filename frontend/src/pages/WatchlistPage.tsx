import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWatchlist, removeFromWatchlist } from '../services/api';
import type { WatchlistItem } from '../types';
import { Trash2 } from 'lucide-react';

export const WatchlistPage: React.FC = () => {
  const [movies, setMovies] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (movieId: string) => {
    if (confirm('Deseja remover este filme da sua lista?')) {
      try {
        await removeFromWatchlist(movieId);

        setMovies((currentMovies) =>
          currentMovies.filter(
            (movie) => movie.sk_movie_id !== movieId
          )
        );
      } catch (err) {
        console.error(err);
        alert('Não foi possível remover o filme da sua lista.');
      }
    }
  };

  if (loading) {
    return <p>Carregando minha lista...</p>;
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <h1>Minha Lista</h1>

      {movies.length === 0 ? (
        <p>Sua lista está vazia.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '24px',
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.sk_watchlist_id}
              style={{
                background: '#1e252c',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {movie.url_poster ? (
                <img
                  src={movie.url_poster}
                  alt={movie.titulo}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#2c3440',
                    color: '#888',
                  }}
                >
                  Sem Capa
                </div>
              )}

              <div style={{ padding: '12px' }}>
                <h3 style={{ margin: '0 0 8px' }}>
                  {movie.titulo}
                </h3>

                {movie.ano_lancamento && (
                  <p
                    style={{
                      margin: '0 0 12px',
                      color: '#aaa',
                    }}
                  >
                    {movie.ano_lancamento}
                  </p>
                )}

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <Link
                    to={`/movies/${movie.sk_movie_id}`}
                    style={{
                      flex: 1,
                      display: 'block',
                      padding: '8px',
                      background: '#2c3440',
                      color: '#fff',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}
                  >
                    Ver detalhes
                  </Link>

                  <button
                    onClick={() =>
                      handleRemove(movie.sk_movie_id)
                    }
                    title="Remover da lista"
                    style={{
                      padding: '8px 10px',
                      background: '#e54d42',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};