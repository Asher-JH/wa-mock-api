const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const mockContacts = require("./contacts-mock-data.json");
const app = express();
const port = 3000;

//Get the raw body
app.use(
  bodyParser.json({
    verify: (req, _res, buf) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString("utf-8");
      }
    },
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

app.post("/api/generateSignature", (req, res) => {
  const { secret, ...data } = req.body;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(
    hmac.update(JSON.stringify(data)).digest("hex"),
    "utf8"
  );

  res.status(200).json(digest.toString("utf-8"));
});

app.post("/api/getAllContactsInfo", (req, res) => {
  const signature = req.headers["x-signature-sha256"];
  if (!signature || typeof signature !== "string") {
    throw new Error("You do not have access");
  }

  const sig = Buffer.from(signature, "utf-8");
  const hmac = crypto.createHmac("sha256", "burrito-chimichanga");
  const buffer = Buffer.from(hmac.update(req.rawBody).digest("hex"), "utf-8");

  if (sig.length !== buffer.length || !crypto.timingSafeEqual(buffer, sig)) {
    throw new Error(`Invalid signature`);
  }

  const randStart = Math.floor(Math.random() * (499 - 1 + 1) + 1);
  const randEnd = Math.floor(Math.random() * (500 - randStart + 1) + randStart);

  const contacts = mockContacts.slice(randStart - 1, randEnd - 1);

  res.status(200).json(contacts);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
