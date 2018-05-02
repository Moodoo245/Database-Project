import csv
import unicodedata
import re
import utils

with open('initial/biographies.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/biographies_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            name = row[0]
            real_name = row[1]
            nickname = row[2]
            date_and_place_of_birth = row[3]
            height = row[4]
            biography = row[5]
            biographer = row[6]
            date_and_cause_of_death = row[7]
            spouse = row[8]
            trivia = row[9]
            biographical_books = row[10]
            personal_quotes = row[11]
            salary = row[12]
            trademark = row[13]
            where_are_they_now = row[14]

            new_row = (name, real_name, nickname, date_and_place_of_birth, height, biography, biographer, date_and_cause_of_death, spouse, trivia, biographical_books, personal_quotes, salary, trademark, where_are_they_now)

            if len(name) != 0 and name.lower() != 'null' and new_row not in added:
                wr.writerow(new_row)
                added.add(new_row)
