const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(nomGroupe) => "user"
 *
 */

const info = {
  revision: 2,
  name: "noobnotes",
  created: "2022-07-07T09:55:08.220Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "user",
      "nomGroupe",
      {
        type: Sequelize.STRING(4),
        field: "nomGroupe",
        references: { model: "groupe", key: "nomGroupe" },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "user",
      "nomGroupe",
      {
        type: Sequelize.STRING(2),
        field: "nomGroupe",
        references: { model: "groupe", key: "nomGroupe" },
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
