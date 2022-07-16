const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(idTheme) => "user"
 *
 */

const info = {
  revision: 2,
  name: "noobnotes",
  created: "2022-07-16T10:27:42.699Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "user",
      "idTheme",
      {
        type: Sequelize.INTEGER,
        field: "idTheme",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "theme", key: "idTheme" },
        defaultValue: 1,
        name: "idTheme",
        allowNull: false,
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
      "idTheme",
      {
        type: Sequelize.INTEGER,
        field: "idTheme",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "theme", key: "idTheme" },
        name: "idTheme",
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
