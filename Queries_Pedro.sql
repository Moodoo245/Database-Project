-- 3.a
WITH CAL1 AS (
	-- filter the actors that played in at least 5 clips
	SELECT staffid FROM Acts A
		GROUP BY staffid
		HAVING COUNT(1) >= 5
), CAL2 AS (
	-- filter the actors that played in at least 3 clips with more than 100 votes
	SELECT staffid FROM CAL1
		NATURAL JOIN Acts
		NATURAL JOIN Ratings
		WHERE Votes >= 100
		GROUP BY StaffId
		HAVING COUNT(1) >= 3
), CAL3 AS (
	SELECT StaffId, Rank, ROW_NUMBER() OVER (PARTITION BY StaffId ORDER BY Rank) AS NUM
	FROM ACTS
	NATURAL JOIN Ratings R
	WHERE EXISTS(
		SELECT 1 FROM CAL2
		WHERE CAL2.StaffId = Acts.StaffId)
	AND Votes >= 100
)

SELECT FullName FROM CAL3
NATURAL JOIN MovieStaff
WHERE NUM <= 3
GROUP BY FullName
ORDER BY AVG(Rank) DESC
LIMIT 10

-- 3.b
WITH Prep AS (
	SELECT Rank, ClipYear/10 AS Year, ROW_NUMBER() OVER (PARTITION BY ClipYear/10 ORDER BY Rank DESC) AS NUM
	FROM clips NATURAL JOIN Ratings
)

SELECT Year*10, AVG(Rank)
FROM Prep
WHERE NUM <= 100
GROUP BY Year
ORDER BY Year

-- 3.c
WITH prep AS (
	SELECT StaffId, MIN(clipYear) as Year FROM Directs 
	NATURAL JOIN Clips
	WHERE ClipType = 'VG'
	GROUP BY StaffId)

SELECT FullName, Year, ClipTitle
FROM prep
NATURAL JOIN Directs
NATURAL JOIN MovieStaff
NATURAL JOIN Clips C
WHERE C.ClipType = 'VG'
AND C.ClipYear = Year

-- 3.d
SELECT ClipYear, ClipTitle, Rank FROM (
	SELECT ClipYear, ClipTitle, Rank, ROW_NUMBER() OVER (PARTITION BY ClipYear ORDER BY Rank DESC) AS NUM
	FROM Clips
	NATURAL JOIN Ratings) L
WHERE NUM <= 3

-- 3.e
WITH Prep AS (
	SELECT w.staffid, MAX(R.Rank) FROM Writes W
	NATURAL LEFT JOIN Ratings R
	GROUP BY W.StaffId
	HAVING EVERY(EXISTS(
		SELECT 1 FROM Acts A WHERE W.StaffId = A.StaffId AND W.ClipId = A.ClipId
	))
)

SELECT S.FullName FROM Directs D
NATURAL LEFT JOIN Ratings R
NATURAL JOIN Prep P
NATURAL JOIN MovieStaff S
GROUP BY S.FullName
HAVING EVERY(CASE WHEN R.Rank IS NULL THEN 0 ELSE R.Rank END >= (P.Max + 2))

-- 3.f
WITH ActAndCodirect AS (
	SELECT A.StaffId, A.ClipId FROM Acts A
	INNER JOIN Directs D ON A.StaffId = D.StaffId AND A.ClipId = D.ClipId
	WHERE Role = 'co-director'
	AND NOT EXISTS(SELECT 1 FROM Spouses S WHERE S.StaffId = A.StaffId)
)

SELECT S1.FullName, S2.FullName
FROM ActAndCodirect AAC1 INNER JOIN MovieStaff S1 ON AAC1.StaffId = S1.StaffId,
ActAndCodirect AAC2 INNER JOIN MovieStaff S2 ON AAC2.StaffId = S2.StaffId
WHERE AAC1.StaffId < AAC2.StaffId
AND AAC1.ClipId = AAC2.ClipId
GROUP BY S1.FullName, S2.FullName
HAVING(Count(1) > 1)

-- 3.g
SELECT S.FullName
FROM Writes W NATURAL JOIN MovieStaff S
INNER JOIN Produces P ON W.ClipId = P.ClipId AND W.StaffId != P.StaffId
WHERE W.WorkType = 'screenplay'
GROUP BY S.FullName
HAVING COUNT(DISTINCT P.StaffId) > 2

-- 3.i
SELECT AVG(Rank) FROM Classified C NATURAL JOIN Ratings R
WHERE C.GenreId = (SELECT C.genreId FROM Classified C
	GROUP BY C.genreId
	ORDER BY Count(*) DESC
	LIMIT 1)

-- 3.j
SELECT S.FullName,
	SUM(CASE WHEN EXISTS(SELECT 1 FROM Comedies C WHERE C.ClipId = A.ClipId) THEN 1 ELSE 0 END) AS Comedies,
	SUM(CASE WHEN EXISTS(SELECT 1 FROM Dramas D WHERE D.ClipId = A.ClipId) THEN 1 ELSE 0 END) AS Dramas
FROM Acts A NATURAL JOIN MovieStaff S
GROUP BY S.StaffId
HAVING COUNT(*) > 100
AND 0.6*COUNT(*) <= SUM(
	CASE WHEN EXISTS(
		SELECT 1 FROM Shorts WHERE Shorts.ClipId = A.ClipId)
		AND NOT EXISTS(SELECT 1 FROM Comedies C WHERE C.ClipId = A.ClipId)
		AND NOT EXISTS(SELECT 1 FROM Dramas D WHERE D.ClipId = A.ClipId)
	THEN 1 ELSE 0 END)
AND SUM(CASE WHEN EXISTS(SELECT 1 FROM Comedies C WHERE C.ClipId = A.ClipId) THEN 1 ELSE 0 END) >
	2*SUM(CASE WHEN EXISTS(SELECT 1 FROM Dramas D WHERE D.ClipId = A.ClipId) THEN 1 ELSE 0 END)

-- 3.k
SELECT COUNT(*) FROM Classified C
NATURAL JOIN Speaks S
NATURAL JOIN Languages L
WHERE C.genreId = (SELECT C.GenreId
	FROM Classified C
	GROUP BY C.GenreId
	ORDER BY COUNT(*) DESC
	LIMIT 1 OFFSET 1)
AND L.language = 'Dutch'

-- 3.l
SELECT S.FullName FROM Produces P
NATURAL JOIN MovieStaff S
NATURAL JOIN Classified C
WHERE P.Role = 'coordinating producer'
AND C.genreId = (SELECT C.GenreId
	FROM Classified C
	GROUP BY C.GenreId
	ORDER BY COUNT(*) DESC
	LIMIT 1)
GROUP BY S.StaffId
ORDER BY COUNT(C.ClipId) DESC LIMIT 1

