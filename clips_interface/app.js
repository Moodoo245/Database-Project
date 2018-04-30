const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));

const urlencodedParser = bodyParser.urlencoded({ extended: false});

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
			<li><a href="insert_delete">Insert/Delete</a></li>
		</ul>
	</div>`;

const end = `
	</body>
	</html>`;

const search_form = text => `
	<form class="search-form" action="/search" method="POST">
		<input type="text" name="query" size="50" style="font-size:20px" value="` + text + `">
		<input type="submit" value="Search" style="font-size:20px">
	</form>`;

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

	const client = new Client();
	await client.connect();

	client.query(query, (err, result) => {
		if (err) {
			res.write(err.stack);
			res.write(end);
			res.end();
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
})

const server = app.listen(8080);
