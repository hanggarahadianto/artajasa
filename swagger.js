require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Test Tools WEB-UI API",
    description: "Test Tools WEB-UI API Documentation",
  },
  host: `localhost:${process.env.PORT}`,
};

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

swaggerAutogen(outputFile, routes, doc);
