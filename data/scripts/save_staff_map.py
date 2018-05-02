import psycopg2
import csv

conn_string = "host='localhost' dbname='clipsdb' user='postgres' password='donccnod'"

conn = psycopg2.connect(conn_string)

cursor = conn.cursor()

cursor.execute("SELECT * FROM MovieStaff")

with open('cleaned/staff_map.csv', 'w', encoding='utf8') as out:
    writer = csv.writer(out)
    for id, name in cursor.fetchall():
        writer.writerow((name, id))
