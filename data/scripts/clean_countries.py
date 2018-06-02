import csv
import unicodedata
import re
import utils

with open('cleaned/countries_cleaned.csv', 'w', encoding='utf8') as fout, \
    open('cleaned/country_map.csv', 'w', encoding='utf8') as fcountry_map:
    out = csv.writer(fout)
    country_map = csv.writer(fcountry_map)
    out.writerow((1, ''))
    country_map.writerow(('', 1))
    added = set()
    countryId = 2

	# Add the ReleasedIn
    with open('initial/release_dates.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.lettres(utils.acc(row[1])).lstrip()
            if name == 'Democratic Republic of Congo':
                name = 'Democratic Republic of the Congo'
            if name.lower() != 'null' and len(name) > 0 and name not in added:
                out.writerow((countryId, name))
                country_map.writerow((name, countryId))
                added.add(name)
                countryId += 1

	# Add the running Times
    with open('initial/running_times.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.lettres(utils.acc(row[1])).lstrip()
            if name == 'Democratic Republic of Congo':
                name = 'Democratic Republic of the Congo'
            if name == 'None':
                name = ''
            if name.lower() != 'null' and len(name) > 0 and name not in added:
                out.writerow((countryId, name))
                country_map.writerow((name, countryId))
                added.add(name)
                countryId += 1

	# Add the associated
    with open('initial/countries.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.lettres(utils.acc(row[1])).lstrip()
            if name == 'Democratic Republic of Congo':
                name = 'Democratic Republic of the Congo'
            if name.lower() != 'null' and len(name) > 0 and name not in added:
                out.writerow((countryId, name))
                country_map.writerow((name, countryId))
                added.add(name)
                countryId += 1
