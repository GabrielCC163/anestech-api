const express = require("express");

const UserController = require("./controllers/UserController");
const TaskController = require("./controllers/TaskController");
const SessionController = require("./controllers/SessionController");

const {
  loginRequired,
  ensureUserAdmin,
  ensureCorrectUser,
} = require("./middleware/auth");
const IndicatorsController = require("./controllers/IndicatorsController");

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
routes.put("/tasks/:task_id", loginRequired, TaskController.update);
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

routes.get(
  "/indicators/qt-completed-tasks",
  loginRequired,
  ensureUserAdmin,
  IndicatorsController.qtCompletedTasks
);

routes.get(
  "/indicators/qt-completed-tasks-by-user",
  loginRequired,
  ensureUserAdmin,
  IndicatorsController.qtCompletedTasksByUser
);

routes.get(
  "/indicators/time-between-open-inprogress",
  loginRequired,
  ensureUserAdmin,
  IndicatorsController.timeBetweenOpenAndInProgress
);

routes.get(
  "/indicators/time-between-inprogress-done",
  loginRequired,
  ensureUserAdmin,
  IndicatorsController.timeBetweenInProgressAndDone
);

module.exports = routes;
