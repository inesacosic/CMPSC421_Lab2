const {connectToDB, closeDBConnection} = require('./database');
/**
    * @swagger
    * components:
    *   schemas:
    *     CustomerID:
    *       type: object
    *       properties:
    *         CustomerID:
    *           type: string
    *           description: The customer's ID
    */

/**
    * @swagger
    * /api/deleteCustomer:
    *   delete:
    *     summary: Delete a customer from the database
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/CustomerID'
    *     responses:
    *       200:
    *         description: Customer deleted successfully
    *       500:
    *         description: Unable to delete customer from database
    */

async function deleteCustomer(req, res){
    // get the customer's id from client
    const customerid = parseInt(req.body.CustomerID);
    console.log('Customer ID: ', customerid);

    try{
        const db = await connectToDB();
        
        //find the document with matching customer id and delete it
        const result = await db.collection('CustomerInfo').deleteOne({CustomerID: customerid});
        console.log(result);

        //check that the document was deleted
        if (result.deletedCount == 1){
            res.status(200).json({
                message: 'Customer deleted successfully'
            })
        }
    }catch(error){
        console.log("Error: ", error)
        res.status(500).json({
            error: 'Error deleted customer'
        })
    }finally{
        await closeDBConnection();
    }
}

module.exports = deleteCustomer;