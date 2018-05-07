CREATE TABLE MovieStaff (
	StaffId SERIAL,
	FullName VARCHAR(128),
	PRIMARY KEY (StaffId)
);

CREATE TABLE Biographies (
	StaffId INT, 
	Name VARCHAR(64),
	Realname VARCHAR(64),
	DateAndPlaceOfBirth VARCHAR(128),
	Height VARCHAR(16),
	Biography TEXT,
	Biographer VARCHAR(32),
	DateAndCauseOfDeath VARCHAR(128),
	Trivia TEXT,
	PersonalQuotes TEXT,
	Salary TEXT,
	Trademark VARCHAR(256),
	WhereAreTheyNow TEXT,
	PRIMARY KEY (StaffId),
	FOREIGN KEY (StaffId) REFERENCES MovieStaff ON DELETE CASCADE
);

CREATE TABLE BiographicalBooks (
	StaffId INT,
	Book VARCHAR(128)
);

CREATE TABLE Spouses (
	StaffId INT,
	Spouse VARCHAR(128),
	FOREIGN KEY (StaffId) REFERENCES MovieStaff ON DELETE CASCADE
);

CREATE TABLE Clips (
	ClipId INT,
	ClipTitle TEXT,
	ClipYear INT,
	ClipType VARCHAR(64),
	PRIMARY KEY (ClipId)
);

CREATE TABLE Writes (
	StaffId INT,
	ClipId INT,
	AddInfos VARCHAR(128),
	Role TEXT,
	WorkType TEXT,
	PRIMARY KEY (StaffId, ClipId),
	FOREIGN KEY (StaffId) REFERENCES MovieStaff ON DELETE CASCADE,
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE Produces (
	StaffId INT,
	ClipId INT,
	AddInfos VARCHAR(128),
	Role TEXT,
	PRIMARY KEY (StaffId, ClipId),
	FOREIGN KEY (StaffId) REFERENCES MovieStaff ON DELETE CASCADE,
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE Directs (
	StaffId INT,
	ClipId INT,
	AddInfos VARCHAR(128),
	Role TEXT,
	PRIMARY KEY (StaffId, ClipId),
	FOREIGN KEY (StaffId) REFERENCES MovieStaff ON DELETE CASCADE,
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE Acts (
	StaffId INT,
	ClipId INT,
	Char TEXT,
	OrdersCredit INT,
	AddInfos TEXT,
	PRIMARY KEY (StaffId, ClipId),
	FOREIGN KEY (StaffId) REFERENCES MovieStaff ON DELETE CASCADE,
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE ClipLinks(
	ClipFrom INT,
	ClipTo INT,
	LinkType VARCHAR(32),
	PRIMARY KEY (ClipFrom, ClipTo, LinkType),
	FOREIGN KEY (ClipFrom) REFERENCES Clips ON DELETE CASCADE,
	FOREIGN KEY (ClipTo) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE Ratings (
	ClipId INT,
	Votes INT,
	RANK REAL,
	PRIMARY KEY (ClipId),
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE RunningTimes (
	ClipId INT,
	ReleaseCountry VARCHAR(32),
	RunningTime INT,
	PRIMARY KEY (ClipId, ReleaseCountry),
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE ReleaseDates (
	ClipId INT,
	ReleaseCountry varchar(32),
	ReleaseDate VARCHAR(32),
	PRIMARY KEY (ClipId, ReleaseCountry),
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE AssociatedCountries (
	ClipId INT,
	CountryName VARCHAR(40),
	PRIMARY KEY (ClipId, CountryName),
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE Languages (
	ClipId INT,
	Language VARCHAR(64),
	PRIMARY KEY (ClipId, Language),
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);

CREATE TABLE Genres (
	ClipId INT,
	Genre VARCHAR(32),
	PRIMARY KEY (ClipId, Genre),
	FOREIGN KEY (ClipId) REFERENCES Clips ON DELETE CASCADE
);
