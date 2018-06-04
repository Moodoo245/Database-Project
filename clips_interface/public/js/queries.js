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

const sql = {
	'2.a': `SELECT C.ClipTitle, P.RunningTime<br>
		FROM Clips C<br>
		NATURAL JOIN PlayedFor P<br>
		NATURAL JOIN Country C2<br>
		WHERE C2.CountryName = 'France'<br>
		AND P.RunningTime IS NOT NULL<br>
		ORDER BY P.RunningTime DESC<br>
		LIMIT 10`,
	'2.b': `SELECT countryname, COUNT(R.ClipId)<br>
		FROM ReleasedIn R NATURAL JOIN Country C<br>
		WHERE R.ReleaseDate LIKE '%2001%'<br>
		GROUP BY C.CountryId`,
	'2.c': `SELECT G.genre, COUNT(*)<br>
		FROM Classified<br>
		NATURAL JOIN ReleasedIn R<br>
		NATURAL JOIN Country<br>
		NATURAL JOIN Genres G<br>
		WHERE CountryName = 'USA'<br>
		AND (   ReleaseDate LIKE '%2014'<br>
				OR ReleaseDate LIKE '%2015%' <br>
				OR ReleaseDate LIKE '%2016%'<br>
				OR ReleaseDate LIKE '%2017%'<br>
				OR ReleaseDate LIKE '%2018%')<br>
		GROUP BY G.GenreId`,
	'2.d': `SELECT S.FullName<br>
		FROM MovieStaff S<br>
		NATURAL JOIN Acts A<br>
		GROUP BY S.StaffId<br>
		ORDER BY COUNT(A.ClipId) DESC<br>
		LIMIT 1`,
	'2.e': `SELECT COUNT(ClipId)<br>
		FROM Directs<br>
		GROUP BY StaffId<br>
		ORDER BY COUNT(ClipId) DESC<br>
		LIMIT 1`,
	'2.f': `SELECT DISTINCT FullName FROM (<br>
			SELECT staffid FROM (<br>
				SELECT DISTINCT staffid, clipid FROM acts<br>
				UNION ALL<br>
				SELECT DISTINCT staffid, clipid FROM directs<br>
				UNION ALL<br>
				SELECT DISTINCT staffid, clipid FROM produces<br>
				UNION ALL<br>
				SELECT DISTINCT staffid, clipid FROM writes<br>
				) L GROUP BY staffid, ClipId HAVING SUM(1) >= 2<br>
			) R NATURAL JOIN MovieStaff`,
	'2.g': `SELECT L.Language<br>
		FROM Speaks S<br>
		NATURAL JOIN Languages L<br>
		GROUP BY L.LanguageId<br>
		ORDER BY COUNT(S.ClipId) DESC<br>
		LIMIT 10`,
	'2.h': `SELECT S.FullName<br>
		FROM Acts A<br>
		NATURAL JOIN MovieStaff S<br>
		NATURAL JOIN Clips C<br>
		WHERE C.ClipType = 'V'<br>
		GROUP BY S.StaffId<br>
		ORDER BY COUNT(A.ClipId) DESC<br>
		LIMIT 1`,
	'3.a': `WITH CAL1 AS (<br>
			-- filter the actors that played in at least 5 clips<br><br>
			SELECT staffid FROM Acts A<br>
			GROUP BY staffid<br>
			HAVING COUNT(1) >= 5<br>
			), CAL2 AS (<br>
				-- filter the actors that played in at least 3 clips with more than 100 votes<br>
				SELECT staffid FROM CAL1<br>
				NATURAL JOIN Acts<br>
				NATURAL JOIN Ratings<br>
				WHERE Votes >= 100<br>
				GROUP BY StaffId<br>
				HAVING COUNT(1) >= 3<br>
				), CAL3 AS (<br>
					SELECT StaffId, Rank, ROW_NUMBER() OVER (PARTITION BY StaffId ORDER BY Rank
						DESC) AS NUM<br>
					FROM ACTS<br>
					NATURAL JOIN Ratings R<br>
					WHERE EXISTS(<br>
						SELECT 1 FROM CAL2<br>
						WHERE CAL2.StaffId = Acts.StaffId)<br>
					AND Votes >= 100<br>
					)<br>
				SELECT FullName FROM CAL3<br>
				NATURAL JOIN MovieStaff<br>
				WHERE NUM <= 3<br>
				GROUP BY FullName<br>
				ORDER BY AVG(Rank) DESC<br>
				LIMIT 10`,
	'3.b': `WITH Prep AS (<br>
			SELECT Rank, ClipYear/10 AS Year, ROW_NUMBER() OVER (PARTITION BY ClipYear/10<br>
				ORDER BY Rank DESC) AS NUM<br>
			FROM clips NATURAL JOIN Ratings<br>
			)<br>
		SELECT Year*10, AVG(Rank)<br>
		FROM Prep<br>
		WHERE NUM <= 100<br>
		GROUP BY Year<br>
		ORDER BY Year`,
	'3.c': `WITH prep AS (<br>
			SELECT StaffId, MIN(clipYear) as Year FROM Directs<br>
			NATURAL JOIN Clips<br>
			WHERE ClipType = 'VG'<br>
			GROUP BY StaffId)<br>
		SELECT FullName, Year, ClipTitle<br>
		FROM prep<br>
		NATURAL JOIN Directs<br>
		NATURAL JOIN MovieStaff<br>
		NATURAL JOIN Clips C<br>
		WHERE C.ClipType = 'VG'<br>
		AND C.ClipYear = Year`,
	'3.d': `SELECT ClipYear, ClipTitle, Rank FROM (<br>
			SELECT ClipYear, ClipTitle, Rank, ROW_NUMBER() OVER (PARTITION BY ClipYear ORDER<br>
				BY Rank DESC) AS NUM<br>
			FROM Clips<br>
			NATURAL JOIN Ratings) L<br>
		WHERE NUM <= 3`,
	'3.e': `WITH Prep AS (<br>
			SELECT w.staffid, MAX(R.Rank) FROM Writes W<br>
			NATURAL LEFT JOIN Ratings R<br>
			GROUP BY W.StaffId<br>
			HAVING EVERY(EXISTS(<br>
					SELECT 1 FROM Acts A WHERE W.StaffId = A.StaffId AND W.ClipId = A.ClipId<br>
					))<br>
			)<br>
			SELECT S.FullName FROM Directs D<br>
			NATURAL LEFT JOIN Ratings R<br>
			NATURAL JOIN Prep P<br>
			NATURAL JOIN MovieStaff S<br>
			GROUP BY S.FullName<br>
			HAVING EVERY(CASE WHEN R.Rank IS NULL THEN 0 ELSE R.Rank END >= (P.Max + 2))`,
	'3.f': `WITH ActAndCodirect AS (<br>
			SELECT A.StaffId, A.ClipId FROM Acts A<br>
			INNER JOIN Directs D ON A.StaffId = D.StaffId AND A.ClipId = D.ClipId<br>
			WHERE Role = 'co-director'<br>
			AND NOT EXISTS(SELECT 1 FROM Spouses S WHERE S.StaffId = A.StaffId)<br>
			)<br>
		SELECT S1.FullName AS S1, S2.FullName AS S2<br>
		FROM ActAndCodirect AAC1 INNER JOIN MovieStaff S1 ON AAC1.StaffId = S1.StaffId,<br>
	ActAndCodirect AAC2 INNER JOIN MovieStaff S2 ON AAC2.StaffId = S2.StaffId<br>
		WHERE AAC1.StaffId < AAC2.StaffId<br>
		AND AAC1.ClipId = AAC2.ClipId<br>
		GROUP BY S1.FullName, S2.FullName<br>
		HAVING(Count(1) > 2)`,
	'3.g': `SELECT S.FullName<br>
		FROM Writes W NATURAL JOIN MovieStaff S<br>
		INNER JOIN Produces P ON W.ClipId = P.ClipId AND W.StaffId != P.StaffId<br>
		WHERE W.WorkType = 'screenplay'<br>
		GROUP BY S.FullName<br>
		HAVING COUNT(DISTINCT P.StaffId) > 2`,
	'3.h': `SELECT AVG(Rank)<br>
		FROM Ratings<br>
		NATURAL JOIN Acts<br>
		WHERE OrdersCredit <= 3<br>
		GROUP BY StaffId`,
	'3.i': `SELECT AVG(Rank) FROM Classified C NATURAL JOIN Ratings R<br>
		WHERE C.GenreId = (SELECT C.genreId FROM Classified C<br>
				GROUP BY C.genreId<br>
				ORDER BY Count(*) DESC<br>
				LIMIT 1)`,
	'3.j': `WITH Comedies AS (<br>
			SELECT ClipId FROM Classified<br>
			NATURAL JOIN Genres<br>
			WHERE genre = 'Comedy'<br>
			), Dramas AS (<br>
				SELECT ClipId FROM Classified<br>
				NATURAL JOIN Genres<br>
				WHERE genre = 'Drama'<br>
				), Shorts AS (<br>
					SELECT ClipId FROM Classified<br>
					NATURAL JOIN Genres<br>
					WHERE genre = 'Short')<br>
				SELECT S.FullName,<br>
	SUM(CASE WHEN EXISTS(SELECT 1 FROM Comedies C WHERE C.ClipId = A.ClipId) THEN<br>
			1 ELSE 0 END) AS Comedies,<br>
		SUM(CASE WHEN EXISTS(SELECT 1 FROM Dramas D WHERE D.ClipId = A.ClipId) THEN<br>
				1 ELSE 0 END) AS Dramas<br>
		FROM Acts A NATURAL JOIN MovieStaff S<br>
		GROUP BY S.StaffId<br>
		HAVING COUNT(*) > 100<br>
		AND 0.6*COUNT(*) <= SUM(<br>
				CASE WHEN EXISTS(<br>
					SELECT 1 FROM Shorts WHERE Shorts.ClipId = A.ClipId)<br>
				AND NOT EXISTS(SELECT 1 FROM Comedies C WHERE C.ClipId = A.ClipId)<br>
				AND NOT EXISTS(SELECT 1 FROM Dramas D WHERE D.ClipId = A.ClipId)<br>
				THEN 1 ELSE 0 END)<br>
		AND SUM(CASE WHEN EXISTS(SELECT 1 FROM Comedies C WHERE C.ClipId = A.ClipId)<br>
				THEN 1 ELSE 0 END) ><br>
		2*SUM(CASE WHEN EXISTS(SELECT 1 FROM Dramas D WHERE D.ClipId = A.ClipId)<br>
				THEN 1 ELSE 0 END)`,
	'3.k': `SELECT COUNT(*) FROM Classified C<br>
		NATURAL JOIN Speaks S<br>
		NATURAL JOIN Languages L<br>
		WHERE C.genreId = (SELECT C.GenreId<br>
				FROM Classified C<br>
				GROUP BY C.GenreId<br>
				ORDER BY COUNT(*) DESC<br>
				LIMIT 1 OFFSET 1)<br>
		AND L.language = 'Dutch'`,
	'3.l': `SELECT S.FullName FROM Produces P<br>
		NATURAL JOIN MovieStaff S<br>
		NATURAL JOIN Classified C<br>
		WHERE P.Role = 'coordinating producer'<br>
		AND C.genreId = (SELECT C.GenreId<br>
				FROM Classified C<br>
				GROUP BY C.GenreId<br>
				ORDER BY COUNT(*) DESC<br>
				LIMIT 1)<br>
		GROUP BY S.StaffId<br>
		ORDER BY COUNT(C.ClipId) DESC LIMIT 1`,
}

function select_query(id) {
	$('#query_text').text(queries[id]);
	$('#query_sql').html(sql[id]);
	$('#query_button').css('display', 'inline-block');
	$('#query_result').empty();
}

$(() => {
	const loader = $('<div></div>').addClass('loader');
	const holder = $('#query_result');
	$('#query_button').click(() => {
		holder.empty();
		holder.html(loader);
		loader.fadeIn();
		const query = $('#query_sql').text();
		$.get('/db/search_temp', {query: query}, (result) => {
			if (result.error) {
				alert(result.error);
			}
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
