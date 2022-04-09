const knex = require("knex").default;
const p = require("../../knexfile.js");

module.exports = knex({
  client: p.development.client,
  connection: p.development.connection,
});
