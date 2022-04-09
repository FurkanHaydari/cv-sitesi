exports.up = function (knex) {
  return knex.schema.hasTable("user").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("user", function (table) {
        table.increments("ID").primary().unsigned().index();
        table.string("name", 50).notNullable();
        table.string("lastName", 50).notNullable();
        table.string("email", 50).notNullable().unique();
        table.string("password", 50).notNullable();

        table.string("address", 50);
        table.integer("phone").defaultTo(0);
        table.string("current_job", 50);
        table.specificType("cv", "mediumblob").defaultTo(null);
        table.specificType("photo", "mediumblob").defaultTo(null);
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
    .hasTable("user")
    .then(function (exists) {
      if (exists) return knex.schema.dropTable("user");
    })
    .catch((err) => {
      console.log("user-migration-error", err);
    })
    .finally(() => {
      knex.destroy();
    });
};
