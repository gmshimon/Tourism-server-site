const express = require('express');
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const orderCollection = database.collection("oders")
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

        //POST api the booking of a user
        app.post('/booking', async (req, res) => {
            const newBooking = req.body;
            const result = await orderCollection.insertOne(newBooking);
            res.send(result);
            console.log(result);
        })
        //GET api ,get all orders
        app.get('/booking', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //DELETE api, delete the order
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await orderCollection.deleteOne(query);
            console.log('deleted', result)
            res.json(result);
        })
        //PUT api, change the status
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const orderModify = req.body;
            const filter = {_id: ObjectId(id)}
            const updateDoc = {
                $set: {
                    status: orderModify.status,
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.json(result);
            console.log(orderModify);
        })



        //POST api to get the my-order of a user
        // app.post('/booking/email', async (req, res) => {
        //     const email = req.body;
        //     console.log('myorder', email);
        //     res.send('ya')
        // })
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