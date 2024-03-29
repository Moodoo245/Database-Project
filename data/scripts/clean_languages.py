import csv
import unicodedata
import re
import utils

languages = set()
languageId = 1
language_map = {}

clips = utils.get_clip_set()

with open('initial/languages.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/languages_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            if row[0] in clips:
                clipid = row[0]
                language = row[1]
                l = utils.acc(language)
                b = utils.lettres(l)
                if b == 'some dialogue with English subtitles some without':
                    b = 'English'

                if utils.diff_letters(l, b) < 2 and len(b) != 0 and b.lower() != 'null' and b.lower() != 'none':
                    if b not in languages:
                        new_row = (languageId, b)
                        if new_row not in added:
                            languages.add(b)
                            language_map[b] = languageId
                            languageId += 1
                            wr.writerow(new_row)
                            added.add(new_row)
                    else:
                        new_row = (language_map[b], b) 
                        if new_row not in added:
                            wr.writerow(new_row)
                            added.add(new_row)

with open('initial/languages.csv', encoding="utf8") as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    with open('cleaned/speaks_cleaned.csv', 'w', encoding="utf8") as out:
        wr = csv.writer(out)
        added = set()
        for row in reader:
            if row[0] in clips:
                clipid = row[0]
                language = row[1]
                l = utils.acc(language)
                b = utils.lettres(l)
                if b == 'some dialogue with English subtitles some without':
                    b = 'English'
                if b in languages:
                    new_row = (clipid, language_map[b])
                    if new_row not in added:
                        wr.writerow(new_row)
                        added.add(new_row)
