all: delete clean

clean: clean_staff clean_clips clean_acts clean_writes clean_directs clean_produces clean_biographies clean_clip_links clean_countries clean_genres clean_languages clean_ratings clean_releasedates clean_running_times

clean_staff: scripts/clean_staff.py
	python scripts/clean_staff.py

clean_clips: scripts/clean_clips.py
	python scripts/clean_clips.py

clean_acts: scripts/clean_acts.py
	python scripts/clean_acts.py

clean_writes: scripts/clean_writes.py
	python scripts/clean_writes.py

clean_directs: scripts/clean_directs.py
	python scripts/clean_directs.py

clean_produces: scripts/clean_produces.py
	python scripts/clean_produces.py

clean_biographies: scripts/clean_biographies.py
	python scripts/clean_biographies.py

clean_clip_links: scripts/clean_clip_links.py
	python scripts/clean_clip_links.py

clean_countries: scripts/clean_countries.py
	python scripts/clean_countries.py

clean_genres: scripts/clean_genres.py
	python scripts/clean_genres.py

clean_languages: scripts/clean_languages.py
	python scripts/clean_languages.py

clean_ratings: scripts/clean_ratings.py
	python scripts/clean_ratings.py

clean_releasedates: scripts/clean_releasedates.py
	python scripts/clean_releasedates.py

clean_runningtimes: scripts/clean_runningtimes.py
	python scripts/clean_runningtimes.py

import_staff: scripts/import_csv.py cleaned/staff_cleaned.csv
	python scripts/import_csv.py cleaned/staff_cleaned.csv moviestaff

import_clips: scripts/import_csv.py cleaned/clips_cleaned.csv
	python scripts/import_csv.py cleaned/clips_cleaned.csv clips

import_acts: scripts/import_csv.py cleaned/acts_cleaned.csv
	python scripts/import_csv.py cleaned/acts_cleaned.csv acts

import_writes: scripts/import_csv.py cleaned/writes_cleaned.csv
	python scripts/import_csv.py cleaned/writes_cleaned.csv writes

import_directs: scripts/import_csv.py cleaned/directs_cleaned.csv
	python scripts/import_csv.py cleaned/directs_cleaned.csv directs

import_produces: scripts/import_csv.py cleaned/produces_cleaned.csv
	python scripts/import_csv.py cleaned/produces_cleaned.csv produces

import_biographies: scripts/import_csv.py cleaned/biographies_cleaned.csv
	python scripts/import_csv.py cleaned/biographies_cleaned.csv biographies

import_clip_links: scripts/import_csv.py cleaned/clip_links_cleaned.csv
	python scripts/import_csv.py cleaned/clip_links_cleaned.csv clip_links

import_countries: scripts/import_csv.py cleaned/countries_cleaned.csv
	python scripts/import_csv.py cleaned/countries_cleaned.csv countries

import_genres: scripts/import_csv.py cleaned/genres_cleaned.csv
	python scripts/import_csv.py cleaned/genres_cleaned.csv genres

import_languages: scripts/import_csv.py cleaned/languages_cleaned.csv
	python scripts/import_csv.py cleaned/languages_cleaned.csv languages

import_ratings: scripts/import_csv.py cleaned/ratings_cleaned.csv
	python scripts/import_csv.py cleaned/ratings_cleaned.csv ratings

import_releasedates: scripts/import_csv.py cleaned/releasedates_cleaned.csv
	python scripts/import_csv.py cleaned/releasedates_cleaned.csv releasedates

import_runningtimes: scripts/import_csv.py cleaned/runningtimes_cleaned.csv
	python scripts/import_csv.py cleaned/runningtimes_cleaned.csv runningtimes

create: scripts/create_tables.py
	python scripts/create_tables.py

drop: scripts/drop_tables.py
	python scripts/drop_tables.py

delete:
	rm cleaned/*
