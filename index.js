const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.uoombu0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("SKDIS_Health");
const usersColletions = database.collection("users");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    //conections
    app.get("/users", async (req, res) => {
      const result = await usersColletions.find().toArray();

      res.send(result);
    });

    app.post("/adduser", async (req, res) => {
      const body = req.body;
      const result = await usersColletions.insertOne(body);
    });

    app.patch("/updateuser/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      // console.log(user);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      };

      const result = await usersColletions.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    app.delete("/userdelete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersColletions.deleteOne(query);

      res.send(result)
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//connection texting
app.get("/", (req, res) => {
  res.send("welcome");
});

app.listen(port, () => {
  console.log("example app listening on port", port);
});
