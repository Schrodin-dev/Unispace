const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(UEIdUE) => "etreLieUE"
 * changeColumn(ressourceIdRessource) => "etreLieUE"
 *
 */

const info = {
  revision: 2,
  name: "noobnotes",
  created: "2022-09-06T07:06:29.773Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "etreLieUE",
      "UEIdUE",
      {
        type: Sequelize.INTEGER,
        unique: "etreLieUE_UEIdUE_ressourceIdRessource_unique",
        primaryKey: true,
        field: "UEIdUE",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "UE", key: "idUE" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "etreLieUE",
      "ressourceIdRessource",
      {
        type: Sequelize.INTEGER,
        unique: "etreLieUE_UEIdUE_ressourceIdRessource_unique",
        primaryKey: true,
        field: "ressourceIdRessource",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "ressource", key: "idRessource" },
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "etreLieUE",
      "UEIdUE",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "UEIdUE",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "UE", key: "idUE" },
        primaryKey: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "etreLieUE",
      "ressourceIdRessource",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "ressourceIdRessource",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "ressource", key: "idRessource" },
        primaryKey: true,
      },
      { transaction },
    ],
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
