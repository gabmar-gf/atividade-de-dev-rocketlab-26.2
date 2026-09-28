import os
import sqlite3
import pandas as pd

# Caminhos padrão a partir do diretório backend/
DB_PATH = "rocketlab.db"
DATA_DIR = "data"

# Mapeamento do nome do arquivo CSV para a tabela correspondente no banco
# A ordem garante que as tabelas de dimensão sejam populadas antes das tabelas de relacionamento/fato
SEED_FILES = [
    ("dim_movies.csv", "dim_movies"),
    ("dim_genres.csv", "dim_genres"),
    ("dim_companies.csv", "dim_companies"),
    ("dim_people.csv", "dim_people"),
    ("dim_reviews.csv", "dim_reviews"),
    ("bridge_movie_genre.csv", "bridge_movie_genre"),
    ("bridge_movie_company.csv", "bridge_movie_company"),
    ("bridge_movie_person.csv", "bridge_movie_person"),
    ("fact_movies_performance.csv", "fact_movies_performance"),
    ("movies_reviews.csv", "movie_reviews"),  # Nome da tabela conforme o README
]

def seed_database():
    if not os.path.exists(DB_PATH):
        print(f"Erro: Banco de dados '{DB_PATH}' não encontrado.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Descobre as tabelas reais existentes no banco para validação
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    existing_tables = {row[0] for row in cursor.fetchall()}

    for csv_filename, table_name in SEED_FILES:
        # Ajusta nome da tabela se existir variação (ex: movies_reviews vs movie_reviews)
        target_table = table_name
        if target_table not in existing_tables and csv_filename.replace(".csv", "") in existing_tables:
            target_table = csv_filename.replace(".csv", "")

        csv_path = os.path.join(DATA_DIR, csv_filename)
        if not os.path.exists(csv_path):
            print(f" Arquivo de dados {csv_path} não encontrado. Pulando...")
            continue

        if target_table not in existing_tables:
            print(f" Tabela '{target_table}' não encontrada no banco. Pulando...")
            continue

        print(f"Importando {csv_filename} -> tabela {target_table}...")
        df = pd.read_csv(csv_path)

        # Insere dados sem sobrescrever o schema da tabela
        df.to_sql(target_table, con=conn, if_exists="append", index=False)

    conn.close()
    print("\nCarga de dados concluída com sucesso.")

if __name__ == "__main__":
    seed_database()