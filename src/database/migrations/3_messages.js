exports.up = function (knex) {
  return knex.schema.hasTable("messages").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("messages", function (table) {
        table.increments("ID").primary();
        table.string("name", 100).notNullable();
        table.string("lastName", 100).notNullable();
        table.string("email", 100).notNullable();
        table.text("detail", 255).notNullable();
        table
          .timestamp("sentAt")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema
    .hasTable("messages")
    .then(function (exists) {
      if (exists) return knex.schema.dropTable("messages");
    })
    .catch((err) => {
      console.log("messages-migration-error", err);
    })
    .finally(() => {
      knex.destroy();
    });
};
