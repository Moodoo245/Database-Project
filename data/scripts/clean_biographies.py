import csv
import unicodedata
import re
import utils

with open('initial/biographies.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    bio = open('cleaned/biographies_cleaned.csv', 'w', encoding="utf8")
    wr_bio = csv.writer(bio)
    sp = open('cleaned/spouses_cleaned.csv', 'w', encoding='utf8')
    wr_sp = csv.writer(sp)
    booksf = open('cleaned/biographical_books_cleaned.csv', 'w', encoding='utf8')
    wr_book = csv.writer(booksf)
    nicks = open('cleaned/nicknames_cleaned.csv', 'w', encoding='utf8')
    wr_nick = csv.writer(nicks)

    staff_map = utils.get_staff_map()
    added = set()
    added_spouses = set()
    added_books = set()
    added_nicks = set()
    for row in reader:
        name = row[0]
        if name in staff_map and len(row)==15:
            staffid = staff_map[name]
            if staffid not in added:
                real_name = row[1]
                date_and_place_of_birth = row[3]
                height = row[4]
                biography = row[5]
                biographer = row[6]
                date_and_cause_of_death = row[7]
                trivia = row[9]
                personal_quotes = row[11]
                salary = row[12]
                trademark = row[13]
                where_are_they_now = row[14]
                new_row = (staffid, name, real_name, date_and_place_of_birth, height, biography, biographer, date_and_cause_of_death, trivia, personal_quotes, salary, trademark, where_are_they_now)
                wr_bio.writerow(new_row)
                added.add(staffid)

                if len(row[8]) > 0:
                    spouses = re.split("\|", row[8][1:-1])
                    for spouse in spouses:
                        pair = (staffid, spouse)
                        if pair not in added_spouses:
                            wr_sp.writerow(pair)
                            added_spouses.add(pair)

                if len(row[10]) > 0:
                    books = re.split("\|", row[10][1:-1])
                    for book in books:
                        pair = (staffid, book)
                        if pair not in added_books:
                            wr_book.writerow(pair)
                            added_books.add(pair)
            
                if len(row[2]) > 0:
                    nicknames = re.split("\|", row[2][1:-1])
                    for nickname in nicknames:
                        pair = (staffid, nickname)
                        if pair not in added_nicks:
                            wr_nick.writerow(pair)
                            added_nicks.add(pair)
    bio.close()
    sp.close()
    booksf.close()
    nicks.close()
