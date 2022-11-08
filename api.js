const express = require("express");
const bodyParser = require("body-parser");
const mockContacts = require("./contacts-mock-data.json");
const app = express();
const port = 3000;

app.use(
  bodyParser({
    extended: true,
  })
);
app.get("/api/health", (req, res) => {
  res.send("Health ok!");
});

app.post("/api/getAllContactsInfo", (req, res) => {
  console.log(req);
  const deviceNumber = req.body?.deviceNumber;

  if (!deviceNumber) {
    res.status(400).json("Missing device number");
    return;
  }

  const randStart = Math.floor(Math.random() * (99 - 1 + 1) + 1);
  const randEnd = Math.floor(Math.random() * (100 - randStart + 1) + randStart);

  const contacts = mockContacts.slice(randStart - 1, randEnd - 1);

  res.status(200).json({
    contacts,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
