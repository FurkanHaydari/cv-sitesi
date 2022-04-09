exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("admin")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("admin").insert([
        {
          name: "admin",
          lastName: "godmode",
          email: "admin@gmail.com",
          password: "123456",
        },
      ]);
    });
};
