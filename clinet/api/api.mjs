import express from 'express';
import mongodb from "mongodb";
import dotenv from 'dotenv'

dotenv.config()

const { MongoClient, ServerApiVersion } = mongodb;
const router = express.Router();

const uri = process.env.dataKey;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

        await client.connect();
        console.log("Connected to MongoDB!");

            const db = client.db("PLAYERS"); 
    const playersCollection = db.collection("players")


 router.get('/all', async (req, res) => {
         const db = client.db('PLAYERS');  // Replace 'your-database-name' with the name of your database
        const collection = db.collection('players');  // Replace 'your-collection-name' with the name of your collection
       	const data = await collection.find({}).toArray();
        res.json(data);
        });

// app.get('/test', (req, res) => {
// });

router.get("/test", async (req, res) => {
  let collection = await db.collection("players");
  let results = await collection.aggregate([
    {"$project": {"name": 1, "playerSrc": 1}},
    {"$sort": {"date": -1}},
    {"$limit": 1}
  ]).toArray();
     res.render('main', {results});
});

router.get("/all", async (req, res) => {
  let collection = await db.collection("players");
  let results = await collection.aggregate([
    {"$project": {"name": 1, "playerSrc": 1}},
    {"$sort": {"date": -1}},
    {"$limit": 10}
  ]).toArray();
     res.json(results);
});

export default router;
