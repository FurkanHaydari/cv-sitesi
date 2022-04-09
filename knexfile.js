require('dotenv').config();

module.exports = {
  development: {
    client: process.env.CLIENT,
    connection: {
      timezone: '+03:00',
      database: process.env.DATABASE,
      user: process.env.MYSQL_USER,
      //user: 'root',
      //password:process.env.PASSWORD,
      host: process.env.HOST,
      port: process.env.MYSQL_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + '/src/database/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: __dirname + '/src/database/seeds',
    },
  },

  staging: {
    client: process.env.CLIENT,
    connection: {
      database: process.env.DATABASE,
      user: process.env.USER,
      //password: PASSWORD,
      host: process.env.HOST,
      port: process.env.MYSQL_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: process.env.CLIENT,
    connection: {
      database: process.env.DATABASE,
      user: process.env.USER,
      // password: PASSWORD,
      host: process.env.HOST,
      port: process.env.MYSQL_PORT,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
