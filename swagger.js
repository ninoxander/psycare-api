// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "PsyCare API",
            version: "1.8.0",
            description: "Documentación de la API de PsyCare",
        },
        servers: [
            {
                url: "https://psycare-api.onrender.com/", 
                description: "Producción",
            },
        ],
    },
    apis: ["./routes/*.js"], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
