all: delete clean import post_clean

clean: clean_staff clean_clips clean_acts clean_writes clean_directs clean_produces clean_biographies clean_clip_links clean_countries clean_associated clean_genres clean_languages clean_ratings clean_releasedates clean_runningtimes

import: import_staff import_clips import_acts import_writes import_directs import_produces import_biographies import_books import_spouses import_nicknames import_salaries import_cliplinks import_countries import_associated import_genres import_classified import_languages import_speaks import_ratings import_releasedin import_playedfor

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

clean_associated: scripts/clean_associated.py
	python scripts/clean_associated.py

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

import_books: scripts/import_csv.py cleaned/biographical_books_cleaned.csv
	python scripts/import_csv.py cleaned/biographical_books_cleaned.csv books

import_spouses: scripts/import_csv.py cleaned/spouses_cleaned.csv
	python scripts/import_csv.py cleaned/spouses_cleaned.csv spouses

import_nicknames: scripts/import_csv.py cleaned/nicknames_cleaned.csv
	python scripts/import_csv.py cleaned/nicknames_cleaned.csv nicknames

import_salaries: scripts/import_csv.py cleaned/salaries_cleaned.csv
	python scripts/import_csv.py cleaned/salaries_cleaned.csv salaries

import_cliplinks: scripts/import_csv.py cleaned/clip_links_cleaned.csv
	python scripts/import_csv.py cleaned/clip_links_cleaned.csv cliplinks

import_countries: scripts/import_csv.py cleaned/countries_cleaned.csv
	python scripts/import_csv.py cleaned/countries_cleaned.csv Country

import_associated: scripts/import_csv.py cleaned/associated_cleaned.csv
	python scripts/import_csv.py cleaned/associated_cleaned.csv Associated

import_genres: scripts/import_csv.py cleaned/genres_cleaned.csv
	python scripts/import_csv.py cleaned/genres_cleaned.csv genres

import_classified: scripts/import_csv.py cleaned/classified_cleaned.csv
	python scripts/import_csv.py cleaned/classified_cleaned.csv classified

import_languages: scripts/import_csv.py cleaned/languages_cleaned.csv
	python scripts/import_csv.py cleaned/languages_cleaned.csv languages

import_speaks: scripts/import_csv.py cleaned/speaks_cleaned.csv
	python scripts/import_csv.py cleaned/speaks_cleaned.csv speaks

import_ratings: scripts/import_csv.py cleaned/ratings_cleaned.csv
	python scripts/import_csv.py cleaned/ratings_cleaned.csv ratings

import_releasedin: scripts/import_csv.py cleaned/releasedates_cleaned.csv
	python scripts/import_csv.py cleaned/releasedates_cleaned.csv releasedin

import_playedfor: scripts/import_csv.py cleaned/runningtimes_cleaned.csv
	python scripts/import_csv.py cleaned/runningtimes_cleaned.csv playedfor

post_clean: scripts/post_clean.sql scripts/post_clean.py
	python scripts/post_clean.py

create: scripts/create_tables.py
	python scripts/create_tables.py

drop: scripts/drop_tables.py
	python scripts/drop_tables.py

delete:
	rm cleaned/*
