const queries = {
	'2.a': 'Print the name and length of the 10 longest clips that were released in France',
	'2.b': 'Compute the number of clips released per country in 2001',
	'2.c': 'Compute the numbers of clips per genre released in the USA after 2013',
	'2.d': 'Print the name of actor/actress who has acted in more clips than anyone else',
	'2.e': 'Print the maximum number of clips any director has directed',
	'2.f': 'Print the names of people that had at least 2 different jobs in a single clip. For example, if X has both acted, directed and written movie Y, his/her name should be printed out. On the other hand, if X has acted as 4 different personas in the same clip, but done nothing else, he/she should not be printed',
	'2.g': 'Print the 10 most common clip languages',
	'2.h': 'Print the full name of the actor who has performed in the highest number of clips with a user-specified type',
	'3.a': 'Print the names of the top 10 actors ranked by the average rating of their 3 highest-rated clips that where voted by at least 100 people. The actors must have had a role in at least 5 clips (not necessarily rated)',
	'3.b': 'Compute the average rating of the top-100 rated clips per decade in decreasing order',
	'3.c': 'For any video game director, print the first year he/she directed a game, his/her name and all his/her game titles from that year',
	'3.d': 'For each year, print the title, year and rank-in-year of top 3 clips, based on their ranking',
	'3.e': 'Print the names of all directors who have also written scripts for clips, in all of which they were additionally actors (but not necessarily directors) and every clip they directed has at least two more points in ranking than any clip they wrote',
	'3.f': 'Print the names of the actors that are not married and have participated in more than 2 clips that they both acted in and co-directed it',
	'3.g': 'Print the names of screenplay story writers who have worked with more than 2 producers',
	'3.h': 'Compute the average rating of an actor\'s clips (for each actor) when she/he has a leading role (first 3 credits in the clip)',
	'3.i': 'Compute the average rating for the clips whose genre is the most popular genre',
	'3.j': 'Print the names of the actors that have participated in more than 100 clips, of which at least 60% where short but not comedies nor dramas, and have played in more comedies than double the dramas. Print also the number of comedies and dramas each of them participated in',
	'3.k': 'Print the number of Dutch movies whose genre is the second most popular one',
	'3.l': 'Print the name of the producer whose role is coordinating producer, and who has produced the highest number of movies with the most popular genre',
};

function select_query(id) {
	$('#query_text').text(queries[id]);
	$('#query_sql').text('SELECT 1 FROM NULL');
	$('#query_button').css('display', 'inline-block');
}

$(() => {
	$('#query_button').click(() => {
		const query = $('#query_temp').val();
		$.get('/db/search_temp', {query: query}, (result) => {
			if (result.error) {
				alert(result.error);
			}
			const holder = $('#query_result');
			const table = $('<table></table>');
			holder.html(table);
			const headers = $('<tr></tr>');
			headers.append(result.fields.map(field => $('<th></th>').text(field)));
			table.append(headers);
			for (row of result.rows) {
				const line = $('<tr></tr>');
				for (key in row) {
					line.append($('<td></td>').text(row[key]));
				}
				table.append(line);
			} 
		});
	});

});
