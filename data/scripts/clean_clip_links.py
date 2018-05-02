import csv
import unicodedata
import re
import utils

with open('initial/clip_links.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/clip_links_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            new_row = (row[0], row[1], row[2])
            if len(row[0]) != 0 and row[0].lower() != 'null' and len(row[1]) != 0 and row[1].lower() != 'null' and new_row not in added:
                wr.writerow(new_row)
                added.add(new_row)
