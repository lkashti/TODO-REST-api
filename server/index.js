const express = require("express");
const fs = require("fs").promises;
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const mongo = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const utils = require("./utils/todo-schema.js");
const PORT = 8000;

const app = express();
app.use(bodyParser.json());
app.use(cors());

let todos = null;

(async () => {
  try {
    const url = "mongodb://localhost:27017";
    const connection = await mongo.connect(url, { useUnifiedTopology: true });
    const db = connection.db("mydb");
    todos = db.collection("todos");
  } catch (e) {
    console.log("error:", e);
  }
})();

app.get("/todos", async (req, res) => {
  res.send(await todos.find({}).toArray());
});

app.get("/todos/:id", async (req, res) => {
  res.send(await todos.findOne({ _id: +req.params.id }));
});

app.post("/todos", async (req, res) => {
  const { error } = utils.validateTodo(req.body);
  if (error) return res.status(400).send(error.message);
  todos.insertMany([req.body]);
  res.send(await todos.find({}).toArray());
});

app.put("/todos/:id", async (req, res) => {
  const { title, completed } = req.body;
  const { error } = utils.validateTodo(req.body);
  if (error) return res.status(400).send(error.message);
  try {
    await todos.updateOne(
      { _id: ObjectID(req.params.id) },
      { $set: { title, completed } }
    );

    res.status(200).json("ok");
  } catch (e) {
    res.status(500).json("failed");
    console.log(e);
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    await todos.deleteOne({ _id: ObjectID(req.params.id) });
    res.status(200).json(req.body.params);
  } catch (e) {
    console.log(e);
  }
});
//---Route tests---
app.get("/testGet", async (req, res) => {
  const fetchResp = await fetch("http://localhost:8000/todos");
  const json = await fetchResp.json();
  res.send(json);
});

app.get("/testPost", async (req, res) => {
  try {
    const fetchResp = await fetch("http://localhost:8000/todos", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "checkPost",
        completed: false,
      }),
    });
    const json = await fetchResp.json();
    res.send(json);
  } catch (e) {
    res.send(e);
  }
});
//-----------------
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/todos`);
});
