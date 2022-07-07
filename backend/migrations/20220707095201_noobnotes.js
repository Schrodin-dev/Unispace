const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "anneeUniv", deps: []
 * createTable() => "cours", deps: []
 * createTable() => "theme", deps: []
 * createTable() => "travailAFaire", deps: []
 * createTable() => "UE", deps: []
 * createTable() => "classe", deps: [anneeUniv]
 * createTable() => "groupe", deps: [classe]
 * createTable() => "contenuCours", deps: [cours]
 * createTable() => "ressource", deps: [ue, anneeUniv]
 * createTable() => "docsContenuCours", deps: [contenuCours]
 * createTable() => "docsTravailARendre", deps: [travailAFaire]
 * createTable() => "aFait", deps: [groupe]
 * createTable() => "doitFaire", deps: [groupe, travailAFaire]
 * createTable() => "user", deps: [groupe]
 * createTable() => "devoir", deps: [ressource]
 * createTable() => "note", deps: [user, devoir]
 *
 */

const info = {
  revision: 1,
  name: "noobnotes",
  created: "2022-07-07T09:52:01.988Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "anneeUniv",
      {
        nomAnneeUniv: {
          type: Sequelize.INTEGER,
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
      "UE",
      {
        idUE: {
          type: Sequelize.INTEGER,
          field: "idUE",
          autoIncrement: true,
          primaryKey: true,
        },
        nomUE: { type: Sequelize.STRING, field: "nomUE", allowNull: false },
        coeffUE: { type: Sequelize.FLOAT, field: "coeffUE", allowNull: false },
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
        anneeUniv: {
          type: Sequelize.INTEGER,
          field: "anneeUniv",
          references: { model: "anneeUniv", key: "nomAnneeUniv" },
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
        nomClasse: {
          type: Sequelize.STRING(2),
          field: "nomClasse",
          references: { model: "classe", key: "nomClasse" },
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
        nomCours: {
          type: Sequelize.STRING(100),
          field: "nomCours",
          references: { model: "cours", key: "nomCours" },
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
        coeffRessource: {
          type: Sequelize.FLOAT,
          field: "coeffRessource",
          allowNull: false,
        },
        idUE: {
          type: Sequelize.INTEGER,
          field: "idUE",
          references: { model: "ue", key: "idUE" },
          allowNull: false,
        },
        nomAnneeUniv: {
          type: Sequelize.INTEGER,
          field: "nomAnneeUniv",
          references: { model: "anneeUniv", key: "nomAnneeUniv" },
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
      "docsContenuCours",
      {
        idDoc: {
          type: Sequelize.INTEGER,
          field: "idDoc",
          autoIncrement: true,
          primaryKey: true,
        },
        lienDoc: { type: Sequelize.TEXT, field: "lienDoc", allowNull: false },
        idContenuCours: {
          type: Sequelize.INTEGER,
          field: "idContenuCours",
          references: { model: "contenuCours", key: "idContenuCours" },
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
      "docsTravailARendre",
      {
        idDoc: {
          type: Sequelize.INTEGER,
          field: "idDoc",
          autoIncrement: true,
          primaryKey: true,
        },
        lienDoc: { type: Sequelize.TEXT, field: "lienDoc", allowNull: false },
        idTravailAFaire: {
          type: Sequelize.INTEGER,
          field: "idTravailAFaire",
          references: { model: "travailAFaire", key: "idTravailAFaire" },
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
      "aFait",
      {
        nomGroupe: {
          type: Sequelize.STRING(4),
          field: "nomGroupe",
          references: { model: "groupe", key: "nomGroupe" },
          primaryKey: true,
        },
        idContenuCours: {
          type: Sequelize.INTEGER,
          field: "idContenuCours",
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
      "doitFaire",
      {
        nomGroupe: {
          type: Sequelize.STRING(4),
          field: "nomGroupe",
          references: { model: "groupe", key: "nomGroupe" },
          primaryKey: true,
        },
        idTravailAFaire: {
          type: Sequelize.INTEGER,
          field: "idTravailAFaire",
          references: { model: "travailAFaire", key: "idTravailAFaire" },
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
          defaultValue: 0,
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
        idTheme: {
          type: Sequelize.INTEGER,
          field: "idTheme",
          defaultValue: 0,
          allowNull: false,
        },
        nomGroupe: {
          type: Sequelize.STRING(2),
          field: "nomGroupe",
          references: { model: "groupe", key: "nomGroupe" },
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
        idRessource: {
          type: Sequelize.INTEGER,
          field: "idRessource",
          references: { model: "ressource", key: "idRessource" },
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
      "note",
      {
        emailUser: {
          type: Sequelize.STRING(128),
          field: "emailUser",
          references: { model: "user", key: "emailUser" },
          primaryKey: true,
        },
        idDevoir: {
          type: Sequelize.INTEGER,
          field: "idDevoir",
          references: { model: "devoir", key: "idDevoir" },
          primaryKey: true,
        },
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
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["aFait", { transaction }],
  },
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
    params: ["doitFaire", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["groupe", { transaction }],
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
    params: ["theme", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["travailAFaire", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["UE", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["user", { transaction }],
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
