exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("jobs")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("jobs").insert([
        {
          jobName: "yazılım",
          jobDescription: "pc felan",
          applierCount: 3,
        },
        {
          jobName: "donanım",
          jobDescription: "klavye mause",
          applierCount: 2,
        },
        {
          jobName: "yönetici",
          jobDescription: "yöneten kişi",
          applierCount: 8,
        },
      ]);
    });
};
