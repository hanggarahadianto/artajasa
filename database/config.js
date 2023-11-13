require("dotenv").config();
// const {
//   DB_USER,
//   DB_PASSWORD,
//   DB_DATABASE,
//   DB_HOST,
//   DB_PORT,
//   DB_DIALECT = 'postgres',
// } = process.env;

module.exports = {
  development: {
    username: "devartajasa",
    password: "Artajasa@2",
    database: "tsg_artajasa_testool",
    host: "188.166.239.112",
    port: 5435,
    dialect: "postgres",
  },
  // development: {
  //   username: "postgres",
  //   password: "12345678",
  //   database: "artajasaTSG",
  //   host: "localhost",
  //   port: 5432,
  //   dialect: "postgres",
  // },
  // development: {
  //   username: DB_USER,
  //   password: DB_PASSWORD,
  //   database: DB_DATABASE,
  //   host: DB_HOST,
  //   port: DB_PORT,
  //   dialect: DB_DIALECT,
  // },
  // test: {
  //   username: DB_USER,
  //   password: DB_PASSWORD,
  //   database: DB_DATABASE,
  //   host: DB_HOST,
  //   port: DB_PORT,
  //   dialect: DB_DIALECT,
  // },
  // production: {
  //   username: DB_USER,
  //   password: DB_PASSWORD,
  //   database: DB_DATABASE,
  //   host: DB_HOST,
  //   port: DB_PORT,
  //   dialect: DB_DIALECT,
  // },
};
