import csv
import unicodedata
import re
import utils

with open('cleaned/countries_cleaned.csv', 'w', encoding='utf8') as fout, \
    open('cleaned/country_map.csv', 'w', encoding='utf8') as fcountry_map:
    out = csv.writer(fout)
    country_map = csv.writer(fcountry_map)

    added = set()
    countryId = 1

	# Add the ReleasedIn
    with open('initial/release_dates.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.null_to_empty_string(utils.lettres(utils.acc(row[1])).lstrip())
            if name.lower() != 'null' and name not in added:
                out.writerow((countryId, name))
                country_map.writerow((name, countryId))
                added.add(name)
                countryId += 1

	# Add the running Times
    with open('initial/running_times.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.null_to_empty_string(utils.lettres(utils.acc(row[1])).lstrip())
            if name.lower() != 'null' and name not in added:
                out.writerow((countryId, name))
                country_map.writerow((name, countryId))
                added.add(name)
                countryId += 1

	# Add the associated
    with open('initial/countries.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.null_to_empty_string(utils.lettres(utils.acc(row[1])).lstrip())
            if name.lower() != 'null' and name not in added:
                out.writerow((countryId, name))
                country_map.writerow((name, countryId))
                added.add(name)
                countryId += 1