require("dotenv").config({ path: ".env" });
// console.log(process.env);
const knexOptions = {
  client: process.env.CLIENT,
  connection: {
    host: process.env.HOST,
    // port: process.env.PORT,
    user: process.env.USERNAME,
    // password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  pool: {
    min: 2,
    max: 10,
  },
};

module.exports = knexOptions;
