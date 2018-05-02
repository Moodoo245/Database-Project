import csv
import unicodedata
import re

def numbers(idx):
    return re.sub('[^0-9|]+', '', idx)
def double(idx):
    return re.sub('[^0-9.|]+', '', idx)
def lettres(idx):
    return re.sub('[^A-Za-z| ]+', '', idx)
def alet(idx):
    return re.sub('[^0-9A-Za-z| ]+', '', idx)
def acc(idx):
    nfkd_form = unicodedata.normalize('NFKD', idx)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])
def diff_letters(a,b):
    return abs(len(a) - len(b))
