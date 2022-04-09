exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("messages")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("messages").insert([
        {
          name: "furkan",
          lastName: "baba",
          email: "furkan@gmail.com",
          detail: "i bulamadım hala lütfen bana dönüş yapın",
        },
        {
          name: "furkan",
          lastName: "baba",
          email: "furkan@gmail.com",
          detail: "çok güzel bir siteniz var",
        },
        {
          name: "furkan",
          lastName: "baba",
          email: "furkan@gmail.com",
          detail: "Bu site çok bozdu",
        },
      ]);
    });
};
