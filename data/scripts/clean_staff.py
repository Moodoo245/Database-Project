import utils
import csv

with open('cleaned/staff_cleaned.csv', 'w', encoding='utf8') as out:
    wr = csv.writer(out)
    added = set()

    # Add the actors
    with open('initial/actors.csv', 'r', encoding='utf8') as inp:
        read = csv.reader(inp)
        next(read)
        for row in read:
            name = utils.lettres(row[0]).lstrip()
            if name.lower() != 'null' and name not in added:
                wr.writerow([name])
                added.add(name)

    # Add the writers
    with open('initial/writers.csv', 'r', encoding='utf8') as inp:
        read = csv.reader(inp)
        next(read)
        for row in read:
            name = utils.lettres(row[0]).lstrip()
            if name.lower() != 'null' and name not in added:
                wr.writerow([name])
                added.add(name)

    # Add the producers
    with open('initial/producers.csv', 'r', encoding='utf8') as inp:
        read = csv.reader(inp)
        next(read)
        for row in read:
            name = utils.lettres(row[0]).lstrip()
            if name.lower() != 'null' and name not in added:
                wr.writerow([name])
                added.add(name)

    # Add the directors
    with open('initial/directors.csv', 'r', encoding='utf8') as inp:
        read = csv.reader(inp)
        next(read)
        for row in read:
            name = utils.lettres(row[0]).lstrip()
            if name.lower() != 'null' and name not in added:
                wr.writerow([name])
                added.add(name)


