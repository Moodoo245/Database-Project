CREATE TABLE Biographies ( StaffId INT, 
			   Name VARCHAR(40),
			   Realname VARCHAR(40),
			   Nickname VARCHAR(40),
			   DateAndPlaceOfBirth VARCHAR(40),
			   Height ENUM(feet, inches),
			   Biography TEXT,
			   Biographer VARCHAR(40),
			   DateAndCauseOfDeath VARCHAR(100),
			   Spouse VARCHAR(40),
			   Trivia TEXT,
			   BiographicalBooks TEXT,
			   PersonalQuotes TEXT,
			   Salary INT,
			   Trademark VARCHAR(20),
			   WhereAreTheyNow TEXT,
			   PRIMARY KEY (StaffId, Name),
			   FOREIGN KEY (StaffId) REFERENCES MovieStaff
			   	ON DELETE CASCADE )

CREATE TABLE MovieStaff ( StaffId INT,
			  FullName VARCHAR(40),
			  PRIMARY KEY (FullName) )

CREATE TABLE Writes ( StaffId INT,
		      ClipId INT,
		      AddInfos VARCHAR(100),
		      Role VARCHAR(40),
		      WorkType VARCHAR(40),
		      FOREIGN KEY (StaffId) REFERENCES MovieStaff,
		      FOREIGN KEY (ClipId) REFERENCES Clip )

CREATE TABLE Produces ( StaffId INT,
			ClipId INT,
			AddInfos VARCHAR(100),
			Role VARCHAR(40),
			FOREIGN KEY (StaffId) REFERENCES MovieStaff,
			FOREIGN KEY (ClipId) REFERENCES Clip )

CREATE TABLE Directs ( StaffId INT,
		       ClipId INT,
		       AddInfos VARCHAR(100),
		       Role VARCHAR(40),
		       FOREIGN KEY (StaffId) REFERENCES MovieStaff,
		       FOREIGN KEY (ClipId) REFERENCES Clip )

CREATE TABLE Acts ( StaffId INT,
		    ClipId INT,
		    AddInfos VARCHAR(100),
		    Char VARCHAR(40),
		    OrdersCredit INT,
		    FOREIGN KEY (StaffId) REFERENCES MovieStaff,
		    FOREIGN KEY (ClipId) REFERENCES Clip )
CREATE TABLE Clip ( ClipId INT,
					ClipTitle VARCHAR(100),
					ClipYear INT,
					ClipType VARCHAR(20),
					PRIMARY KEY (ClipId) )
CREATE TABLE ClipLinks( ClipFrom INT,
						ClipTo INT,
						LinkType VARCHAR(20) )
CREATE TABLE Ratings ( ClipId INT,
						Votes INT,
						RANK DOUBLE,
						PRIMARY KEY (ClipId, Votes),
						FOREIGN KEY (ClipId) REFERENCES Clip,
						ON DELETE CASCADE )
CREATE TABLE ReleaseCountry ( ClipId INT,
							  ReleaseCountry VARCHAR(40),
							  ReleaseDate INT,
							  RunningTime INT,
							  PRIMARY KEY (ClidId, ReleaseCountry),
							  FOREIGN KEY (ClipId) REFERENCES Clip,
							  ON DELETE CASCADE )
CREATE TABLE Country ( ClipId INT,
						CountryName VARCHAR(40),
						PRIMARY KEY (ClipId, CountryName),
						FOREIGN KEY (ClidId) REFERENCES Clip,
						ON DELETE CASCADE )
CREATE TABLE Languages (ClipId INT,
						Language VARCHAR(20),
						PRIMARY KEY (ClipId, Language),
						FOREIGN KEY (ClipId) REFERENCES Clip,
						ON DELETE CASCADE )
CREATE TABLE Genres (ClipId INT,
					Genre VARCHAR(20),
					PRIMARY KEY (ClipId, Genre),
					FOREIGN KEY (ClipId) REFERENCES Clip,
					ON DELETE CASCADE )