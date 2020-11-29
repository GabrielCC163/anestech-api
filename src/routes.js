const express = require("express");

const UserController = require("./controllers/UserController");
const TaskController = require("./controllers/TaskController");
const SessionController = require("./controllers/SessionController");

const {
  loginRequired,
  ensureUserAdmin,
  ensureCorrectUser,
} = require("./middleware/auth");

const routes = express.Router();

routes.get("/users", loginRequired, ensureUserAdmin, UserController.index);
routes.get(
  "/users/:user_id",
  loginRequired,
  ensureUserAdmin,
  UserController.show
);
routes.get("/users/:user_id/tasks", UserController.userTasks);
routes.put(
  "/users/:user_id",
  loginRequired,
  ensureUserAdmin,
  UserController.update
);
routes.delete(
  "/users/:user_id",
  loginRequired,
  ensureUserAdmin,
  UserController.delete
);

routes.post("/tasks", loginRequired, TaskController.store);
routes.get("/tasks/:task_id", loginRequired, TaskController.show);
routes.get("/tasks", loginRequired, TaskController.index);
routes.delete(
  "/tasks/:task_id",
  loginRequired,
  ensureUserAdmin,
  TaskController.delete
);

routes.patch(
  "/tasks/:task_id/checkin",
  loginRequired,
  ensureCorrectUser,
  TaskController.checkin
);
routes.patch(
  "/tasks/:task_id/checkout",
  loginRequired,
  ensureCorrectUser,
  TaskController.checkout
);

routes.post("/signup", SessionController.signup);
routes.post("/signin", SessionController.signin);

module.exports = routes;
