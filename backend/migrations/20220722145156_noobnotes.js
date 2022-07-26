const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn(nomAnneeUniv) => "ressource"
 *
 */

const info = {
  revision: 3,
  name: "noobnotes",
  created: "2022-07-22T14:51:56.554Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["ressource", "nomAnneeUniv", { transaction }],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "ressource",
      "nomAnneeUniv",
      {
        type: Sequelize.INTEGER(1),
        field: "nomAnneeUniv",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "anneeUniv", key: "nomAnneeUniv" },
        name: "nomAnneeUniv",
        allowNull: false,
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
