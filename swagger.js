require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();
const { PORT, NODE_ENV } = process.env;

// Tentukan URL server berdasarkan lingkungan

const serverUrl =
  NODE_ENV === "stagging"
    ? "http://188.166.239.112:5439"
    : `http://localhost:${PORT}`;

const doc = {
  info: {
    title: "Test Tools WEB-UI API",
    description: "Test Tools WEB-UI API Documentation",
  },
  servers: [
    {
      url: serverUrl,
      description: NODE_ENV === "stagging" ? "Live Server" : "Local Server",
    },
  ],
  host: "",
};

const outputFile = "./swagger-output.json";
const routes = ["./app.js"];

swaggerAutogen(outputFile, routes, doc);
