all: delete clean

clean: staff clips acts writes directs produces biographies clip_links countries genres languages ratings release_dates running_times

staff: scripts/clean_staff.py
	python scripts/clean_staff.py

clips: scripts/clean_clips.py
	python scripts/clean_clips.py

acts: scripts/clean_acts.py
	python scripts/clean_acts.py

writes: scripts/clean_writes.py
	python scripts/clean_writes.py

directs: scripts/clean_directs.py
	python scripts/clean_directs.py

produces: scripts/clean_produces.py
	python scripts/clean_produces.py

biographies: scripts/clean_biographies.py
	python scripts/clean_biographies.py

clip_links: scripts/clean_clip_links.py
	python scripts/clean_clip_links.py

countries: scripts/clean_countries.py
	python scripts/clean_countries.py

genres: scripts/clean_genres.py
	python scripts/clean_genres.py

languages: scripts/clean_languages.py
	python scripts/clean_languages.py

ratings: scripts/clean_ratings.py
	python scripts/clean_ratings.py

release_dates: scripts/clean_release_dates.py
	python scripts/clean_release_dates.py

running_times: scripts/clean_running_times.py
	python scripts/clean_running_times.py

create: scripts/create_tables.py
	python scripts/create_tables.py

drop: scripts/drop_tables.py
	python scripts/drop_tables.py

delete:
	rm cleaned/*
