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
        {
          name: "emre",
          lastName: "mataracı",
          address: "ankara-çankaya-göl mah.",
          email: "afrknhddr@gmail.com",
          password: "123456",
        },
        {
          name: "mahmut",
          lastName: "demir",
          address: "diyarbakır-sur-yedigöller mah.",
          email: "frdknhydr@gmail.com",
          password: "123456",
        },
        {
          name: "berkay",
          lastName: "aslan",
          address: "izmir-buca-ataütrk mah.",
          email: "frkanhydr@gmail.com",
          password: "123456",
        },
      ]);
    });
};
