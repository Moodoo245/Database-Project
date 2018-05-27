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
	if (query.actors == 'true') exists.push('EXISTS(SELECT 1 FROM acts WHERE acts.staffID = S.staffID)');
	if (query.directors == 'true') exists.push('EXISTS(SELECT 1 FROM directs WHERE directs.staffID = S.staffID)');
	if (query.producers == 'true') exists.push('EXISTS(SELECT 1 FROM produces WHERE produces.staffID = S.staffID)');
	if (query.writers == 'true') exists.push('EXISTS(SELECT 1 FROM writes WHERE writes.staffID = S.staffID)');

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
			console.log(queryString);
			console.log(err);
			response.status(400).send([]);
		} else {
			response.status(200).send(result.rows);
		}
	});
});

// prepared staff queries
const sacts_query = 'SELECT acts.*, clips.cliptitle FROM acts INNER JOIN clips ON acts.clipid = clips.clipid WHERE staffid = $1';
const sdirects_query = 'SELECT directs.*, clips.cliptitle FROM directs INNER JOIN clips ON directs.clipid = clips.clipid WHERE staffid = $1';
const sproduces_query = 'SELECT produces.*, clips.cliptitle FROM produces INNER JOIN clips ON produces.clipid = clips.clipid WHERE staffid = $1';
const swrites_query = 'SELECT writes.*, clips.cliptitle FROM writes INNER JOIN clips ON writes.clipid = clips.clipid WHERE staffid = $1';
const bio_query = 'SELECT * FROM biographies bio WHERE staffid = $1';

router.get('/staff/:staffid', (request, response, next) => {
	const staffid = request.params.staffid;

	const tasks = {
		acts: callback => pool.query(sacts_query, [staffid], callback),
		directs: callback => pool.query(sdirects_query, [staffid], callback),
		produces: callback => pool.query(sproduces_query, [staffid], callback),
		writes: callback => pool.query(swrites_query, [staffid], callback),
		bio: callback => pool.query(bio_query, [staffid], callback),
	};

	async.parallel(tasks, (err, results) => {
		if (err) {
			response.status(400).json({
				acts: [],
				directs: [],
				produces: [],
				writes: [],
				bio: null,
			});
		} else {
			response.status(200).json({
				acts: results.acts.rows,
				directs: results.directs.rows,
				produces: results.produces.rows,
				writes: results.writes.rows,
				bio: results.bio.rows[0],
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

	const innerJoins = [];
	const conditions = [`LOWER(ClipTitle) LIKE LOWER('%${query.text}%')`];

	if (query.type) {
		if (query.type.length) {
			conditions.push(`(${query.type.map(type => `cliptype = '${type}'`).join(' OR ')})`);
		} else {
			response.status(200).send([]);
		}
	}

	if (query.bound_rating) {
		innerJoins.push('INNER JOIN Ratings ON Clips.clipid = Ratings.clipid');
		conditions.push(`Ratings.rank BETWEEN ${query.gt_rating} AND ${query.lt_rating}`);
	}

	if (query.genre) {
		innerJoins.push('INNER JOIN Genres ON Clips.clipid = Genres.clipid');
		conditions.push(`LOWER(Genres.genre) LIKE LOWER('%${query.genre}%')`);
	}

	if (query.language) {
		innerJoins.push('INNER JOIN Languages ON Clips.clipid = Languages.clipid');
		conditions.push(`LOWER(Languages.language) LIKE LOWER('%${query.language}%')`);
	}

	if (query.associated) {
		innerJoins.push('INNER JOIN AssociatedCountries ON Clips.clipid =  AssociatedCountries.clipid');
		conditions.push(`LOWER(AssociatedCountries.countryname) LIKE LOWER('%${query.associated}%')`);
	}


	const queryString = `SELECT * FROM Clips ${innerJoins.join(' ')}
		WHERE ${conditions.join(' AND ')}
		LIMIT ${query.limit}`;

	pool.query(queryString, (err, result) => {
		if (err) {
			console.log(queryString);
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
const genres_query = 'SELECT genre FROM genres WHERE clipid = $1';
const languages_query = 'SELECT language FROM languages WHERE clipid = $1';
const associatedcountries_query = 'SELECT countryname FROM associatedcountries WHERE clipid = $1';
const releasedates_query = 'SELECT releasecountry, releasedate FROM releasedates WHERE clipid = $1';
const runningtimes_query = 'SELECT releasecountry, runningtime FROM runningtimes WHERE clipid = $1';
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
			console.log(cliptype);
			console.log(results.clip.rows[0]);
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
