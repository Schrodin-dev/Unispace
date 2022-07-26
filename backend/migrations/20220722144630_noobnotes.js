const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn(nomSemestre) => "UE"
 * changeColumn(nomSemestre) => "UE"
 *
 */

const info = {
  revision: 2,
  name: "noobnotes",
  created: "2022-07-22T14:46:30.594Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "changeColumn",
    params: [
      "UE",
      "nomSemestre",
      {
        type: Sequelize.INTEGER(1),
        field: "nomSemestre",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "semestre", key: "nomSemestre" },
        name: "nomSemestre",
        allowNull: false,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "UE",
      "nomSemestre",
      {
        type: Sequelize.INTEGER(1),
        field: "nomSemestre",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        references: { model: "semestre", key: "nomSemestre" },
        name: "nomSemestre",
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
      "UE",
      "nomSemestre",
      {
        type: Sequelize.INTEGER(1),
        field: "nomSemestre",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "semestre", key: "nomSemestre" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "UE",
      "nomSemestre",
      {
        type: Sequelize.INTEGER(1),
        field: "nomSemestre",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "semestre", key: "nomSemestre" },
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
