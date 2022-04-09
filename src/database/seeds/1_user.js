exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user").insert([
        {
          name: "furkan",
          lastName: "haydari",
          address: "istanbul-avcılar-kartal mah.",
          email: "frknhydr@gmail.com",
          password: "123456",
        },
      ]);
    });
};
