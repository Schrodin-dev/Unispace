const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn(nomDoc) => "docsContenuCours"
 * addColumn(nomDoc) => "docsTravailARendre"
 *
 */

const info = {
  revision: 3,
  name: "noobnotes",
  created: "2022-07-16T11:38:56.211Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "docsContenuCours",
      "nomDoc",
      { type: Sequelize.STRING(100), field: "nomDoc", allowNull: false },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "docsTravailARendre",
      "nomDoc",
      { type: Sequelize.STRING(100), field: "nomDoc", allowNull: false },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["docsContenuCours", "nomDoc", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["docsTravailARendre", "nomDoc", { transaction }],
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
