const express = require('express');
const { Pool } = require('pg');
const conn_info = require('./conn_info');
const async = require('async');

const router = express.Router();

const pool = new Pool(conn_info);

router.get('/staff', (request, response, next) => {
	const query = request.query;
	if (!query.text) {
		response.status(400).send([]);
		return;
	}

	const exists = [];
	if (query.actors == 'true' && query.directors == 'true' && query.directors == 'true' && query.writers == 'true') {
		exists.push('TRUE');
	} else {
		if (query.actors == 'true') exists.push('EXISTS(SELECT 1 FROM acts WHERE acts.staffID = S.staffID)');
		if (query.directors == 'true') exists.push('EXISTS(SELECT 1 FROM directs WHERE directs.staffID = S.staffID)');
		if (query.producers == 'true') exists.push('EXISTS(SELECT 1 FROM produces WHERE produces.staffID = S.staffID)');
		if (query.writers == 'true') exists.push('EXISTS(SELECT 1 FROM writes WHERE writes.staffID = S.staffID)');
	}

	// if none of the staffs is asked then no need to query anything => empty result
	if (!exists.length) {
		response.status(200).send([]);
		return;
	}

	const queryString = `SELECT * FROM MovieStaff S
		WHERE LOWER(fullname) LIKE LOWER('%${query.text}%')
		AND (${exists.join(' OR ')})
		LIMIT ${query.limit}`;

	pool.query(queryString, (err, result) => {
		if (err) {
			console.log(err);
			response.status(400).send([]);
		} else {
			response.status(200).send(result.rows);
		}
	});
});

// prepared staff queries
const sacts_query = 'SELECT acts.*, clips.cliptitle FROM acts NATURAL JOIN clips WHERE staffid = $1';
const sdirects_query = 'SELECT directs.*, clips.cliptitle FROM directs NATURAL JOIN clips WHERE staffid = $1';
const sproduces_query = 'SELECT produces.*, clips.cliptitle FROM produces NATURAL JOIN clips WHERE staffid = $1';
const swrites_query = 'SELECT writes.*, clips.cliptitle FROM writes NATURAL JOIN clips WHERE staffid = $1';
const bio_query = 'SELECT * FROM biographies bio WHERE staffid = $1';
const spouses_query = 'SELECT spouse FROM spouses WHERE staffid = $1';
const nicknames_query = 'SELECT nickname FROM nicknames WHERE staffid = $1';
const books_query = 'SELECT book FROM books WHERE staffid = $1';
const salaries_query = 'SELECT employer, salary FROM salaries WHERE staffid = $1';

router.get('/staff/:staffid', (request, response, next) => {
	const staffid = request.params.staffid;

	const tasks = {
		acts: callback => pool.query(sacts_query, [staffid], callback),
		directs: callback => pool.query(sdirects_query, [staffid], callback),
		produces: callback => pool.query(sproduces_query, [staffid], callback),
		writes: callback => pool.query(swrites_query, [staffid], callback),
		bio: callback => pool.query(bio_query, [staffid], callback),
		spouses: callback => pool.query(spouses_query, [staffid], callback),
		nicknames: callback => pool.query(nicknames_query, [staffid], callback),
		books: callback => pool.query(books_query, [staffid], callback),
		salaries: callback => pool.query(salaries_query, [staffid], callback),
	};

	async.parallel(tasks, (err, results) => {
		if (err) {
			response.status(400).json({
				acts: [],
				directs: [],
				produces: [],
				writes: [],
				bio: null,
				spouses: [],
				nicknames: [],
				books: [],
				salaries: [],
			});
		} else {
			response.status(200).json({
				acts: results.acts.rows,
				directs: results.directs.rows,
				produces: results.produces.rows,
				writes: results.writes.rows,
				bio: results.bio.rows[0],
				spouses: results.spouses.rows.map(row => row.spouse),
				nicknames: results.nicknames.rows.map(row => row.nickname),
				books: results.books.rows.map(row => row.book),
				salaries: results.salaries.rows.map(row => `${row.employer}: ${row.salary}`),
			});	
		}
	});
});

router.get('/clip', (request, response, next) => {
	const query = request.query;
	if (!query.text) {
		response.status(400).send([]);
		return;
	}

	const joins = [];
	const conditions = [`LOWER(ClipTitle) LIKE LOWER('%${query.text}%')`];

	if (query.type) {
		if (query.type.length) {
			conditions.push(`(${query.type.map(type => `cliptype = '${type}'`).join(' OR ')})`);
		} else {
			response.status(200).send([]);
		}
	}

	if (query.bound_rating) {
		joins.push('NATURAL JOIN Ratings');
		conditions.push(`Ratings.rank BETWEEN ${query.gt_rating} AND ${query.lt_rating}`);
	}

	if (query.genreId) {
		joins.push('NATURAL JOIN Classified');
		conditions.push(`Classified.genreid = ${query.genreId}`);
	}

	if (query.languageId) {
		joins.push('NATURAL JOIN Speaks');
		conditions.push(`Speaks.languageid = ${query.languageId}`);
	}

	if (query.associatedCountryId) {
		joins.push('NATURAL JOIN Associated');
		conditions.push(`Associated.countryid = ${query.associatedCountryId}`);
	}

	const queryString = `SELECT * FROM Clips ${joins.join(' ')} WHERE ${conditions.join(' AND ')} LIMIT ${query.limit}`;

	pool.query(queryString, (err, result) => {
		if (err) {
			console.log(err);
			response.status(400).send([]);
		} else {
			response.status(200).send(result.rows);
		}
	});
});

// prepared clip queries
const clip_query = 'SELECT cliptype, clipyear FROM clips WHERE clipid = $1';
const ratings_query = 'SELECT rank, votes FROM ratings WHERE clipid = $1';
const genres_query = 'SELECT genre FROM genres INNER JOIN classified ON genres.genreid = classified.genreid WHERE clipid = $1';
const languages_query = 'SELECT language FROM languages INNER JOIN speaks ON languages.languageid = speaks.languageid WHERE clipid = $1';
const associatedcountries_query = 'SELECT countryname FROM associated INNER JOIN country ON associated.countryid = country.countryid WHERE clipid = $1';
const releasedates_query = 'SELECT countryname, releasedate FROM releasedin INNER JOIN country ON releasedin.countryid = country.countryid WHERE clipid = $1';
const runningtimes_query = 'SELECT countryname, runningtime FROM playedfor INNER JOIN country ON playedfor.countryid = country.countryid WHERE clipid = $1';
const cliplinks_query = 'SELECT cliptitle, linktype FROM cliplinks INNER JOIN clips ON clipto = clipid WHERE clipfrom = $1';
const cacts_query = 'SELECT acts.*, S.fullname FROM acts INNER JOIN moviestaff S ON acts.staffid = S.staffid WHERE clipid = $1';
const cdirects_query = 'SELECT directs.*, S.fullname FROM directs INNER JOIN moviestaff S ON directs.staffid = S.staffid WHERE clipid = $1';
const cproduces_query = 'SELECT produces.*, S.fullname FROM produces INNER JOIN moviestaff S ON produces.staffid = S.staffid WHERE clipid = $1';
const cwrites_query = 'SELECT writes.*, S.fullname FROM writes INNER JOIN moviestaff S ON writes.staffid = S.staffid WHERE clipid = $1';
router.get('/clip/:clipid', (request, response, next) => {
	const clipid = request.params.clipid;

	const tasks = {
		clip: callback => pool.query(clip_query, [clipid], callback),
		ratings: callback => pool.query(ratings_query, [clipid], callback),
		genres: callback => pool.query(genres_query, [clipid], callback),
		languages: callback => pool.query(languages_query, [clipid], callback),
		associatedcountries: callback => pool.query(associatedcountries_query, [clipid], callback),
		releasedates: callback => pool.query(releasedates_query, [clipid], callback),
		runningtimes: callback => pool.query(runningtimes_query, [clipid], callback),
		cliplinks: callback => pool.query(cliplinks_query, [clipid], callback),
		acts: callback => pool.query(cacts_query, [clipid], callback),
		directs: callback => pool.query(cdirects_query, [clipid], callback),
		produces: callback => pool.query(cproduces_query, [clipid], callback),
		writes: callback => pool.query(cwrites_query, [clipid], callback),
	}

	async.parallel(tasks, (err, results) => {
		if (err) {
			console.log(err);
			response.status(400).json({
				cliptype: null,
				clipyear: null,
				ratings: null,
				genres: [],
				languages: [],
				associatedcountries: [],
				releasedates: [],
				runningtimes: [],
				cliplinks: [],
				acts: [],
				directs: [],
				produces: [],
				writes: [],
			});
		} else {
			const {cliptype, clipyear} = results.clip.rows[0] || {};
			response.status(200).json({
				cliptype: cliptype,
				clipyear: clipyear,
				rating: results.ratings.rows[0],
				genres: results.genres.rows.map(row => row.genre),
				languages: results.languages.rows.map(row => row.language),
				associatedcountries: results.associatedcountries.rows.map(row => row.countryname),
				releasedates: results.releasedates.rows,
				runningtimes: results.runningtimes.rows,
				cliplinks: results.cliplinks.rows,
				acts: results.acts.rows,
				directs: results.directs.rows,
				produces: results.produces.rows,
				writes: results.writes.rows,
			});
		}
	});
});

module.exports = router;
