const express = require("express");
const UserController = require("./controllers/UserController");

const routes = express.Router();

routes.post("/users", UserController.store);
routes.get("/users", UserController.index);
routes.put("/users/:user_id", UserController.update);
routes.delete("/users/:user_id", UserController.delete);

module.exports = routes;
