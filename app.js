const express = require("express");

const path = require("path");

const app = express();

const signroute = require("./routes/signup.js");

app.use(express.static(path.join(__dirname, "public")));

app.use(signroute);

app.listen(5000);
