-- DROP TABLE note;
-- DROP TABLE aFait;
-- DROP TABLE doitFaire;
-- DROP TABLE user;
-- DROP TABLE groupe;
-- DROP TABLE classe;
-- DROP TABLE docsContenuCours;
-- DROP TABLE contenuCours;
-- DROP TABLE cours;
-- DROP TABLE devoir;
-- DROP TABLE ressource;
-- DROP TABLE UE;
-- DROP TABLE docsTravailARendre;
-- DROP TABLE travailAFaire;
-- DROP TABLE anneeUniv;
-- DROP TABLE theme;

CREATE TABLE theme(
	idTheme INTEGER,
	imageTheme BLOB NOT NULL,
	couleurPrincipaleTheme VARCHAR(6) NOT NULL,
	couleurFond VARCHAR(6) NOT NULL,
	CONSTRAINT pk_theme PRIMARY KEY(idTheme)
);

CREATE TABLE anneeUniv(
	nomAnneeUniv INTEGER,
	CONSTRAINT pk_AnneeUniv PRIMARY KEY(nomAnneeUniv),
	CONSTRAINT anneeUniv CHECK(nomAnneeUniv > 0 AND nomAnneeUniv <= 3)
);

CREATE TABLE travailAFaire(
	idTravailAFaire INTEGER,
	dateTravailAFaire DATE NOT NULL,
	descTravailAFaire LONGTEXT NOT NULL,
	estNote BOOLEAN NOT NULL,
	CONSTRAINT pk_TravailAFaire PRIMARY KEY(idTravailAFaire)
);

CREATE TABLE docsTravailARendre(
	idDoc INTEGER,
	doc BLOB NOT NULL,
	idTravailAFaire INTEGER NOT NULL,
	CONSTRAINT pk_docsTravailARendre PRIMARY KEY(idDoc),
	CONSTRAINT fk_docDuTravailARendre FOREIGN KEY(idTravailAFaire) REFERENCES travailAFaire(idTravailAFaire)
);

CREATE TABLE UE(
	idUE INTEGER,
	nomUE VARCHAR(256) NOT NULL,
	coeffUE FLOAT NOT NULL,
	CONSTRAINT pk_UE PRIMARY KEY(idUE),
	CONSTRAINT coeffUE CHECK(coeffUE > 0 AND coeffUE <= 100)
);

CREATE TABLE ressource(
	idRessource INTEGER,
	nomRessource VARCHAR(256) NOT NULL,
	coeffRessource FLOAT NOT NULL,
	idUE INTEGER NOT NULL,
	nomAnneeUniv VARCHAR(2) NOT NULL,
	CONSTRAINT pk_ressource PRIMARY KEY(idRessource),
	CONSTRAINT fk_UEDeLaRessource FOREIGN KEY(idUE) REFERENCES UE(idUE),
	CONSTRAINT coeffRessource CHECK(coeffRessource > 0 AND coeffRessource <= 100)
);

CREATE TABLE devoir(
	idDevoir INTEGER,
	coeffDevoir FLOAT NOT NULL,
	nomDevoir VARCHAR(256) NOT NULL,
	idRessource INTEGER NOT NULL,
	CONSTRAINT pk_devoir PRIMARY KEY(idDevoir),
	CONSTRAINT fk_ressourceDuDevoir FOREIGN KEY(idRessource) REFERENCES ressource(idRessource),
	CONSTRAINT coeffDevoir CHECK(coeffDevoir > 0 AND coeffDevoir <= 100)
);

CREATE TABLE cours(
	nomCours VARCHAR(100),
	couleurCours VARCHAR(6) NOT NULL,
	CONSTRAINT pk_cours PRIMARY KEY(nomCours)
);

CREATE TABLE contenuCours(
	idContenuCours INTEGER,
	dateContenuCours DATE NOT NULL,
	descContenuCours LONGTEXT NOT NULL,
	nomCours VARCHAR(100) NOT NULL,
	CONSTRAINT pk_contenuCours PRIMARY KEY(idContenuCours),
	CONSTRAINT fk_nomCoursDuContenu FOREIGN KEY(nomCours) REFERENCES cours(nomCours)
);

CREATE TABLE docsContenuCours(
	idDoc INTEGER,
	doc BLOB NOT NULL,
	idContenuCours INTEGER NOT NULL,
	CONSTRAINT pk_docsContenuCours PRIMARY KEY(idDoc),
	CONSTRAINT fk_docDuContenuCours FOREIGN KEY(idContenuCours) REFERENCES contenuCours(idContenuCours)
);

CREATE TABLE classe(
	nomClasse VARCHAR(2),
	anneeUniv INTEGER NOT NULL,
	CONSTRAINT pk_classe PRIMARY KEY(nomClasse),
	CONSTRAINT fk_anneeUnivDeClasse FOREIGN KEY(anneeUniv) REFERENCES anneeUniv(nomAnneeUniv)
);

CREATE TABLE groupe(
	nomGroupe VARCHAR(2),
	lienICalGroupe VARCHAR(512) NOT NULL,
	nomClasse VARCHAR(2),
	CONSTRAINT pk_groupe PRIMARY KEY(nomGroupe),
	CONSTRAINT fk_classeDuGroupe FOREIGN KEY(nomClasse) REFERENCES classe(nomClasse)
);

CREATE TABLE user(
	emailUser VARCHAR(128),
	nomUser VARCHAR(40) NOT NULL,
	prenomUser VARCHAR(40) NOT NULL,
	droitsUser INTEGER NOT NULL,
	mdpUser VARCHAR(128) NOT NULL,
	accepteRecevoirAnnonces BOOLEAN NOT NULL,
	idTheme INTEGER,
	nomGroupe VARCHAR(2) NOT NULL,
	CONSTRAINT pk_user PRIMARY KEY(emailUser),
	CONSTRAINT fk_themeUser FOREIGN KEY(idTheme) REFERENCES theme(idTheme),
	CONSTRAINT fk_groupeUser FOREIGN KEY(nomGroupe) REFERENCES groupe(nomGroupe),
	CONSTRAINT droitsUser CHECK(droitsUser >= 0 AND droitsUser <= 2)
);

CREATE TABLE doitFaire(
	nomGroupe VARCHAR(2),
	idTravailAFaire INTEGER,
	CONSTRAINT pk_doitFaire PRIMARY KEY(nomGroupe, idTravailAFaire),
	CONSTRAINT fk_groupeDoitFaire FOREIGN KEY(nomGroupe) REFERENCES groupe(nomGroupe),
	CONSTRAINT idTravailAFaire FOREIGN KEY(idTravailAFaire) REFERENCES travailAFaire(idTravailAFaire)
);

CREATE TABLE aFait(
	nomGroupe VARCHAR(2),
	idContenuCours INTEGER,
	CONSTRAINT pk_aFait PRIMARY KEY(nomGroupe, idContenuCours),
	CONSTRAINT fk_groupeAFait FOREIGN KEY(nomGroupe) REFERENCES groupe(nomGroupe),
	CONSTRAINT fk_contenuCoursAFait FOREIGN KEY(idContenuCours) REFERENCES contenuCours(idContenuCours)
);

CREATE TABLE note(
	emailUser VARCHAR(128),
	idDevoir INTEGER,
	noteDevoir FLOAT NOT NULL,
	CONSTRAINT pk_note PRIMARY KEY(emailUser, idDevoir),
	CONSTRAINT fk_noteUser FOREIGN KEY(emailUser) REFERENCES user(emailUser),
	CONSTRAINT fk_noteDevoir FOREIGN KEY(idDevoir) REFERENCES devoir(idDevoir),
	CONSTRAINT noteDevoir CHECK(noteDevoir >= 0 AND noteDevoir <= 20)
);