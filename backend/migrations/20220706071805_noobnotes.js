const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(doc) => "docsContenuCours"
 * removeColumn(doc) => "docsTravailARendre"
 * addColumn(lienDoc) => "docsContenuCours"
 * addColumn(lienDoc) => "docsTravailARendre"
 *
 */

const info = {
  revision: 2,
  name: "noobnotes",
  created: "2022-07-06T07:18:05.151Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["docsContenuCours", "doc", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["docsTravailARendre", "doc", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "docsContenuCours",
      "lienDoc",
      { type: Sequelize.TEXT, field: "lienDoc", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "docsTravailARendre",
      "lienDoc",
      { type: Sequelize.TEXT, field: "lienDoc", allowNull: false },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["docsContenuCours", "lienDoc", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["docsTravailARendre", "lienDoc", { transaction }],
  },
  {
    fn: "addColumn",
    params: [
      "docsContenuCours",
      "doc",
      { type: Sequelize.BLOB, field: "doc", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "docsTravailARendre",
      "doc",
      { type: Sequelize.BLOB, field: "doc", allowNull: false },
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
