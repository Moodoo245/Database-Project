const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.static('public'));
app.use(morgan('dev'));

const db_routes = require('./api/routes/db');

app.use('/db', db_routes);

app.get('/', (req, res) => {
	res.redirect('/search');
});

app.get('/search', (req, res) => {
	res.sendFile(__dirname + '/views/search.html');
});

app.get('/insert', (req, res) => {
	res.sendFile(__dirname + '/views/insert.html');
});

app.get('/queries', (req, res) => {
	res.sendFile(__dirname + '/views/queries.html');
});

module.exports = app
