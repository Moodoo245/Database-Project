const express = require('express');
const { Pool } = require('pg');
const conn_info = require('./conn_info');

const router = express.Router();

const search_routes = require('./db_search');

router.use('/search', search_routes);

const pool = new Pool(conn_info);

/*router.get('/search', (request, response, next) => {
	const query = request.query.query;

	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			response.status(400).json({
				fields: [],
				rows: []
			});
		} else {
			response.status(200).json({
				fields: result.fields.map(f => f.name),
				rows: result.rows
			});
		}
	});
});*/

router.get('/tables', (request, response, next) => {
	query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'";
	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			response.status(400).json({
				tables: []
			});
		} else {
			response.status(200).json({
				tables: result.rows.map(row => row.table_name)
			});
		}
	});
});

router.get('/columns/:table', (req, res, next) => {
	console.log('hello');
	query = "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='" + req.params.table + "'";	
	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).json({
				columns: []
			});
		} else {
			res.status(200).json({
				columns: result.rows.map(row => row.column_name)
			});
		}
	});
});

module.exports = router;
