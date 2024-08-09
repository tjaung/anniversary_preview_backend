const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = process.env.MONGO_URI || dotenv.config().parsed.MONGO_URI;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("anniversary");
    const coll = db.collection("message");
    coll.createIndex({ timestamp_ms: 1 });
    // messages
    const docs1 =
      require("./db/chatHistory/tia_488774792515763/message_1.json").messages;
    // const docs2 =
    //   require("./db/chatHistory/sith_1102845581118362/message_2.json").messages;
    // const docs = docs1.concat(docs2);

    // const fbDocs =
    //   require("./db/sithyalach_6649733418379624/message_1.json").messages;

    docs1.forEach((ele, ind) => {
      ele["user_ids"] = ["66b67ca492fa502f1d93a1b8"];
      // ele["source"] = "messenger";
    });

    console.log(docs1.messages);
    const result = await coll.insertMany(docs1);

    // display the results of your operation
    console.log(result.insertedIds);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
