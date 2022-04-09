exports.up = function (knex) {
  return knex.schema.hasTable("admin").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("admin", function (table) {
        table.increments("ID").primary().unsigned().index();
        table.string("name", 50).notNullable();
        table.string("lastName", 50).notNullable();
        table.string("email", 50).notNullable().unique();
        table.string("password", 50).notNullable();
        table
          .timestamp("joinedAt")
          .notNullable()
          .defaultTo(knex.raw("CURRENT_TIMESTAMP"));
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema
    .hasTable("admin")
    .then(function (exists) {
      if (exists) return knex.schema.dropTable("admin");
    })
    .catch((err) => {
      console.log("admin-migration-error", err);
    })
    .finally(() => {
      knex.destroy();
    });
};
