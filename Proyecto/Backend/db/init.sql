-- PostgreSQL-compatible DDL converted from MySQL
-- NOTE: This file assumes you are already connected to the target database.

DROP TABLE IF EXISTS "Comments" CASCADE;
DROP TABLE IF EXISTS "Route_has_Coordinate" CASCADE;
DROP TABLE IF EXISTS "Kilometer" CASCADE;
DROP TABLE IF EXISTS "Publication" CASCADE;
DROP TABLE IF EXISTS "Training" CASCADE;
DROP TABLE IF EXISTS "Followed" CASCADE;
DROP TABLE IF EXISTS "User_has_MonthlyChallenge" CASCADE;
DROP TABLE IF EXISTS "MonthlyChallenge" CASCADE;
DROP TABLE IF EXISTS "Reto" CASCADE;
DROP TABLE IF EXISTS "Coordinate" CASCADE;
DROP TABLE IF EXISTS "Route" CASCADE;
DROP TABLE IF EXISTS "WeeklyGoal" CASCADE;
DROP TABLE IF EXISTS "PhysicalState" CASCADE;
DROP TABLE IF EXISTS "UserGR" CASCADE;

-- Tabla UserGR
CREATE TABLE "UserGR" (
  "email" VARCHAR(100) NOT NULL,
  "username" VARCHAR(45) NOT NULL,
  "password" VARCHAR(45) NOT NULL,
  "names" VARCHAR(45) NOT NULL,
  "lastNames" VARCHAR(45) NOT NULL,
  "age" INT NOT NULL,
  "profilePhoto" VARCHAR(255),
  "description" TEXT,
  "registrationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "gender" VARCHAR(45),
  PRIMARY KEY ("email")
);

-- Tabla PhysicalState
CREATE TABLE "PhysicalState" (
  "userEmail" VARCHAR(100) NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "height" DECIMAL(3,2) NOT NULL,
  "weight" DECIMAL(5,2) NOT NULL,
  PRIMARY KEY ("userEmail", "date")
);

ALTER TABLE "PhysicalState" ADD CONSTRAINT fk_physicalstate_usergr FOREIGN KEY ("userEmail") REFERENCES "UserGR"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla WeeklyGoal
CREATE TABLE "WeeklyGoal" (
  "userEmail" VARCHAR(100) NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "trainingQuantity" INT NOT NULL,
  "distance" DECIMAL(5,2) NOT NULL,
  "completed" SMALLINT NOT NULL,
  PRIMARY KEY ("userEmail", "startDate")
);

ALTER TABLE "WeeklyGoal" ADD CONSTRAINT fk_weeklygoal_usergr FOREIGN KEY ("userEmail") REFERENCES "UserGR"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla Route
CREATE TABLE "Route" (
  "id" SERIAL PRIMARY KEY,
  "distance" DECIMAL(5,2) NOT NULL
);

-- Tabla Coordinate
CREATE TABLE "Coordinate" (
  "id" SERIAL PRIMARY KEY,
  "latitude" REAL NOT NULL,
  "longitude" REAL NOT NULL,
  "altitude" REAL NOT NULL
);

-- Tabla MonthlyChallenge
CREATE TABLE "MonthlyChallenge" (
  "id" SERIAL PRIMARY KEY,
  "distance" DECIMAL(5,2) NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL
);

-- Tabla User_has_MonthlyChallenge
CREATE TABLE "User_has_MonthlyChallenge" (
  "monId" INT NOT NULL,
  "userEmail" VARCHAR(100) NOT NULL,
  PRIMARY KEY ("monId", "userEmail")
);

ALTER TABLE "User_has_MonthlyChallenge" ADD CONSTRAINT fk_user_monthlychallenge_monthly FOREIGN KEY ("monId") REFERENCES "MonthlyChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User_has_MonthlyChallenge" ADD CONSTRAINT fk_user_monthlychallenge_usergr FOREIGN KEY ("userEmail") REFERENCES "UserGR"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla Route_has_Coordinate
CREATE TABLE "Route_has_Coordinate" (
  "routeId" INT NOT NULL,
  "coordinateId" INT NOT NULL,
  PRIMARY KEY ("routeId", "coordinateId")
);

ALTER TABLE "Route_has_Coordinate" ADD CONSTRAINT fk_route_has_coordinate_route FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Route_has_Coordinate" ADD CONSTRAINT fk_route_has_coordinate_coordinate FOREIGN KEY ("coordinateId") REFERENCES "Coordinate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla Training
CREATE TABLE "Training" (
  "counter" SERIAL PRIMARY KEY,
  "userEmail" VARCHAR(100) NOT NULL,
  "routeId" INT NOT NULL,
  "datetime" TIMESTAMP NOT NULL,
  "duration" TIME NOT NULL,
  "rithm" DECIMAL(4,2) NOT NULL,
  "maxSpeed" DECIMAL(5,2) NOT NULL,
  "avgSpeed" DECIMAL(5,2) NOT NULL,
  "calories" DECIMAL(6,2) NOT NULL,
  "elevationGain" DECIMAL(5,2) NOT NULL,
  "trainingType" VARCHAR(10) NOT NULL CHECK ("trainingType" IN ('Running','Cycling')),
  "isGhost" SMALLINT NOT NULL,
  "avgStride" DECIMAL(5,2),
  UNIQUE ("userEmail", "routeId", "counter")
);

ALTER TABLE "Training" ADD CONSTRAINT fk_training_usergr FOREIGN KEY ("userEmail") REFERENCES "UserGR"("email") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Training" ADD CONSTRAINT fk_training_route FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla Kilometer
CREATE TABLE "Kilometer" (
  "counter" SERIAL,
  "time" TIME NOT NULL,
  "routeId" INT NOT NULL,
  "trainingCounter" INT NOT NULL,
  "userEmail" VARCHAR(100) NOT NULL,
  PRIMARY KEY ("counter", "routeId", "trainingCounter", "userEmail")
);

ALTER TABLE "Kilometer" ADD CONSTRAINT fk_kilometer_route FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Kilometer" ADD CONSTRAINT fk_kilometer_training FOREIGN KEY ("userEmail", "routeId", "trainingCounter") REFERENCES "Training"("userEmail", "routeId", "counter") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla Publication
CREATE TABLE "Publication" (
  "counter" SERIAL,
  "likes" INT NOT NULL,
  "routeImage" VARCHAR(255),
  "privacy" INT NOT NULL,
  "datetime" TIMESTAMP NOT NULL,
  "userEmail" VARCHAR(100) NOT NULL,
  "trainingCounter" INT NOT NULL,
  "routeId" INT NOT NULL,
  PRIMARY KEY ("counter", "userEmail", "trainingCounter", "routeId")
);

ALTER TABLE "Publication" ADD CONSTRAINT fk_publication_training FOREIGN KEY ("userEmail", "routeId", "trainingCounter") REFERENCES "Training"("userEmail", "routeId", "counter") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla Followed
CREATE TABLE "Followed" (
  "emailFollower" VARCHAR(100) NOT NULL,
  "emailFollowed" VARCHAR(100) NOT NULL,
  PRIMARY KEY ("emailFollower", "emailFollowed")
);

ALTER TABLE "Followed" ADD CONSTRAINT fk_followed_follower FOREIGN KEY ("emailFollower") REFERENCES "UserGR"("email") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Followed" ADD CONSTRAINT fk_followed_followed FOREIGN KEY ("emailFollowed") REFERENCES "UserGR"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- Tabla Comments (Comentarios de publicaciones)
CREATE TABLE "Comments" (
  "publicationCounter" INT NOT NULL,
  "userEmail" VARCHAR(100) NOT NULL,
  "trainingCounter" INT NOT NULL,
  "routeId" INT NOT NULL,
  "counter" SERIAL,
  "text" TEXT NOT NULL,
  "likes" INT NOT NULL DEFAULT 0,
  "datetime" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("counter", "publicationCounter", "userEmail", "trainingCounter", "routeId")
);

ALTER TABLE "Comments" ADD CONSTRAINT fk_comments_publication FOREIGN KEY ("publicationCounter", "userEmail", "trainingCounter", "routeId") 
  REFERENCES "Publication"("counter", "userEmail", "trainingCounter", "routeId") 
  ON DELETE CASCADE ON UPDATE CASCADE;


