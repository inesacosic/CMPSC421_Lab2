const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const {connectToDB, closeDBConnection} = require('./database')

//app.use(bodyParser.json)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

async function createCustomer(req, res) {
     // get customer data from the request
     const customerinfo = req.body;
     // log data for debugging
     console.log("Customer info:", customerinfo);
     res.end()
     try{
         const db = await connectToDB();
 
         const result = await db.collection('CustomerInfo').insertOne(...customerinfo);
 
         res.end(201).json({
             message: 'Customer inserted successfully',
 
         })
     }catch(error){
         console.log('Error: ', error);
         res.end(500).json({
             error: 'Error inserting customer'
         })
     }finally{
         // close database connection
         await closeDBConnection();
     }
 
}
// Routes
app.put('/api/createcustomer', createCustomer);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the API');
  });