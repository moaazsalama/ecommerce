const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const cartRouter = require('./routes/cart-router');

const app = express();
const authMiddleware = require('./middleware/auth');
const apiPort = 5003;
// swagger docs
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

//config swagger
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cart API',
            version: '1.0.0',
            description: 'A simple Express Library API'
        },
        servers: [
            {
                url: 'http://localhost:5003'
            }
        ],
        apis: ['./routes/*.js']

    },
    apis: ['./routes/*.js']
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/api', authMiddleware, cartRouter);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));