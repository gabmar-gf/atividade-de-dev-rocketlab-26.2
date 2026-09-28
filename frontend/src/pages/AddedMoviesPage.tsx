import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMovies, deleteMovie } from '../services/api';
import type { Movie } from '../types';
import { Eye, Star, Trash2 } from 'lucide-react';

export const AddedMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);

    try {
      const data = await getMovies(page, 12, search, true);
      setMovies(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente remover este filme?')) {
      await deleteMovie(id);
      fetchMovies();
    }
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <header
        style={{
          marginBottom: '24px',
        }}
      >
        <h1>Filmes Adicionados</h1>

        <p
          style={{
            color: '#9ab',
            marginTop: '8px',
          }}
        >
          Filmes cadastrados manualmente pelo administrador.
        </p>
      </header>

      <div
        style={{
          marginBottom: '24px',
        }}
      >
        <input
          type="text"
          placeholder="Buscar filme"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: '#1e252c',
            color: '#fff',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {loading ? (
        <p>Carregando filmes...</p>
      ) : movies.length === 0 ? (
        <p>Nenhum filme adicionado pelo administrador.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          {movies.map((m) => (
            <div
              key={m.sk_movie_id}
              style={{
                background: '#1e252c',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {m.url_poster ? (
                <img
                  src={m.url_poster}
                  alt={m.titulo}
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
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  Sem Capa
                </div>
              )}

              <div
                style={{
                  padding: '12px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: '0 0 6px 0',
                      fontSize: '16px',
                    }}
                  >
                    {m.titulo} ({m.ano_lancamento || 'N/A'})
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#ffb400',
                      marginBottom: '8px',
                    }}
                  >
                    <Star size={16} fill="#ffb400" />
                    <span>
                      {m.nota_media
                        ? m.nota_media.toFixed(1)
                        : 'Sem notas'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px',
                  }}
                >
                  <Link
                    to={`/movies/${m.sk_movie_id}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '6px',
                      background: '#2c3440',
                      color: '#fff',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Eye size={14} />
                    Detalhes
                  </Link>

                  <button
                    onClick={() => handleDelete(m.sk_movie_id)}
                    title="Excluir filme"
                    style={{
                      padding: '6px 10px',
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
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '32px',
        }}
      >
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          Anterior
        </button>

        <span style={{ alignSelf: 'center' }}>
          Página {page} de {totalPages || 1}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};