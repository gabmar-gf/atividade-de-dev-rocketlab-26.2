import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createMovie, getGenres } from '../services/api';
import { ArrowLeft } from 'lucide-react';

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

export const MovieFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [diretor, setDiretor] = useState('');
  const [sinopse, setSinopse] = useState('');
  const [ano, setAno] = useState<number | ''>('');
  const [duracao, setDuracao] = useState<number | ''>('');
  const [urlPoster, setUrlPoster] = useState('');

  const [generos, setGeneros] = useState<string[]>([]);
  const [loadingGeneros, setLoadingGeneros] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGeneros(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingGeneros(false);
      }
    };

    fetchGenres();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createMovie({
      titulo,
      genero,
      diretor: diretor || undefined,
      sinopse: sinopse || undefined,
      ano_lancamento: ano === '' ? undefined : Number(ano),
      duracao_minutos: duracao === '' ? undefined : Number(duracao),
      url_poster: urlPoster || undefined,
    });

    navigate('/movies');
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <Link
        to="/movies"
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

      <form
        onSubmit={handleSubmit}
        style={{
          background: '#1e252c',
          padding: '24px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2>Cadastrar Novo Filme</h2>

        <div>
          <label>Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              background: '#2c3440',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label>Gênero *</label>
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            required
            disabled={loadingGeneros}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              background: '#2c3440',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          >
            <option value="">
              {loadingGeneros
                ? 'Carregando gêneros...'
                : 'Selecione um gênero'}
            </option>

            {generos.map((nomeGenero) => (
              <option key={nomeGenero} value={nomeGenero}>
                {genreTranslations[nomeGenero] ?? nomeGenero}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Diretor</label>
          <input
            type="text"
            value={diretor}
            onChange={(e) => setDiretor(e.target.value)}
            placeholder="Nome do diretor"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              background: '#2c3440',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <div>
            <label>Ano de Lançamento</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ex: 2023"
              value={ano}
              onChange={(e) =>
                setAno(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '4px',
                background: '#2c3440',
                border: '1px solid #444',
                color: '#fff',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label>Duração (minutos)</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ex: 120"
              value={duracao}
              onChange={(e) =>
                setDuracao(
                  e.target.value === ''
                    ? ''
                    : Number(e.target.value)
                )
              }
              style={{
                width: '100%',
                padding: '10px',
                marginTop: '4px',
                background: '#2c3440',
                border: '1px solid #444',
                color: '#fff',
                borderRadius: '4px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div>
          <label>URL do Pôster (Capa)</label>
          <input
            type="url"
            value={urlPoster}
            onChange={(e) => setUrlPoster(e.target.value)}
            placeholder="https://exemplo.com/poster.jpg"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              background: '#2c3440',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label>Sinopse</label>
          <textarea
            value={sinopse}
            onChange={(e) => setSinopse(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '4px',
              background: '#2c3440',
              border: '1px solid #444',
              color: '#fff',
              borderRadius: '4px',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '12px',
            background: '#00e054',
            color: '#14181c',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Salvar Filme
        </button>
      </form>
    </div>
  );
};