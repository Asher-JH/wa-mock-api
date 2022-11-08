const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const mockContacts = require("./contacts-mock-data.json");
const app = express();
const port = 3000;

app.use(
  bodyParser({
    extended: true,
  })
);

app.use(cors());

app.use(express.static(__dirname + "/public"));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname + "/pages/index.html"));
});

app.get("/api/health", (_req, res) => {
  res.send("Health ok!");
});

app.post("/api/getAllContactsInfo", (_req, res) => {
  const randStart = Math.floor(Math.random() * (99 - 1 + 1) + 1);
  const randEnd = Math.floor(Math.random() * (100 - randStart + 1) + randStart);

  const contacts = mockContacts.slice(randStart - 1, randEnd - 1);

  res.status(200).json(contacts);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
