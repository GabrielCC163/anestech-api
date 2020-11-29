const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const bodyParser = require("body-parser");

require("./database");

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3333;
app.listen(port);
