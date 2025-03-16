const {connectToDB, closeDBConnection} = require("./database");
/**
    * @swagger
    * components:
    *   schemas:
    *     OrderID:
    *       type: object
    *       properties:
    *         OrderID:
    *           type: string
    *           description: The order's id
    */

/**
    * @swagger
    * /api/deleteOrder:
    *   delete:
    *     summary: Delete an order from the database
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/OrderID'
    *     responses:
    *       201:
    *         description: Order deleted successfully
    *       500:
    *         description: Unable to delete order from database
    */

async function deleteOrder(req, res){
    // get the order id from client and parse to integer
    const orderid = parseInt(req.body.OrderID);
    console.log("OrderID: ", orderid);

    try{
        const db = await connectToDB();

        // find document that has the given orderID and delete it 
        const result = await db.collection('Orders').deleteOne({OrderID: orderid});

        // check that the document was deleted
        if (result.deletedCount == 1){
            console.log("Document deleted");

            res.status(201).json({
                message: 'Order deleted successfully!'
            })
        }
    }catch(error){
        console.log('Error:', error);
        res.status(500).json({
            error: 'Error deleting order'
        })
    }finally{
        await closeDBConnection();
    }
}

module.exports = deleteOrder;