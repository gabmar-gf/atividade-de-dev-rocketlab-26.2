# RocketLab 2026.2 — Sistema de Avaliação de Filmes

Aplicação web para gerenciamento e avaliação de filmes, desenvolvida como parte da atividade DEV do RocketLab 2026.2.

O sistema permite gerenciar um catálogo de filmes, consultar seus detalhes, realizar avaliações e organizar filmes em uma lista de interesse.

## Tecnologias utilizadas

### Frontend

- Vite
- React
- TypeScript
- Axios
- React Router
- Lucide React

### Backend

- Python 3.11+
- FastAPI
- SQLAlchemy 2.0
- Alembic
- Pydantic
- SQLite

---

## Estrutura do projeto

```text
.
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── movies/
│   │   ├── watchlist/
│   │   └── main.py
│   │
│   ├── data/
│   │   └── *.csv
│   │
│   ├── migrations/
│   │   └── versions/
│   │
│   ├── tests/
│   │
│   ├── .env.example
│   ├── alembic.ini
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── seed.py
│
├── frontend/
│   ├── components/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   └── types.ts
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# Execução

## Pré-requisitos

É necessário ter instalado:

- Python 3.11 ou superior
- Node.js e npm
- Git

---

## 1. Configuração do Backend

Entre na pasta do backend:

```bash
cd backend
```

Crie um ambiente virtual:

### Windows

```powershell
python -m venv .venv
```

Ative o ambiente virtual:

```powershell
.venv\Scripts\Activate.ps1
```

Caso esteja utilizando o Prompt de Comando:

```cmd
.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie o arquivo `.env` a partir do arquivo de exemplo:

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Execute as migrações do banco de dados:

```bash
alembic upgrade head
```

## População do banco de dados

Os dados iniciais dos filmes são fornecidos em arquivos CSV, localizados na pasta `backend/data/`.

Esses arquivos são utilizados pelo script `backend/seed.py`, responsável por ler os dados e popular o banco de dados SQLite.

A pasta `backend/data/` não é versionada no Git, pois os arquivos CSV correspondem à base de dados fornecida para a atividade.

Caso os arquivos CSV estejam disponíveis localmente, após executar as migrations, execute:

```bash
python seed.py

Inicie o servidor:

```bash
uvicorn app.main:app --reload
```

O backend ficará disponível em:

```text
http://localhost:8000
```

A documentação automática da API pode ser acessada em:

```text
http://localhost:8000/docs
```

Também é possível verificar se a aplicação iniciou corretamente através do endpoint:

```text
http://localhost:8000/health
```

---

## 2. Configuração do Frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço para acesso à aplicação, normalmente:

```text
http://localhost:5173
```

Com o backend e o frontend executando simultaneamente, a aplicação estará pronta para uso.

---

# Funcionalidades

## Catálogo de filmes

O sistema possui um catálogo paginado com os filmes cadastrados.

É possível:

- Navegar entre as páginas do catálogo;
- Buscar filmes por título;
- Filtrar filmes por gênero;
- Ordenar os filmes;
- Filtrar filmes cadastrados manualmente;
- Visualizar informações principais dos filmes;
- Acessar a página de detalhes de cada filme.

---

## Cadastro de filmes

É possível cadastrar novos filmes informando:

- Título;
- Diretor;
- Gênero;
- Ano de lançamento;
- Duração;
- Sinopse;
- URL do pôster.

Os gêneros são carregados diretamente do backend.

Na interface, os gêneros são apresentados em português, enquanto os valores originais são mantidos internamente para garantir compatibilidade com os dados armazenados no banco de dados.

---

## Detalhes do filme

A página de detalhes apresenta informações completas do filme, incluindo:

- Título;
- Gênero;
- Diretor;
- Ano de lançamento;
- Duração;
- Sinopse;
- Pôster;
- Avaliações;
- Média das avaliações.

Também é possível acessar o histórico de avaliações realizadas para cada filme.

---

## Gerenciamento de filmes

Os filmes podem ser gerenciados individualmente através das operações:

- Cadastro;
- Consulta;
- Atualização;
- Exclusão.

---

## Avaliações

O sistema permite adicionar avaliações aos filmes.

Cada avaliação pode conter:

- Nome do avaliador;
- Nota;
- Comentário.

Também é possível:

- Visualizar as avaliações de um filme;
- Consultar o histórico de avaliações;
- Remover avaliações;
- Visualizar a média das avaliações de cada filme.

---

## Lista de filmes para assistir

Foi implementada uma funcionalidade adicional de lista de interesse (watchlist).

É possível:

- Adicionar um filme à lista;
- Visualizar os filmes adicionados;
- Remover filmes da lista.

A watchlist é persistida no banco de dados e possui relacionamento com os filmes cadastrados.

---

# API

O backend foi desenvolvido utilizando FastAPI e disponibiliza endpoints para gerenciamento de filmes, gêneros, avaliações e watchlist.

A documentação interativa da API pode ser acessada através de:

```text
http://localhost:8000/docs
```

Principais recursos da API:

```text
/api/v1/movies
/api/v1/movies/genres
/api/v1/movies/reviews
/api/v1/watchlist
```

O backend também possui o endpoint:

```text
/health
```

utilizado para verificar se a aplicação está funcionando corretamente.

---

# Banco de dados e migrações

O projeto utiliza SQLite como banco de dados e SQLAlchemy 2.0 como ORM.

As alterações estruturais do banco de dados são controladas através do Alembic.

Para aplicar as migrações existentes:

```bash
alembic upgrade head
```

Para criar uma nova migração após alterações nos modelos:

```bash
alembic revision --autogenerate -m "descreva a alteração"
```

Depois, aplique a nova migração:

```bash
alembic upgrade head
```

O banco de dados utilizado localmente é:

```text
backend/rocketlab.db
```

---

# Executando a aplicação

Para executar a aplicação completa, são necessários dois terminais.

### Terminal 1 — Backend

```bash
cd backend
```

Ative o ambiente virtual e execute:

```bash
uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Depois, acesse no navegador o endereço informado pelo Vite.

O frontend realiza as requisições para a API através de:

```text
http://localhost:8000/api/v1
```

---

# Observações

- O backend deve estar em execução para que o frontend consiga realizar as operações de consulta e gerenciamento.
- O banco de dados SQLite é local e fica armazenado em `backend/rocketlab.db`.
- As tabelas do banco são gerenciadas através das migrações do Alembic.
- As dependências do backend estão especificadas em `backend/requirements.txt`.
- As dependências do frontend estão especificadas em `frontend/package.json`.
