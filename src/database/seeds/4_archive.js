exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("archive")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("archive").insert([
        {
          jobID: 4,
          userID: 2,
          status: 1,
        },
        {
          jobID: 1,
          userID: 1,
          status: 3,
        },
        {
          jobID: 1,
          userID: 2,
          status: 3,
        },
      ]);
    });
};
