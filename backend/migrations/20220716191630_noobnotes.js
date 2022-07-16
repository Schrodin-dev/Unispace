const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(idDevoir) => "note"
 * changeColumn(emailUser) => "note"
 *
 */

const info = {
  revision: 3,
  name: "noobnotes",
  created: "2022-07-16T19:16:30.417Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "note",
      "idDevoir",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: "idDevoir",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "devoir", key: "idDevoir" },
        primaryKey: true,
        name: "idDevoir",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "note",
      "emailUser",
      {
        type: Sequelize.STRING(128),
        name: "emailUser",
        primaryKey: true,
        field: "emailUser",
        onUpdate: "cascade",
        onDelete: "SET NULL",
        references: { model: "user", key: "emailUser" },
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
      "note",
      "idDevoir",
      {
        type: Sequelize.INTEGER,
        field: "idDevoir",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "devoir", key: "idDevoir" },
        primaryKey: true,
        name: "idDevoir",
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "note",
      "emailUser",
      {
        type: Sequelize.STRING(128),
        name: "emailUser",
        field: "emailUser",
        onUpdate: "cascade",
        onDelete: "CASCADE",
        references: { model: "user", key: "emailUser" },
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
