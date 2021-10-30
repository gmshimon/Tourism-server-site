const express = require('express');
const {MongoClient} = require('mongodb');
const app = express();
var cors = require('cors')
app.use(cors()) //it is used to give access to load data from here
app.use(express.json())
require('dotenv').config();


const port = process.env.PORT || 5000;

const user = process.env.DB_user;
const password = process.env.DB_pass;

const uri = `mongodb+srv://${user}:${password}@cluster0.in8lp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

async function run() {
    try {
        await client.connect();
        const database = client.db("travelDB");
        const serviceCollection = database.collection("services");
        console.log('connect to service');

        //GET API
        app.get("/services", async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //POST api
        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await serviceCollection.insertOne(services);
            res.send(result)
            console.log(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('hello world');
})
app.listen(port, () => {
    console.log('listening on port ' + port);
})