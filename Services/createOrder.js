const {connectToDB, closeDBConnection} = require("./database");
/**
    * @swagger
    * components:
    *   schemas:
    *     Order:
    *       type: object
    *       properties:
    *         item:
    *           type: string
    *           description: The item's name
    */

/**
    * @swagger
    * /api/createOrder:
    *   post:
    *     summary: Add an Order into the database
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/Order'
    *     responses:
    *       201:
    *         description: Order added successfully
    *       500:
    *         description: Unable to add order into database
    */

async function createOrder(req, res){
    // get the order information from the body
    orderinfo = req.body;
    console.log("Order information:", orderinfo);

    const db = await connectToDB();

    try {
        // find the last order id in the database
        const lastOrder = await db.collection('Orders')
        .find()
        .sort({OrderID: -1}) // sort orderID's in descending order
        .limit(1)
        .toArray();

        let newOrderID;

        if (lastOrder && lastOrder.length > 0){ // check that the order exists and has items
          const lastID = lastOrder[0].OrderID; 
          newOrderID = lastID + 1; // get the orderID and increment by one
        } else {
            newOrderID = 0; // start from zero if no orders exist
        }

        const orderWithID = {OrderID: newOrderID, ...orderinfo};

        // insert the new order
        const result = await db.collection('Orders').insertOne(orderWithID);

        res.status(201).json({
            message: 'Order inserted successfully',
            orderId: newOrderID
        });

    }catch(error){
        console.log('Error:', error);
        res.status(500).json({
            error: 'Error occured while inserting order'
        })
    }finally{
        await closeDBConnection();
    }
}

module.exports = createOrder;