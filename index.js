const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middleware

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", 'PATCH'],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kacof5g.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const collegeCollection = client.db("collegeBookingDB").collection("colleges");
    const admissionCollection = client.db("collegeBookingDB").collection("admission");

    // College API

    app.get('/colleges', async(req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result)
    });

    app.get('/colleges/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await collegeCollection.findOne(query);
      res.send(result);
    })

    // Admission API

    // app.get('/all-admission', async(req, res) => {
    //   const result = await admissionCollection.find().toArray();
    //   res.send(result)
    // });

    app.get('/admission', async(req, res)=>{
      let query = {}
      if(req.query?.email) {
        query = { email: req.query.email}
      }
      const result = await admissionCollection.find(query).toArray();
      res.send(result)
    })

    app.post('/admission', async(req, res)=>{
      const admission = req.body;
      const result = await admissionCollection.insertOne(admission);
      res.send(result);
    })

    app.delete('/admission/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await admissionCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("server is running");
  });
  
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });