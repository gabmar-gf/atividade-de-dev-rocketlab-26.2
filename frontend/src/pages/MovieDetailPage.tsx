import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById, addReview } from '../services/api';
import type { MovieDetail } from '../types';
import { Star, ArrowLeft } from 'lucide-react';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [nome, setNome] = useState('');
  const [nota, setNota] = useState(10);
  const [comentario, setComentario] = useState('');

  const loadMovie = async () => {
    if (id) {
      try {
        const data = await getMovieById(id);
        setMovie(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadMovie();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !nome || !comentario) return;

    await addReview(id, {
      nome,
      nota,
      comentario,
    });

    setNome('');
    setComentario('');
    loadMovie();
  };

  if (!movie) {
    return <div style={{ padding: '20px' }}>Carregando detalhes...</div>;
  }

  const diretor = movie.people?.find(
    (person) => person.tipo_pessoa === 'Diretor'
  );

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <Link
        to="/"
        style={{
          color: '#00e054',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '20px',
        }}
      >
        <ArrowLeft size={18} />
        Voltar ao Catálogo
      </Link>

      <div
        style={{
          display: 'flex',
          gap: '30px',
          background: '#1e252c',
          padding: '24px',
          borderRadius: '12px',
        }}
      >
        <img
          src={movie.url_poster || 'https://via.placeholder.com/300x450'}
          alt={movie.titulo}
          style={{
            width: '260px',
            borderRadius: '8px',
            objectFit: 'cover',
          }}
        />

        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: '0 0 10px 0',
              fontSize: '32px',
              lineHeight: '1.1',
            }}
          >
            {movie.titulo}
          </h1>

          <p
            style={{
              color: '#888',
              margin: '0 0 8px 0',
            }}
          >
            {movie.ano_lancamento} • {movie.duracao_minutos || 'N/A'} min
          </p>

          {diretor && (
            <p
              style={{
                color: '#ccc',
                margin: '0 0 16px 0',
              }}
            >
              <strong>Diretor:</strong> {diretor.nome_pessoa}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '20px',
              color: '#ffb400',
              marginBottom: '20px',
            }}
          >
            <Star fill="#ffb400" size={24} />

            <strong>
              {movie.nota_media
                ? movie.nota_media.toFixed(1)
                : 'Sem avaliações'}
            </strong>

            <span
              style={{
                fontSize: '14px',
                color: '#888',
              }}
            >
              ({movie.total_avaliacoes} avaliações)
            </span>
          </div>

          <h3>Sinopse</h3>

          <p
            style={{
              lineHeight: '1.6',
              color: '#ccc',
            }}
          >
            {movie.sinopse || 'Nenhuma sinopse cadastrada.'}
          </p>

          {movie.genres && movie.genres.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <strong>Gêneros: </strong>
              {movie.genres.map((g) => g.nome_genero).join(', ')}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Avaliações dos Usuários</h2>

        <form
          onSubmit={handleReviewSubmit}
          style={{
            background: '#1e252c',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
          }}
        >
          <h3>Adicionar Nova Avaliação</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <input
              type="text"
              placeholder="Seu Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{
                padding: '8px',
                background: '#2c3440',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
              }}
            />

            <select
              value={nota}
              onChange={(e) => setNota(Number(e.target.value))}
              style={{
                padding: '8px',
                background: '#2c3440',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
              }}
            >
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Escreva sua resenha sobre o filme..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
            rows={3}
            style={{
              width: '100%',
              padding: '8px',
              background: '#2c3440',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
              marginBottom: '12px',
            }}
          />

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: '#00e054',
              color: '#14181c',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Publicar Avaliação
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {!movie.reviews || movie.reviews.length === 0 ? (
            <p>Nenhuma resenha cadastrada ainda.</p>
          ) : (
            movie.reviews.map((r) => (
              <div
                key={r.sk_movie_review_id}
                style={{
                  background: '#1e252c',
                  padding: '16px',
                  borderRadius: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <strong>{r.nome}</strong>

                  <span style={{ color: '#ffb400' }}>
                    {r.nota} ★
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: '#ddd',
                  }}
                >
                  {r.comentario}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};