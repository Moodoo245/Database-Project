import argparse
import psycopg2
import os

parser = argparse.ArgumentParser(description='import a file into a table')
parser.add_argument('filename', help='the name of the file to import')
parser.add_argument('tablename', help='the name of the table to import data to')
args = parser.parse_args()

dbname = os.getenv('PGDATABASE', 'database')
user = os.getenv('PGUSER', 'postgres')
password = os.getenv('PGPASSWORD', '')
host = os.getenv('PGHOST', 'localhost')
port = os.getenv('PGPORT', 5432)

conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)
cur = conn.cursor()

query = 'COPY ' + args.tablename + ' FROM STDIN (format csv)'

with open(args.filename, 'r', encoding='utf8') as f:
    cur.copy_expert(query, f)

conn.commit()
