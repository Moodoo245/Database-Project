const express = require('express');
const { Pool } = require('pg');
const conn_info = require('./conn_info');

const router = express.Router();

const pool = new Pool(conn_info);

router.get('/staff', (request, response, next) => {
	const search = request.query.query;
	const query = 'SELECT * FROM MovieStaff WHERE fullname LIKE \'%' + search + '%\'';
	
	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			response.status(400).json({staffs: []});
		} else {
			response.status(200).json({staffs: result.rows});
		}
	});
});

router.get('/staff/:staffid', (request, response, next) => {
	const staffid = request.params.staffid;
	const query = 'SELECT * FROM acts WHERE staffid = ' + staffid;

	pool.query(query, (err, result) => {
		if (err) {
			console.log(err);
			response.status(400).json({acts: []});
		} else {
			const acts = result.rows;
			response.status(200).json({acts: acts});
		}
	});
});

module.exports = router;
