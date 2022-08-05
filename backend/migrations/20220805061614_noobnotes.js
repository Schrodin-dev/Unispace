const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "anneeUniv", deps: []
 * createTable() => "cours", deps: []
 * createTable() => "ressource", deps: []
 * createTable() => "theme", deps: []
 * createTable() => "travailDeGroupe", deps: []
 * createTable() => "travailAFaire", deps: []
 * createTable() => "classe", deps: [anneeUniv]
 * createTable() => "contenuCours", deps: [cours]
 * createTable() => "devoir", deps: [ressource]
 * createTable() => "docsContenuCours", deps: [contenuCours]
 * createTable() => "docsTravailARendre", deps: [travailAFaire]
 * createTable() => "semestre", deps: [anneeUniv]
 * createTable() => "groupe", deps: [classe]
 * createTable() => "groupeDeTravail", deps: [travailDeGroupe]
 * createTable() => "user", deps: [groupe, theme]
 * createTable() => "UE", deps: [semestre]
 * createTable() => "note", deps: [devoir, user]
 * createTable() => "etreLieUE", deps: [ressource, UE]
 * createTable() => "travailler", deps: [groupeDeTravail, user]
 * createTable() => "aFait", deps: [contenuCours, groupe]
 * createTable() => "aPourDevoir", deps: [devoir, groupe]
 * createTable() => "doitFaire", deps: [groupe, travailAFaire]
 * createTable() => "concernerGroupe", deps: [groupe, travailDeGroupe]
 *
 */

const info = {
  revision: 1,
  name: "noobnotes",
  created: "2022-08-05T06:16:14.535Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "anneeUniv",
      {
        nomAnneeUniv: {
          type: Sequelize.INTEGER(1),
          field: "nomAnneeUniv",
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "cours",
      {
        nomCours: {
          type: Sequelize.STRING(100),
          field: "nomCours",
          primaryKey: true,
        },
        couleurCours: {
          type: Sequelize.STRING(6),
          field: "couleurCours",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "ressource",
      {
        idRessource: {
          type: Sequelize.INTEGER,
          field: "idRessource",
          autoIncrement: true,
          primaryKey: true,
        },
        nomRessource: {
          type: Sequelize.STRING(256),
          field: "nomRessource",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "theme",
      {
        idTheme: {
          type: Sequelize.INTEGER,
          field: "idTheme",
          autoIncrement: true,
          primaryKey: true,
        },
        imageTheme: {
          type: Sequelize.BLOB,
          field: "imageTheme",
          allowNull: false,
        },
        sourceTheme: {
          type: Sequelize.STRING(512),
          field: "sourceTheme",
          allowNull: false,
        },
        couleurPrincipaleTheme: {
          type: Sequelize.STRING(6),
          field: "couleurPrincipaleTheme",
          allowNull: false,
        },
        couleurFond: {
          type: Sequelize.STRING(6),
          field: "couleurFond",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "travailDeGroupe",
      {
        idTravailDeGroupe: {
          type: Sequelize.INTEGER(1),
          field: "idTravailDeGroupe",
          autoIncrement: true,
          primaryKey: true,
        },
        nomTravailDeGroupe: {
          type: Sequelize.STRING(50),
          field: "nomTravailDeGroupe",
          required: true,
        },
        membresMin: {
          type: Sequelize.INTEGER,
          field: "membresMin",
          required: true,
        },
        membresMax: {
          type: Sequelize.INTEGER,
          field: "membresMax",
          required: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "travailAFaire",
      {
        idTravailAFaire: {
          type: Sequelize.INTEGER,
          field: "idTravailAFaire",
          autoIncrement: true,
          primaryKey: true,
        },
        dateTravailAFaire: {
          type: Sequelize.DATE,
          field: "dateTravailAFaire",
          allowNull: false,
        },
        descTravailAFaire: {
          type: Sequelize.TEXT,
          field: "descTravailAFaire",
          allowNull: false,
        },
        estNote: {
          type: Sequelize.BOOLEAN,
          field: "estNote",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "classe",
      {
        nomClasse: {
          type: Sequelize.STRING(2),
          field: "nomClasse",
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        nomAnneeUniv: {
          type: Sequelize.INTEGER(1),
          field: "nomAnneeUniv",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "anneeUniv", key: "nomAnneeUniv" },
          name: "nomAnneeUniv",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "contenuCours",
      {
        idContenuCours: {
          type: Sequelize.INTEGER,
          field: "idContenuCours",
          autoIncrement: true,
          primaryKey: true,
        },
        dateContenuCours: {
          type: Sequelize.DATE,
          field: "dateContenuCours",
          allowNull: false,
        },
        descContenuCours: {
          type: Sequelize.TEXT,
          field: "descContenuCours",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        nomCours: {
          type: Sequelize.STRING(100),
          field: "nomCours",
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "cours", key: "nomCours" },
          name: "nomCours",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "devoir",
      {
        idDevoir: {
          type: Sequelize.INTEGER,
          field: "idDevoir",
          autoIncrement: true,
          primaryKey: true,
        },
        coeffDevoir: {
          type: Sequelize.FLOAT,
          field: "coeffDevoir",
          allowNull: false,
        },
        nomDevoir: {
          type: Sequelize.STRING,
          field: "nomDevoir",
          allowNull: false,
        },
        noteMaxDevoir: {
          type: Sequelize.INTEGER,
          field: "noteMaxDevoir",
          defaultValue: 20,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        idRessource: {
          type: Sequelize.INTEGER,
          field: "idRessource",
          onUpdate: "cascade",
          onDelete: "cascade",
          references: { model: "ressource", key: "idRessource" },
          name: "idRessource",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "docsContenuCours",
      {
        idDoc: {
          type: Sequelize.INTEGER,
          field: "idDoc",
          autoIncrement: true,
          primaryKey: true,
        },
        nomDoc: {
          type: Sequelize.STRING(100),
          field: "nomDoc",
          allowNull: false,
        },
        lienDoc: { type: Sequelize.TEXT, field: "lienDoc", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        idContenuCours: {
          type: Sequelize.INTEGER,
          field: "idContenuCours",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "contenuCours", key: "idContenuCours" },
          name: "idContenuCours",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "docsTravailARendre",
      {
        idDoc: {
          type: Sequelize.INTEGER,
          field: "idDoc",
          autoIncrement: true,
          primaryKey: true,
        },
        nomDoc: {
          type: Sequelize.STRING(100),
          field: "nomDoc",
          allowNull: false,
        },
        lienDoc: { type: Sequelize.TEXT, field: "lienDoc", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        idTravailAFaire: {
          type: Sequelize.INTEGER,
          field: "idTravailAFaire",
          onUpdate: "cascade",
          onDelete: "cascade",
          references: { model: "travailAFaire", key: "idTravailAFaire" },
          name: "idTravailAFaire",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "semestre",
      {
        nomSemestre: {
          type: Sequelize.INTEGER(1),
          field: "nomSemestre",
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        nomAnneeUniv: {
          type: Sequelize.INTEGER(1),
          field: "nomAnneeUniv",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "anneeUniv", key: "nomAnneeUniv" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "groupe",
      {
        nomGroupe: {
          type: Sequelize.STRING(4),
          field: "nomGroupe",
          primaryKey: true,
        },
        lienICalGroupe: {
          type: Sequelize.STRING(512),
          field: "lienICalGroupe",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        nomClasse: {
          type: Sequelize.STRING(2),
          field: "nomClasse",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "classe", key: "nomClasse" },
          name: "nomClasse",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "groupeDeTravail",
      {
        idGroupeDeTravail: {
          type: Sequelize.INTEGER,
          field: "idGroupeDeTravail",
          autoIncrement: true,
          primaryKey: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        idTravailDeGroupe: {
          type: Sequelize.INTEGER(1),
          field: "idTravailDeGroupe",
          onUpdate: "CASCADE",
          onDelete: "cascade",
          references: { model: "travailDeGroupe", key: "idTravailDeGroupe" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "user",
      {
        emailUser: {
          type: Sequelize.STRING(128),
          field: "emailUser",
          primaryKey: true,
        },
        nomUser: {
          type: Sequelize.STRING(40),
          field: "nomUser",
          allowNull: false,
        },
        prenomUser: {
          type: Sequelize.STRING(40),
          field: "prenomUser",
          allowNull: false,
        },
        droitsUser: {
          type: Sequelize.INTEGER(1),
          field: "droitsUser",
          defaultValue: -1,
          allowNull: false,
        },
        mdpUser: {
          type: Sequelize.STRING(128),
          field: "mdpUser",
          allowNull: false,
        },
        accepteRecevoirAnnonces: {
          type: Sequelize.BOOLEAN,
          field: "accepteRecevoirAnnonces",
          defaultValue: true,
          allowNull: false,
        },
        codeVerification: { type: Sequelize.UUID, field: "codeVerification" },
        expirationCodeVerification: {
          type: Sequelize.DATE,
          field: "expirationCodeVerification",
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        nomGroupe: {
          type: Sequelize.STRING(4),
          field: "nomGroupe",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "groupe", key: "nomGroupe" },
          name: "nomGroupe",
          allowNull: true,
        },
        idTheme: {
          type: Sequelize.INTEGER,
          field: "idTheme",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "theme", key: "idTheme" },
          defaultValue: 1,
          name: "idTheme",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "UE",
      {
        idUE: {
          type: Sequelize.INTEGER,
          field: "idUE",
          autoIncrement: true,
          primaryKey: true,
        },
        nomUE: { type: Sequelize.STRING, field: "nomUE", allowNull: false },
        numeroUE: {
          type: Sequelize.INTEGER(1),
          field: "numeroUE",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        nomSemestre: {
          type: Sequelize.INTEGER(1),
          field: "nomSemestre",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "semestre", key: "nomSemestre" },
          name: "nomSemestre",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "note",
      {
        noteDevoir: {
          type: Sequelize.FLOAT,
          field: "noteDevoir",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        devoirIdDevoir: {
          type: Sequelize.INTEGER,
          allowNull: true,
          field: "devoirIdDevoir",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "devoir", key: "idDevoir" },
          primaryKey: true,
        },
        userEmailUser: {
          type: Sequelize.STRING(128),
          allowNull: true,
          field: "userEmailUser",
          onUpdate: "cascade",
          onDelete: "CASCADE",
          references: { model: "user", key: "emailUser" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "etreLieUE",
      {
        coeffRessource: {
          type: Sequelize.FLOAT,
          field: "coeffRessource",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        ressourceIdRessource: {
          type: Sequelize.INTEGER,
          allowNull: true,
          field: "ressourceIdRessource",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "ressource", key: "idRessource" },
          primaryKey: true,
        },
        UEIdUE: {
          type: Sequelize.INTEGER,
          allowNull: true,
          field: "UEIdUE",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "UE", key: "idUE" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "travailler",
      {
        UUIDInvitation: { type: Sequelize.UUID, field: "UUIDInvitation" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        groupeDeTravailIdGroupeDeTravail: {
          type: Sequelize.INTEGER,
          allowNull: true,
          field: "groupeDeTravailIdGroupeDeTravail",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "groupeDeTravail", key: "idGroupeDeTravail" },
          primaryKey: true,
        },
        userEmailUser: {
          type: Sequelize.STRING(128),
          allowNull: true,
          field: "userEmailUser",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "user", key: "emailUser" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "aFait",
      {
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        idContenuCours: {
          type: Sequelize.INTEGER,
          field: "idContenuCours",
          onUpdate: "cascade",
          onDelete: "cascade",
          references: { model: "contenuCours", key: "idContenuCours" },
          primaryKey: true,
        },
        nomGroupe: {
          type: Sequelize.STRING(4),
          field: "nomGroupe",
          onUpdate: "cascade",
          onDelete: "cascade",
          references: { model: "groupe", key: "nomGroupe" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "aPourDevoir",
      {
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        idDevoir: {
          type: Sequelize.INTEGER,
          field: "idDevoir",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "devoir", key: "idDevoir" },
          primaryKey: true,
          name: "idDevoir",
        },
        nomGroupe: {
          type: Sequelize.STRING(4),
          name: "nomGroupe",
          field: "nomGroupe",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "groupe", key: "nomGroupe" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "doitFaire",
      {
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        nomGroupe: {
          type: Sequelize.STRING(4),
          field: "nomGroupe",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "groupe", key: "nomGroupe" },
          primaryKey: true,
        },
        idTravailAFaire: {
          type: Sequelize.INTEGER,
          field: "idTravailAFaire",
          onUpdate: "cascade",
          onDelete: "cascade",
          references: { model: "travailAFaire", key: "idTravailAFaire" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "concernerGroupe",
      {
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        nomGroupe: {
          type: Sequelize.STRING(4),
          field: "nomGroupe",
          onUpdate: "CASCADE",
          onDelete: "cascade",
          references: { model: "groupe", key: "nomGroupe" },
          primaryKey: true,
        },
        idTravailDeGroupe: {
          type: Sequelize.INTEGER(1),
          field: "idTravailDeGroupe",
          onUpdate: "CASCADE",
          onDelete: "cascade",
          references: { model: "travailDeGroupe", key: "idTravailDeGroupe" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["anneeUniv", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["classe", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["contenuCours", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["cours", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["devoir", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["docsContenuCours", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["docsTravailARendre", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["etreLieUE", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["groupe", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["groupeDeTravail", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["note", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["ressource", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["semestre", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["theme", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["travailDeGroupe", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["travailAFaire", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["travailler", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["UE", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["user", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["aFait", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["aPourDevoir", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["doitFaire", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["concernerGroupe", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
