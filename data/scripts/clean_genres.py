import csv
import unicodedata
import re
import utils

genres = set()
genreId = 1
genre_map = {}

clips = utils.get_clip_set()

with open('initial/genres.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/genres_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            if row[0] in clips:
                clipid = row[0]
                genre = row[1]
                l = utils.acc(genre)
                b = utils.lettres(l)
                if utils.diff_letters(l, b) < 2 and len(b) != 0 and b.lower() != 'null' and b.lower() != 'none':
                    if b not in genres:
                        new_row = (genreId, b)
                        if new_row not in added:
                            genres.add(b)
                            genre_map[b] = genreId
                            genreId += 1
                            wr.writerow(new_row)
                            added.add(new_row)
                    else:
                        new_row = (genre_map[b], b) 
                        if new_row not in added:
                            wr.writerow(new_row)
                            added.add(new_row)

with open('initial/genres.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/classified_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            if row[0] in clips:
                clipid = row[0]
                genre = row[1]
                l = utils.acc(genre)
                b = utils.lettres(l)
                if b in genres:
                    new_row = (clipid, genre_map[b])
                    wr.writerow(new_row)
