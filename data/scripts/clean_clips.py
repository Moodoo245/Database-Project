import csv
import unicodedata
import re
import utils

with open('initial/clips.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/clips_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            clipid = row[0]
            # Only keep the numbers in the "Year" column
            only_numbers = utils.numbers(row[2])
            # Only keep the doubles in the "ClipType" column
            only_letters = utils.lettres(row[3])
            if len(clipid) != 0 and clipid.lower() != 'null' and (clipid) not in added:
                wr.writerow((clipid, row[1], only_numbers, only_letters))
                added.add((clipid))
