import csv
import unicodedata
import re
import utils

clips = utils.get_clip_set()

with open('initial/ratings.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/ratings_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            if row[0] in clips:
                clipid = row[0]
                # Only keep the numbers in the "Votes" column
                only_numbers = utils.numbers(row[1])
                # Only keep the doubles in the "Rank" column
                only_double = utils.double(row[2])
                if len(only_numbers) != 0 and only_numbers.lower() != 'null' and len(only_double) != 0 and only_double.lower() != 'null' and (clipid) not in added:
                    wr.writerow((clipid, only_numbers, only_double))
                    added.add((clipid))
