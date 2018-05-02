import utils
import csv

with open('cleaned/staff_cleaned.csv', 'w', encoding='utf8') as fout, \
    open('cleaned/staff_map.csv', 'w', encoding='utf8') as fstaff_map:
    out = csv.writer(fout)
    staff_map = csv.writer(fstaff_map)

    added = set()
    staffid = 1

    # Add the actors
    with open('initial/actors.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.lettres(row[0]).lstrip()
            if name.lower() != 'null' and name not in added:
                out.writerow((staffid, name))
                staff_map.writerow((name, staffid))
                added.add(name)
                staffid += 1

    # Add the writers
    with open('initial/writers.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.lettres(row[0]).lstrip()
            if name.lower() != 'null' and name not in added:
                out.writerow((staffid, name))
                staff_map.writerow((name, staffid))
                added.add(name)
                staffid += 1

    # Add the producers
    with open('initial/producers.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.lettres(row[0]).lstrip()
            if name.lower() != 'null' and name not in added:
                out.writerow((staffid, name))
                staff_map.writerow((name, staffid))
                added.add(name)
                staffid += 1

    # Add the directors
    with open('initial/directors.csv', 'r', encoding='utf8') as fdata:
        read = csv.reader(fdata)
        next(read)
        for row in read:
            name = utils.lettres(row[0]).lstrip()
            if name.lower() != 'null' and name not in added:
                out.writerow((staffid, name))
                staff_map.writerow((name, staffid))
                added.add(name)
                staffid += 1
