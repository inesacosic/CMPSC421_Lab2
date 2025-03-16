const {connectToDB, closeDBConnection} = require('./database');
/**
    * @swagger
    * components:
    *   schemas:
    *     Customer:
    *       type: object
    *       properties:
    *         FirstName:
    *           type: string
    *           description: The customer's name
    *         LastName:
    *           type: string
    *           description: The customer's age
    */

/**
    * @swagger
    * /api/createCustomer:
    *   post:
    *     summary: Add a customer into the database
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/Customer'
    *     responses:
    *       201:
    *         description: Customer added successfully
    *       500:
    *         description: Unable to add customer into database
    */

async function createCustomer(req, res) {
    // get customer data from the request
    const customerinfo = req.body;
    // log data for debugging
    console.log("Customer info:", customerinfo);

    try{
        const db = await connectToDB();

        // find the last order id in the database
       const lastCustomer = await db.collection('CustomerInfo')
       .find()
       .sort({CustomerID: -1}) // sort orderID's in descending order
       .limit(1)
       .toArray();

       let newCustomerID;

       if (lastCustomer && lastCustomer.length > 0){ // check that the order exists and has items
         const lastID = lastCustomer[0].CustomerID; 
         console.log(lastID);
         newCustomerID = lastID + 1; // get the orderID and increment by one
       } else {
           newCustomerID = 0; // start from zero if no orders exist
       }

       const CustomerWithID = {CustomerID: newCustomerID, ...customerinfo};


        const result = await db.collection('CustomerInfo').insertOne(CustomerWithID);

        res.status(201).json({
            message: 'Customer inserted successfully',

        })
    }catch(error){
        console.log('Error: ', error);
        res.status(500).json({
            error: 'Error inserting customer'
        })
    }finally{
        // close database connection
        await closeDBConnection();
    }

}

module.exports = createCustomer;