const {connectToDB, closeDBConnection} = require("./database");
/**
    * @swagger
    * components:
    *   schemas:
    *     Order:
    *       type: object
    *       properties:
    *         OrderID:
    *           type: string
    *           description: The order's id
    *         item:
    *           type: string
    *           description: The item on the order
    */

/**
    * @swagger
    * /api/modifyOrder:
    *   put:
    *     summary: Modify an order in the database
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/Order'
    *     responses:
    *       201:
    *         description: Order deleted successfully
    *       404:
    *         description: Could not find an order in the database that matched to given OrderID
    *       500:
    *         description: Unable to delete order from database
    */

async function modifyOrder(req, res){
    // get modified order information from request body
    const modOrder = req.body;
    console.log("Order info: ", modOrder);

    try{
        const db = await connectToDB();

        // query the database to find the document with given order id
        const queryOrder = db.collection('Orders').findOne({OrderID: parseInt(modOrder.OrderID)})

        // create document with updated values
        const updatedOrder = {
            $set:
                {
                    OrderID: modOrder.OrderID,
                    item: modOrder.item
                }
        }

        // update the document in the database
        const result = await db.collection('Orders').updateOne(queryOrder, updatedOrder);

        // check that document was found and updated
        if (result.matchedCount == 1 && result.modifiedCount == 1){
            res.status(200).json({
                message: 'Order updated successfully'
            });
        }else if(result.matchedCount == 0){
            res.status(404).json({
                error: 'No order found'
            });

        }
    }catch(error){

        console.log("Error:", error);
        res.status(500).json({
            error: 'Error updating order'
        });

    }finally{

        await closeDBConnection();
    }

}

module.exports = modifyOrder;