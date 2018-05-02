import csv
import unicodedata
import re
import utils

with open('initial/running_times.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/running_times_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            clipid = row[0]
            no_accents = utils.acc(row[1])
            only_letters = utils.lettres(no_accents)
            new_row = (clipid, only_letters)
            # Only keep the numbers in the "RunningTime" column
            only_numbers = numbers(row[2])
            if utils.diff_letters(no_accents, only_letters) < 2 and len(only_letters) != 0 and only_letters.lower() != 'null' and new_row not in added:
                wr.writerow((clipid, only_letters, only_numbers))
                added.add(new_row)
