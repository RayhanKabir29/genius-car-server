const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywgrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("carMechanics");
        const servicesCollection = database.collection("services");
        
        //Get API
        app.get('/services', async(req,res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //Get single Service
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API
        app.post('/services',async(req, res)=>{
            const service = req.body;
            console.log("hit the post API", service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //Delete API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const service = await servicesCollection.deleteOne(query);
            
            res.json(service);
        })
    }
    finally{
        
    }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send("I am from Node");
});

app.listen(port, ()=>{
    console.log("Listeing From",port)
});