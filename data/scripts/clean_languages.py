import csv
import unicodedata
import re

def numbers(idx):
    return re.sub('[^0-9|]+', '', idx)
def lettres(idx):
    return re.sub('[^A-Za-z| ]+', '', idx)
def alet(idx):
    return re.sub('[^0-9A-Za-z| ]+', '', idx)
def acc(idx):
    nfkd_form = unicodedata.normalize('NFKD', idx)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])
def diff_letters(a,b):
    return abs(len(a) - len(b))

with open('initial_data/languages.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned_data/languages_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            clipid = row[0]
            l = acc(row[1])
            b = lettres(l)
            new_row = (clipid, b)
            if diff_letters(l, b) < 2 and len(b) != 0 and b.lower() != 'null' and new_row not in added:
                wr.writerow(new_row)
                added.add(new_row)
