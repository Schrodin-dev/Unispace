const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(id) => "note"
 * changeColumn(idDevoir) => "note"
 * changeColumn(idDevoir) => "note"
 * changeColumn(emailUser) => "note"
 * changeColumn(emailUser) => "note"
 *
 */

const info = {
  revision: 2,
  name: "noobnotes",
  created: "2022-07-16T18:25:00.871Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["note", "id", { transaction }],
  },
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

const rollbackCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "note",
      "id",
      {
        type: Sequelize.INTEGER,
        field: "id",
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "note",
      "idDevoir",
      {
        type: Sequelize.INTEGER,
        field: "idDevoir",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "devoir", key: "idDevoir" },
        name: "idDevoir",
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "note",
      "idDevoir",
      {
        type: Sequelize.INTEGER,
        field: "idDevoir",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "devoir", key: "idDevoir" },
        name: "idDevoir",
        allowNull: true,
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
        field: "emailUser",
        onUpdate: "cascade",
        onDelete: "cascade",
        references: { model: "user", key: "emailUser" },
        name: "emailUser",
        allowNull: true,
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
        field: "emailUser",
        onUpdate: "cascade",
        onDelete: "cascade",
        references: { model: "user", key: "emailUser" },
        name: "emailUser",
        allowNull: true,
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
