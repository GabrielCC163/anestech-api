const express = require("express");

const UserController = require("./controllers/UserController");
const TaskController = require("./controllers/TaskController");

const routes = express.Router();

routes.post("/users", UserController.store);
routes.get("/users/:user_id", UserController.show);
routes.get("/users", UserController.index);
routes.put("/users/:user_id", UserController.update);
routes.delete("/users/:user_id", UserController.delete);

routes.post("/tasks", TaskController.store);
routes.get("/tasks/:task_id", TaskController.show);
routes.get("/tasks", TaskController.index);
routes.delete("/tasks/:task_id", TaskController.delete);

routes.patch("/tasks/:task_id/checkin", TaskController.checkin);

module.exports = routes;
