const express = require("express");
const parser = require("body-parser");

const path = require("path");
const signroute = require("./routes/signup.js");

const app = express();

app.use(parser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(signroute);

app.listen(5000);
