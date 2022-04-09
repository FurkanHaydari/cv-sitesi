exports.up = function (knex) {
  return knex.schema.hasTable("jobs").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("jobs", function (table) {
        table.increments("job_ID").primary().unsigned().index();
        table.string("jobName", 50).notNullable();
        table.string("jobDescription", 50).notNullable();
        table.integer("applierCount").defaultTo(0).notNullable();
        table.tinyint("isActive").defaultTo(1).notNullable();
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema
    .hasTable("jobs")
    .then(function (exists) {
      if (exists) return knex.schema.dropTable("jobs");
    })
    .catch((err) => {
      console.log("jobs-migration-error", err);
    })
    .finally(() => {
      knex.destroy();
    });
};
