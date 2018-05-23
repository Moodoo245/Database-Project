import csv
import unicodedata
import re
import utils

with open('initial/release_dates.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
   
    with open('cleaned/releasedates_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        country_map = utils.get_country_map()
        clips = utils.get_clip_set()
        next(reader)

        added = set()

        for row in reader:
            if row[0] in clips:
                clipid = row[0]
                no_accents = utils.acc(row[1])
                only_letters = utils.lettres(no_accents)
                null_to_empty_string = utils.null_to_empty_string(only_letters)
                # Only keep the numbers and the letters in the "ReleaseDate" column
                only_numbers_letters = utils.alet(row[2])

                if null_to_empty_string in country_map:
                    countryId = country_map[null_to_empty_string]
                    new_row = (clipid, countryId)
                    if utils.diff_letters(l, b) < 2 and len(b) != 0 and b.lower() != 'null' and new_row not in added:
                        wr.writerow((clipid, countryId, null_to_empty_string, only_numbers_letters))
                        added.add(new_row)
