import utils
import csv
import re

with open('initial/directors.csv', 'r', encoding='utf8') as data:
    reader = csv.reader(data)
    with open('cleaned/directs_cleaned.csv', 'w', encoding='utf8') as out:
        writer = csv.writer(out)
        staff_map = utils.get_staff_map()
		clips = utils.get_clip_set()
        next(reader)

        added = set()

        for row in reader:
            name = utils.lettres(row[0]).lstrip()
            clipIds = re.split("\|", row[1][1:-1])
            roles = re.split("\|", row[2][1:-1])
            addInfos = re.split("\|", row[3][1:-1])
            size = len(clipIds)
            if name in staff_map and len(roles) == size and len(addInfos) == size:
                for i in range(size):
					if clipIds[i] in clips:
						staffid = staff_map[name]
						clipId = clipIds[i]
						pair = (staffid, clipId)
						if pair not in added:
							role = utils.alet(roles[i])
							addInf = utils.alet(addInfos[i])
							writer.writerow((staffid, clipId, role, addInf))
							added.add(pair)
