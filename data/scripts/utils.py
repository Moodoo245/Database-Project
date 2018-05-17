import csv
import unicodedata
import re

def numbers(idx):
    return re.sub('[^0-9|]+', '', idx)
def double(idx):
    return re.sub('[^0-9.|]+', '', idx)
def lettres(idx):
    return re.sub('[^A-Za-z- ]+', '', idx)
def alet(idx):
    return re.sub('[^0-9A-Za-z- ]+', '', idx)
def acc(idx):
    nfkd_form = unicodedata.normalize('NFKD', idx)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])
def diff_letters(a,b):
    return abs(len(a) - len(b))
def null_to_empty_string(idx):
    return re.sub('^(?![\s\S])','EMPTY', idx)

def get_staff_map():
    map = {}
    with open('cleaned/staff_map.csv', 'r', encoding='utf8') as data:
        reader = csv.reader(data)
        for name, id in reader:
            map[name] = int(id)

    return map


def get_country_map():
    map = {}
    with open('cleaned/country_map.csv', 'r', encoding='utf8') as data:
        reader = csv.reader(data)
        for name, id in reader:
            map[name] = int(id)

    return map

def get_clip_set():
    s = set()
    with open('cleaned/clips_set.csv', 'r', encoding='utf8') as data:
        reader = csv.reader(data)
        for id in reader:
            s.add(id)

    return s