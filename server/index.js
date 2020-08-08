const express = require("express");
const bodyParser = require("body-parser");
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const utils = require("./utils/todo-schema.js");

const PORT = 8000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

let todos;

(async () => {
  console.log("CONNECTING TO DB...");
  todos = await require("./db/db.js");
  app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}/`);
  });
})();

app.get("/todos", async (req, res) => {
  res.send(await todos.find({}).toArray());
});

app.get("/todos/:id", async (req, res) => {
  res.send(await todos.findOne({ _id: ObjectID(req.params.id) }));
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

module.exports = app;
