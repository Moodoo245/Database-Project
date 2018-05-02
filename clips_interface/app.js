const express = require('express');
const { Client, Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));

const urlencodedParser = bodyParser.urlencoded({ extended: false});

const pool = new Pool();

const start = `
	<html>
	<head>
		<link rel="stylesheet" href="css/style.css">
		<title>Clips</title>
	</head>
	<body>`;

const menu = `
	<div class="menu">
		<div class="title">Clips</div>
		<ul>
			<li><a href="/search">Search</a></li>
			<li><a href="/predefined_queries">Predefined Queries</a></li>
			<li><a href="/insert_delete">Insert/Delete</a></li>
		</ul>
	</div>`;

const end = `
	</body>
	</html>`;

const search_form = text => `
	<div class="search-form">
		<form action="/search" method="POST">
			<input class="max-width" type="text" name="query" placeholder="Enter your query" value="` + text + `">
			<input type="submit" value="Search">
		</form>
	</div>`;

app.get('/', (req, res) => {
	res.redirect('/search');
});

app.get('/search', (req, res) => {
	res.write(start);
	res.write(menu);
	res.write(search_form(''));
	res.end(end);
});

app.post('/search', urlencodedParser, async (req, res) => {
	res.write(start);
	res.write(menu);

	const query = req.body.query;

	res.write(search_form(query));

	pool.query(query, (err, result) => {
		if (err) {
			res.write('An error has occured');
			res.write(end);
			res.end();
			console.log(err);
		} else {
			res.write('<div class="result-table">');
			res.write('<table>');
			res.write('<tr>');
			result.fields.forEach(field => res.write('<th>' + field.name + '</th>'));
			res.write('</tr>');
			result.rows.forEach(row => {
				res.write('<tr>');
				for (key in row)
					res.write('<td>' + row[key] + '</td>');
				res.write('</tr>');
			})
			res.write('</table>');
			res.write('</div>');
			res.write(end);
			res.end();
		}
	});
});

app.get('/insert_delete', (req, res) => {
	res.write(start);
	res.write(menu);

	table_names_query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'";

	pool.query(table_names_query, (err, result) => {
		if (err) {
			res.write('An error has occured');
			res.write(end);
			res.end();
			console.log(err);
		} else {
			res.write('<div class="insert-table">');
			res.write('<form action="/insert2" method="GET">');
			res.write('<ul>');
			result.rows.forEach(row => {
				res.write('<li>');
				res.write('<input type="submit" name="table" value="' + row.table_name + '">');
				res.write('</li>');
			});
			res.write('</ul>');
			res.write('</div>');
			res.write(end);
			res.end();
		}
	});
});

app.get('/insert2', (req, res) => {
	res.write(start);
	res.write(menu);

	const table = req.query.table;

	const table_names_query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'";

	var end_left = 0;
	var end_right = 0;

	pool.query(table_names_query, (err, result) => {
		if (err) {
			res.write('An error has occured');
			if (end_right == 1) {
				res.write(end);
				res.end();
				console.log(err);
			} else {
				end_left = 1;
			}
		} else {
			res.write('<div class="insert-table">');
			res.write('<form action="/insert2" method="GET">');
			res.write('<ul>');
			result.rows.forEach(row => {
				res.write('<li>');
				res.write('<input type="submit" name="table" value="' + row.table_name + '">');
				res.write('</li>');
			});
			res.write('</ul>');
			res.write('</form>');
			res.write('</div>');
			if (end_right == 1) {
				res.write(end);
				res.end();
				console.log(err);
			} else {
				end_left = 1;
			}
		}
	});
	
	const column_names_query = "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='" + table + "'";	

	pool.query(column_names_query, (err, result) => {
		if (err) {
			res.write('An error has occured');
			if (end_left == 1) {
				res.write(end);
				res.end();
				console.log(err);
			} else {
				end_right = 1;
			}
		} else {
			res.write('<div class="right-pane">');
			res.write('<div class="insert-column">');	
			res.write('<form action="/insert3" method="POST">');
			result.rows.forEach(row => {
				res.write('<div class="column-entry">');
				res.write(row.column_name + '<input type="text" name="' + row.column_name + '">');
				res.write('</div>');
			});
			res.write('<div class="submit-button"><input type="submit" value="Insert"></div>');
			res.write('</form>');
			res.write('</div>');
			res.write('</div>');
			if (end_left == 1) {
				res.write(end);
				res.end();
				console.log(err);
			} else {
				end_right = 1;
			}
		}
	});


});



const server = app.listen(8080);
