DELETE FROM Languages WHERE language = 'a';
DELETE FROM Country WHERE countryname IN ('None', 'episodes', 'parts', 'x', 'hour', 'U', 'seconds', 'min  sec', 'second');
SELECT setval('clips_clipid_seq', (SELECT MAX(clipid) FROM clips));
SELECT setval('country_countryid_seq', (SELECT MAX(countryid) FROM country));
SELECT setval('genres_genreid_seq', (SELECT MAX(genreid) FROM genres));
SELECT setval('languages_languageid_seq', (SELECT MAX(languageid) FROM languages));
SELECT setval('moviestaff_staffid_seq', (SELECT MAX(staffid) FROM moviestaff));
