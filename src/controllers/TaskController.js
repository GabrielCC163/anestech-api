const { Op } = require("sequelize");
const Task = require("../models/Task");
const User = require("../models/User");

// tasks (description, user, status (OPEN, IN_PROGRESS, DONE), started_at, ended_at, created_at)

//     crud
//         read filter: description, status[] = OK
//         read order: user, status, created_at
//     checkin
//     checkout

module.exports = {
  async index(req, res) {
    const { description, status, order } = req.query;

    const options = {};

    if (description) {
      options.description = {
        [Op.substring]: description,
      };
    }

    if (status) {
      if (status.includes(",")) {
        options.status = status.split(",").map((st) => st.trim());
      } else if (status.includes(";")) {
        options.status = status.split(";").map((st) => st.trim());
      } else {
        options.status = status;
      }
    }

    let orderOptions = [];

    if (order) {
      let orderValues = [];

      if (order.includes(",")) {
        orderValues = order.split(",").map((od) => od.trim());
      } else if (order.includes(";")) {
        orderValues = order.split(";").map((od) => od.trim());
      } else {
        const value = order.replace(/-/g, "").replace(/\+/g, "");
        if (order.includes("-")) {
          orderOptions.push([value, "DESC"]);
        } else {
          orderOptions.push([value]);
        }
      }

      if (orderValues.length) {
        orderValues.forEach((el) => {
          const value = el.replace(/-/g, "").replace(/\+/g, "");

          if (el.includes("-")) {
            orderOptions.push([value, "DESC"]);
          } else {
            orderOptions.push([value]);
          }
        });
      }
    }

    const orderUser = [];
    orderOptions.forEach((el) => {
      if (JSON.stringify(el).includes("user")) {
        orderUser.push(el);
      }
    });

    orderOptions = orderOptions.filter(
      (el) => !JSON.stringify(el).includes("user")
    );

    orderUser.forEach((el) => {
      const elementValue = el[0].split(".")[1].replace("'", "");
      const elementOrder = el[1] ? el[1] : "ASC";
      orderOptions.push([
        { model: User, as: "user" },
        elementValue,
        elementOrder,
      ]);
    });

    try {
      const tasks = await Task.findAll({
        attributes: { exclude: ["createdAt", "updatedAt", "user_id"] },
        where: options,
        include: [
          {
            association: "user",
            attributes: ["id", "name", "email"],
          },
        ],
        order: orderOptions,
      });

      return res.json(tasks);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "failed to fetch tasks" });
    }
  },

  async show(req, res) {
    const { task_id } = req.params;

    try {
      const task = await Task.findByPk(task_id);

      if (!task) {
        return res.status(404).json({ error: "task not found" });
      }

      return res.json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "failed to fetch task" });
    }
  },

  async store(req, res) {
    const { description } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ error: '"description" body param is required' });
    }

    try {
      const task = await Task.create({ description });

      return res.json(task);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "failed to created task",
      });
    }
  },

  async delete(req, res) {
    const { task_id } = req.params;

    try {
      const result = await Task.destroy({
        where: {
          id: task_id,
        },
      });

      return result
        ? res.send()
        : res.status(404).json({ error: "task not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "failed to remove task",
      });
    }
  },

  async update(req, res) {
    const { task_id } = req.params;
    const { description, status, user_id, started_at, ended_at } = req.body;

    try {
      const result = await Task.update(
        { description, status, user_id, started_at, ended_at },
        {
          where: {
            id: task_id,
          },
        }
      );

      return result[0]
        ? res.send()
        : res.status(404).json({ error: "task not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "failed to update task",
      });
    }
  },

  /**
   * Assign a user (must be logged in) to a task and starts it.
   * Can't start a task already ended or assigned to a user.
   */
  async checkin(req, res) {
    const { task_id } = req.params;

    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        error: "'user_id' body param is required.",
      });
    }

    try {
      const result = await Task.update(
        { user_id, started_at: new Date(), status: "IN_PROGRESS" },
        {
          where: {
            id: task_id,
            ended_at: {
              [Op.is]: null,
            },
            user_id: {
              [Op.is]: null,
            },
          },
        }
      );

      return result[0]
        ? res.send()
        : res.status(404).json({
            error: "task not found or already taken",
          });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "failed to check-in",
      });
    }
  },

  /**
   * Ends the user (logged in) task.
   * Can't end a task not yet started or without a user.
   */
  async checkout(req, res) {
    const { task_id } = req.params;

    const { user_id } = req.body;

    try {
      const result = await Task.update(
        { ended_at: new Date(), status: "DONE" },
        {
          where: {
            id: task_id,
            user_id,
            started_at: {
              [Op.not]: null,
            },
          },
        }
      );

      return result[0]
        ? res.send()
        : res.status(404).json({ error: "task not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "failed to check-in",
      });
    }
  },
};
