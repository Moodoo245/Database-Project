#!/bin/bash

echo -e "name of the input directory:"
read IN
echo -e "name of the output directory:"
read OUT


awk -F ',' '{print $1}' $IN/writers.csv > $OUT/fullName_writers.csv
awk -F ',' '{print $2}' $IN/writers.csv > $OUT/clipIds_writers.csv
awk -F ',' '{print $3}' $IN/writers.csv > $OUT/workTypes_writers.csv
awk -F ',' '{print $4}' $IN/writers.csv > $OUT/roles_writers.csv
awk -F ',' '{print $5}' $IN/writers.csv > $OUT/addInfos_writers.csv

awk -F ',' '{print $1}' $IN/running_times.csv > $OUT/clipId_running_times.csv
awk -F ',' '{print $2}' $IN/running_times.csv > $OUT/releaseCountry_running_times.csv
awk -F ',' '{print $3}' $IN/running_times.csv > $OUT/runningTime_running_times.csv

awk -F ',' '{print $1}' $IN/release_dates.csv > $OUT/clipId_release_dates.csv
awk -F ',' '{print $2}' $IN/release_dates.csv > $OUT/releaseCountry_release_dates.csv
awk -F ',' '{print $3}' $IN/release_dates.csv > $OUT/releaseDate_release_dates.csv

awk -F ',' '{print $1}' $IN/ratings.csv > $OUT/clipId_ratings.csv
awk -F ',' '{print $2}' $IN/ratings.csv > $OUT/votes_ratings.csv
awk -F ',' '{print $3}' $IN/ratings.csv > $OUT/rank_ratings.csv

awk -F ',' '{print $1}' $IN/producers.csv > $OUT/fullName_producers.csv
awk -F ',' '{print $2}' $IN/producers.csv > $OUT/clipIds_producers.csv
awk -F ',' '{print $3}' $IN/producers.csv > $OUT/roles_producers.csv
awk -F ',' '{print $4}' $IN/producers.csv > $OUT/addInfos_producers.csv

awk -F ',' '{print $1}' $IN/languages.csv > $OUT/clipId_languages.csv
awk -F ',' '{print $2}' $IN/languages.csv > $OUT/language_languages.csv

awk -F ',' '{print $2}' $IN/genres.csv > $OUT/genre_genres.csv
awk -F ',' '{print $1}' $IN/genres.csv > $OUT/clipId_genres.csv

awk -F ',' '{print $1}' $IN/directors.csv > $OUT/fullName_directors.csv
awk -F ',' '{print $2}' $IN/directors.csv > $OUT/clipIds_directors.csv
awk -F ',' '{print $3}' $IN/directors.csv > $OUT/roles_directors.csv
awk -F ',' '{print $4}' $IN/directors.csv > $OUT/addInfos_directors.csv

awk -F ',' '{print $1}' $IN/countries.csv > $OUT/clipId_countries.csv
awk -F ',' '{print $2}' $IN/countries.csv > $OUT/countryName_countries.csv

awk -F ',' '{print $4}' $IN/clips.csv > $OUT/clipType_clips.csv
awk -F ',' '{print $3}' $IN/clips.csv > $OUT/clipYear_clips.csv
awk -F ',' '{print $2}' $IN/clips.csv > $OUT/clipTitle_clips.csv
awk -F ',' '{print $1}' $IN/clips.csv > $OUT/clipId_clips.csv

awk -F ',' '{print $3}' $IN/clip_links.csv > $OUT/linkType_clip_links.csv
awk -F ',' '{print $2}' $IN/clip_links.csv > $OUT/clipTo_clip_links.csv
awk -F ',' '{print $1}' $IN/clip_links.csv > $OUT/clipFrom_clip_links.csv

awk -F ',' '{print $5}' $IN/actors.csv > $OUT/addInfos_actors.csv
awk -F ',' '{print $4}' $IN/actors.csv > $OUT/ordersCredit_actors.csv
awk -F ',' '{print $3}' $IN/actors.csv > $OUT/chars_actors.csv
awk -F ',' '{print $2}' $IN/actors.csv > $OUT/clipIds_actors.csv
awk -F ',' '{print $1}' $IN/actors.csv > $OUT/fullName_actors.csv

awk -F ',' '{print $15}' $IN/biographies.csv > $OUT/whereAreTheyNow_biographies.csv
awk -F ',' '{print $14}' $IN/biographies.csv > $OUT/trademark_biographies.csv
awk -F ',' '{print $13}' $IN/biographies.csv > $OUT/salary_biographies.csv
awk -F ',' '{print $12}' $IN/biographies.csv > $OUT/personalQuotes_biographies.csv
awk -F ',' '{print $11}' $IN/biographies.csv > $OUT/biographicalBooks_biographies.csv
awk -F ',' '{print $10}' $IN/biographies.csv > $OUT/trivia_biographies.csv
awk -F ',' '{print $9}' $IN/biographies.csv > $OUT/spouse_biographies.csv
awk -F ',' '{print $8}' $IN/biographies.csv > $OUT/dateAndCauseOfDeath_biographies.csv
awk -F ',' '{print $7}' $IN/biographies.csv > $OUT/biographer_biographies.csv
awk -F ',' '{print $6}' $IN/biographies.csv > $OUT/biography_biographies.csv
awk -F ',' '{print $5}' $IN/biographies.csv > $OUT/height_biographies.csv
awk -F ',' '{print $4}' $IN/biographies.csv > $OUT/dateAndPlaceOfBirth_biographies.csv
awk -F ',' '{print $3}' $IN/biographies.csv > $OUT/nickname_biographies.csv
awk -F ',' '{print $2}' $IN/biographies.csv > $OUT/realNames_biographies.csv
awk -F ',' '{print $1}' $IN/biographies.csv > $OUT/names_biographies.csv

