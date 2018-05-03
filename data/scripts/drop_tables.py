import psycopg2
import os

dbname = os.getenv('PGDATABASE', 'database')
user = os.getenv('PGUSER', 'postgres')
password = os.getenv('PGPASSWORD', '')
host = os.getenv('PGHOST', 'localhost')
port = os.getenv('PGPORT', 5432)

conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)
cur = conn.cursor()

with open('scripts/drop_tables.sql') as sql_file:
    sql = sql_file.read()
    cur.execute(sql)

conn.commit()

cur.close()
conn.close()
