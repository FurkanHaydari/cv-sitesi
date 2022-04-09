exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("messages")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("messages").insert([
        {
          name: "ffurkan",
          lastName: "baba",
          email: "furkan@gmail.com",
          detail: "askfamsdf",
        },
        {
          name: "ffurkan",
          lastName: "baba",
          email: "furkan@gmail.com",
          detail: "askfamsdf",
        },
        {
          name: "ffurkan",
          lastName: "baba",
          email: "furkan@gmail.com",
          detail: "askfamsdf",
        },
      ]);
    });
};
