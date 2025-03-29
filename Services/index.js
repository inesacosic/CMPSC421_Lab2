const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc')
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
/////////////////////////////////////////////////////////////
const {connectToDB, closeDBConnection} = require('./database')
const createOrder = require('./createOrder');
const deleteOrder = require('./deleteOrder');
const modifyOrder = require('./modifyOrder');
const deleteCustomer = require('./deleteCustomer');
const createCustomer = require('./createCustomer');
/////////////////////////////////////////////////////////////


app.use(bodyParser.json());

   // Swagger definition
   const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
   components: {
     securitySchemes: {
         bearerAuth: {
             type: 'http',
             scheme: 'bearer',
             bearerFormat: 'JWT', 
         },
     },
 },
    },
    apis: ['./Services/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


// Routes
app.post('/api/createcustomer', createCustomer);
app.post('/api/createOrder', createOrder);
app.delete('/api/deleteOrder', deleteOrder);
app.put('/api/modifyOrder', modifyOrder);
app.delete('/api/deleteCustomer', deleteCustomer);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
  });