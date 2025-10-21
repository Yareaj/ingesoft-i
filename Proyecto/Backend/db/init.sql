CREATE TABLE `User` (
  `Email` varchar(100) PRIMARY KEY NOT NULL,
  `Username` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `Names` varchar(45) NOT NULL,
  `LastNames` varchar(45) NOT NULL,
  `Age` integer NOT NULL,
  `ProfilePhoto` varchar(255),
  `Description` text,
  `RegistrationDate` datetime NOT NULL,
  `Gender` enum(Male,Female,Other) NOT NULL
);

CREATE TABLE `Route` (
  `idRoute` int PRIMARY KEY NOT NULL,
  `Distance` decimal(5,2) NOT NULL
);

CREATE TABLE `Training` (
  `Id` int PRIMARY KEY NOT NULL,
  `TimeDate` datetime NOT NULL,
  `Duration` time NOT NULL,
  `Rithm` decimal(4,2) NOT NULL,
  `MaxSpeed` decimal(5,2) NOT NULL,
  `AvgSpeed` decimal(5,2) NOT NULL,
  `Calories` int NOT NULL,
  `ElevationGain` decimal(5,2) NOT NULL,
  `TrainingType` varchar(20) NOT NULL,
  `User_Email` varchar(100) NOT NULL,
  `Route_idRoute` int NOT NULL
);

CREATE TABLE `Coordinate` (
  `ID` varchar(45) PRIMARY KEY,
  `Latitude` decimal NOT NULL,
  `Longitude` decimal NOT NULL,
  `Altitude` decimal NOT NULL
);

CREATE TABLE `Route_Coordinate` (
  `Route_idRoute` int NOT NULL,
  `Coordinate_ID` varchar(45) NOT NULL,
  PRIMARY KEY (`Route_idRoute`, `Coordinate_ID`)
);

CREATE TABLE `Running` (
  `AvgStride` int NOT NULL,
  `Training_Id` int PRIMARY KEY NOT NULL
);

CREATE TABLE `Cycling` (
  `Training_Id` int PRIMARY KEY NOT NULL
);

CREATE TABLE `KM` (
  `Id` int PRIMARY KEY NOT NULL,
  `Time` time NOT NULL,
  `Training_Id` int NOT NULL
);

CREATE TABLE `Publication` (
  `Id` int PRIMARY KEY NOT NULL,
  `Likes` int NOT NULL,
  `RouteImage` varchar(255) NOT NULL,
  `Privacity` enum(Public,Private,Only Followers) NOT NULL,
  `User_Email` varchar(100) NOT NULL,
  `TimeDate` datetime NOT NULL,
  `Training_Id` int NOT NULL,
  `Training_User_Email` varchar(100) NOT NULL
);

CREATE TABLE `Followed` (
  `User_Email` varchar(100) NOT NULL,
  `User_Email1` varchar(100) NOT NULL,
  PRIMARY KEY (`User_Email`, `User_Email1`)
);

CREATE TABLE `MonthlyChallenge` (
  `ID` int PRIMARY KEY NOT NULL,
  `Distance` decimal(5,2) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL
);

CREATE TABLE `User_MonthlyChallenge` (
  `MonthlyChallenge_ID` int NOT NULL,
  `User_Email` varchar(100) NOT NULL,
  PRIMARY KEY (`MonthlyChallenge_ID`, `User_Email`)
);

CREATE TABLE `PhysicalState` (
  `Id` int PRIMARY KEY NOT NULL,
  `DateSaved` timestamp NOT NULL,
  `Weight` decimal NOT NULL,
  `Heigh` decimal NOT NULL,
  `User_Email` varchar(100) NOT NULL
);

CREATE TABLE `WeeklyGoal` (
  `User_Email` varchar(100) PRIMARY KEY NOT NULL,
  `TrainingQuantity` int NOT NULL,
  `Distance` varchar(45) NOT NULL,
  `Completed` tinyint NOT NULL,
  `WeekStart` date NOT NULL
);

CREATE TABLE `Comments` (
  `Id` int PRIMARY KEY NOT NULL,
  `Text` varchar(200) NOT NULL,
  `Likes` int NOT NULL,
  `Publication_User_Email` varchar(100) NOT NULL,
  `Publication_Training_Id` int NOT NULL,
  `Publication_Training_User_Email` varchar(100) NOT NULL
);

CREATE INDEX `Training_index_0` ON `Training` (`User_Email`);

CREATE INDEX `Training_index_1` ON `Training` (`Route_idRoute`);

ALTER TABLE `Training` ADD FOREIGN KEY (`User_Email`) REFERENCES `User` (`Email`);

ALTER TABLE `Training` ADD FOREIGN KEY (`Route_idRoute`) REFERENCES `Route` (`idRoute`);

ALTER TABLE `Route_Coordinate` ADD FOREIGN KEY (`Route_idRoute`) REFERENCES `Route` (`idRoute`);

ALTER TABLE `Route_Coordinate` ADD FOREIGN KEY (`Coordinate_ID`) REFERENCES `Coordinate` (`ID`);

ALTER TABLE `Running` ADD FOREIGN KEY (`Training_Id`) REFERENCES `Training` (`Id`);

ALTER TABLE `Cycling` ADD FOREIGN KEY (`Training_Id`) REFERENCES `Training` (`Id`);

ALTER TABLE `KM` ADD FOREIGN KEY (`Training_Id`) REFERENCES `Training` (`Id`);

ALTER TABLE `Publication` ADD FOREIGN KEY (`User_Email`) REFERENCES `User` (`Email`);

ALTER TABLE `Followed` ADD FOREIGN KEY (`User_Email`) REFERENCES `User` (`Email`);

ALTER TABLE `Followed` ADD FOREIGN KEY (`User_Email1`) REFERENCES `User` (`Email`);

ALTER TABLE `User_MonthlyChallenge` ADD FOREIGN KEY (`User_Email`) REFERENCES `User` (`Email`);

ALTER TABLE `PhysicalState` ADD FOREIGN KEY (`User_Email`) REFERENCES `User` (`Email`);

ALTER TABLE `WeeklyGoal` ADD FOREIGN KEY (`User_Email`) REFERENCES `User` (`Email`);

ALTER TABLE `User_MonthlyChallenge` ADD FOREIGN KEY (`MonthlyChallenge_ID`) REFERENCES `MonthlyChallenge` (`ID`);

ALTER TABLE `Comments` ADD FOREIGN KEY (`Id`) REFERENCES `Publication` (`Id`);
