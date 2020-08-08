const mongo = require("mongodb");

let todos;

module.exports = (async function connect() {
  const url = "mongodb://localhost:27017";
  const connection = await mongo.connect(url, { useUnifiedTopology: true });
  const db = connection.db("mydb");
  todos = db.collection("todos");
  return todos;
})();
