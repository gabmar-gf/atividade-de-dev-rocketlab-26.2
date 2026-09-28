import React, { useEffect, useState } from 'react';
import { Search, Star, Trash2 } from 'lucide-react';
import {
  getReviews,
  deleteReview,
} from '../services/api';

interface ReviewItem {
  sk_movie_review_id: string;
  sk_movie_id: string;
  titulo: string;
  nome: string;
  nota: number;
  comentario: string;
  created_at: string;
}

export const RatingsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const data = await getReviews(search);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      'Deseja realmente excluir esta avaliação?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(id);

      await deleteReview(id);

      setReviews((currentReviews) =>
        currentReviews.filter(
          (review) =>
            review.sk_movie_review_id !== id
        )
      );
    } catch (err) {
      console.error(err);
      alert(
        'Não foi possível excluir a avaliação.'
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <header
        style={{
          marginBottom: '24px',
        }}
      >
        <h1
          style={{
            margin: '0 0 8px 0',
          }}
        >
          Avaliações
        </h1>

        <p
          style={{
            margin: 0,
            color: '#9ab',
          }}
        >
          Gerencie as avaliações dos usuários.
        </p>
      </header>

      <div
        style={{
          position: 'relative',
          marginBottom: '24px',
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
          placeholder="Pesquisar por filme, usuário ou comentário..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: '100%',
            padding: '12px 12px 12px 40px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: '#1e252c',
            color: '#fff',
            fontSize: '16px',
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
      </div>

      {loading ? (
        <p>Carregando avaliações...</p>
      ) : reviews.length === 0 ? (
        <div
          style={{
            background: '#1e252c',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            color: '#888',
          }}
        >
          {search
            ? 'Nenhuma avaliação encontrada.'
            : 'Nenhuma avaliação cadastrada.'}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.sk_movie_review_id}
              style={{
                background: '#1e252c',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #2c3440',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '18px',
                    }}
                  >
                    {review.titulo}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        color: '#ddd',
                        fontWeight: 'bold',
                      }}
                    >
                      {review.nome}
                    </span>

                    <span
                      style={{
                        color: '#666',
                      }}
                    >
                      •
                    </span>

                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#ffb400',
                        fontWeight: 'bold',
                      }}
                    >
                      <Star
                        size={16}
                        fill="#ffb400"
                      />
                      {review.nota}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: '#ccc',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {review.comentario}
                  </p>

                  {review.created_at && (
                    <p
                      style={{
                        margin: '12px 0 0 0',
                        color: '#777',
                        fontSize: '13px',
                      }}
                    >
                      {new Date(
                        review.created_at
                      ).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    handleDelete(
                      review.sk_movie_review_id
                    )
                  }
                  disabled={
                    deleting ===
                    review.sk_movie_review_id
                  }
                  title="Excluir avaliação"
                  style={{
                    padding: '8px 10px',
                    background: '#e54d42',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor:
                      deleting ===
                      review.sk_movie_review_id
                        ? 'not-allowed'
                        : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity:
                      deleting ===
                      review.sk_movie_review_id
                        ? 0.6
                        : 1,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};