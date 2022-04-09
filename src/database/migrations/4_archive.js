exports.up = function (knex) {
    return knex.schema.hasTable("archive").then((exists) => {
      if (!exists) {
        return knex.schema.createTable("archive", function (table) {
          table.increments("ID").primary().unsigned().index();
          table.string("jobID", 50).notNullable();
          table.string("userID", 50).notNullable();
          table.integer("status").defaultTo(0).notNullable();
        });
      }
    });
  };
  
  exports.down = function (knex) {
    return knex.schema
      .hasTable("archive")
      .then(function (exists) {
        if (exists) return knex.schema.dropTable("archive");
      })
      .catch((err) => {
        console.log("archive-migration-error", err);
      })
      .finally(() => {
        knex.destroy();
      });
  };
  