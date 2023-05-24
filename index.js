const express = require("express")
    , cors = require("cors")
    , router = require('./routes/router')
    , { MongoClient } = require("mongodb")
;
require('dotenv').config();

const API_PORT = process.env.PORT || 5050;
const URI = process.env.MONGODB_URI;

const CLIENT = new MongoClient(URI);
const API = express();

API.use(cors());
API.use(express.json());

API.use("/", router);

async function START_DB() {
    try {
        const DB_CLIENT = CLIENT.db('FANFT');
        const nft_collection = DB_CLIENT.collection('NFT');

        await nft_collection.createIndex({ NFT: -1 })
        await nft_collection.insertOne({ NFT: "NFT"});

        console.log(await nft_collection.find().project({ "_id": 0 }).toArray())
        console.log( (await nft_collection.countDocuments()).toFixed(0) );

    } finally {
        API.listen(API_PORT, () => {
            console.log(`Server is running on port: `, API_PORT);
        })
        /***/

        API.on('error', async (error) => {
            console.log("API ran into error: ", error);
            console.log("Closing MongoDB connection");

            CLIENT.close().then(() => {
                console.log('MongoDB connection closed!')
            });
        });
    }
}
START_DB().catch((ERROR) => {
    console.log('===== There was an error with START_DB: ===========\n'+ERROR+'\n===================================================')
});