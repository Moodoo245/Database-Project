const express = require('express');
const { Pool } = require('pg');
const conn_info = require('./conn_info');
const bodyParser = require('body-parser');

const router = express.Router();

const search_routes = require('./db_search');

router.use('/search', search_routes);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const pool = new Pool(conn_info);

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

router.post('/insert', (req, res, next) => {
	const { table, columns, values } = JSON.parse(req.body.msg);
	const range = [...Array(values.length).keys()].map(i => '$' + (i+1));
	const query = {
		text: `INSERT INTO ${table}(${columns.join(', ')}) VALUES(${range})`,
		values: values,
	}
	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send('Insert Failed');
		} else {
			res.status(200).send('Insert succeeded');
		}
	});
});

const delete_clip_query = 'DELETE FROM Clips WHERE clipid = $1'
router.delete('/clip/:clipid', (req, res, next) => {
	const clipid = req.params.clipid;
	pool.query(delete_clip_query, [clipid], (err, result) => {
		if (err) {
			console.log(err);
			res.send('Deletion Failed');
		} else {
			res.send('Deletion Succeeded');
		}
	});
});

const delete_staff_query = 'DELETE FROM MovieStaff WHERE staffid = $1'
router.delete('/staff/:staffid', (req, res, next) => {
	const staffid = req.params.staffid;
	pool.query(delete_staff_query, [staffid], (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send('Deletion Failed');
		} else {
			res.status(200).send('Deletion Succeeded');
		}
	});
});

router.get('/languages', (req, res, next) => {
	query = 'SELECT * FROM Languages';

	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send([]);
		} else {
			res.status(200).send(result.rows);
		}
	});
});

router.get('/genres', (req, res, next) => {
	query = 'SELECT * FROM Genres';

	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send([]);
		} else {
			res.status(200).send(result.rows);
		}
	});
});

router.get('/countries', (req, res, next) => {
	query = 'SELECT * FROM Country';

	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send([]);
		} else {
			res.status(200).send(result.rows.slice(1));
		}
	});
});


module.exports = router;

router.get('/search_temp', (request, response, next) => {
	const query = request.query.query;

	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			response.status(200).json({
				error: String(err),
				fields: [],
				rows: []
			});
		} else {
			response.status(200).json({
				fields: result.fields.map(f => f.name),
				rows: result.rows.slice(0,1000),
			});
		}
	});
});
