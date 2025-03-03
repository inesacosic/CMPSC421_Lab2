const {MongoClient, ServerApiVersion} = require('mongodb');
const uri = "mongodb+srv://ixc5135:Zouaves15*@orderingsystem.ze7pt.mongodb.net/?retryWrites=true&w=majority&appName=OrderingSystem";
//initialize client variable
let client;

// create function to connect to database 
async function connectToDB(){
    if (!client){
        client = new MongoClient(uri);
    }

    try{
        await client.connect();
        console.log("Connected to database!")
        //return the database instance 
        return client.db("OrderingSystem");
    }catch(error){
        console.log("Error: ", error);
        throw error;
    }
}

// create function to close database connection
async function closeDBConnection(){
    if (client){
        try{
            await client.close();
            console.log("Database connection closed.");
        }catch(error){
            console.log("Error closing the database connection:", error);
        }
    }
}

module.exports = {connectToDB, closeDBConnection}
