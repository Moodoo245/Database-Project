import csv
import unicodedata
import re
import utils

with open('initial/release_dates.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
   
    with open('cleaned/releasedates_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        country_map = utils.get_country_map()
		next(reader)

		added = set()

        for row in reader:
            clipid = row[0]
            no_accents = utils.acc(row[1])
            only_letters = utils.lettres(no_accents)
            null_to_empty_string = utils.null_to_empty_string(only_letters)
            new_row = (clipid, null_to_empty_string)
            # Only keep the numbers and the letters in the "ReleaseDate" column
            only_numbers_letters = utils.alet(row[2])
            if  null_to_empty_string in country_map and utils.diff_letters(no_accents, only_letters) < 2 and only_letters.lower() != 'null' and new_row not in added:
                wr.writerow((clipid, null_to_empty_string, only_numbers_letters))
                added.add(new_row)
