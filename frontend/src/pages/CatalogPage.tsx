import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getMovies,
  getGenres,
  deleteMovie,
  addToWatchlist,
} from '../services/api';
import type { Movie } from '../types';
import {
  Search,
  Plus,
  Star,
  Trash2,
  Eye,
  BookmarkPlus,
  Filter,
} from 'lucide-react';

const genreTranslations: Record<string, string> = {
  Action: 'Ação',
  Adventure: 'Aventura',
  Animation: 'Animação',
  Comedy: 'Comédia',
  Crime: 'Crime',
  Documentary: 'Documentário',
  Drama: 'Drama',
  Family: 'Família',
  Fantasy: 'Fantasia',
  History: 'História',
  Horror: 'Terror',
  Music: 'Música',
  Mystery: 'Mistério',
  Romance: 'Romance',
  'Science Fiction': 'Ficção Científica',
  Thriller: 'Suspense',
  'Tv Movie': 'Filme para TV',
  War: 'Guerra',
  Western: 'Faroeste',
};

export const CatalogPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchGenres = async () => {
    try {
      const data = await getGenres();
      setGenres(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);

    try {
      const data = await getMovies(
        page,
        12,
        search,
        false,
        sort,
        genre,
      );

      setMovies(data.items);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [page, search, sort, genre]);

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente remover este filme?')) {
      await deleteMovie(id);
      fetchMovies();
    }
  };

  const handleAddToWatchlist = async (id: string) => {
    try {
      await addToWatchlist(id);
      alert('Filme adicionado à sua watchlist!');
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 409) {
        alert('Este filme já está na sua watchlist.');
      } else {
        alert('Não foi possível adicionar o filme à watchlist.');
      }
    }
  };

  const handleGenreChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setGenre(event.target.value);
    setPage(1);
    setPageInput('1');
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSort(event.target.value);
    setPage(1);
    setPageInput('1');
  };

  const handlePageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageInput(event.target.value);
  };

  const handlePageInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== 'Enter') {
      return;
    }

    const value = Number(pageInput);

    if (Number.isNaN(value)) {
      setPageInput(String(page));
      return;
    }

    const targetPage = Math.min(
      Math.max(value, 1),
      totalPages || 1
    );

    setPage(targetPage);
    setPageInput(String(targetPage));
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1>Catálogo de Filmes</h1>

        <Link
          to="/movies/new"
          style={{
            padding: '10px 16px',
            backgroundColor: '#00e054',
            color: '#14181c',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={18} />
          Novo Filme
        </Link>
      </header>

      <div
        style={{
          position: 'relative',
          marginBottom: '16px',
        }}
      >
        <Search
          size={20}
          style={{
            position: 'absolute',
            left: '12px',
            top: '12px',
            color: '#888',
          }}
        />

        <input
          type="text"
          placeholder="Buscar filme"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
            setPageInput('1');
          }}
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: '#1e252c',
            color: '#fff',
            fontSize: '16px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '24px',
          padding: '14px',
          background: '#1e252c',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#aaa',
          }}
        >
          <Filter size={18} />
          <span>Filtros:</span>
        </div>

        <select
          value={genre}
          onChange={handleGenreChange}
          style={{
            padding: '9px 12px',
            borderRadius: '4px',
            border: '1px solid #333',
            background: '#2c3440',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="">Todos os gêneros</option>

          {genres.map((item) => (
            <option key={item} value={item}>
              {genreTranslations[item] || item}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={handleSortChange}
          style={{
            padding: '9px 12px',
            borderRadius: '4px',
            border: '1px solid #333',
            background: '#2c3440',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <option value="">Ordenação padrão</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
          <option value="rating_desc">Melhor nota</option>
          <option value="rating_asc">Pior nota</option>
        </select>
      </div>

      {loading ? (
        <p>Carregando filmes...</p>
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
                    onClick={() =>
                      handleAddToWatchlist(m.sk_movie_id)
                    }
                    title="Adicionar à watchlist"
                    style={{
                      padding: '6px 10px',
                      background: '#44505c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <BookmarkPlus size={14} />
                  </button>

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
          alignItems: 'center',
          gap: '12px',
          marginTop: '32px',
        }}
      >
        <button
          disabled={page <= 1}
          onClick={() => {
            setPage((p) => {
              const newPage = p - 1;
              setPageInput(String(newPage));
              return newPage;
            });
          }}
          style={{
            padding: '8px 16px',
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Anterior
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>Página</span>

          <input
            type="text"
            inputMode="numeric"
            min={1}
            max={totalPages || 1}
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown}
            style={{
              width: '55px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              background: '#2c3440',
              color: '#fff',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          />

          <span>
            de {totalPages || 1}
          </span>
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => {
            setPage((p) => {
              const newPage = p + 1;
              setPageInput(String(newPage));
              return newPage;
            });
          }}
          style={{
            padding: '8px 16px',
            cursor:
              page >= totalPages
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};