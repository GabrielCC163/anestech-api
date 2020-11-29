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
      orderOptions.push([{ model: User, as: "User" }, ...el]);
    });

    try {
      const tasks = await Task.findAll({
        attributes: { exclude: ["id", "createdAt", "updatedAt", "user_id"] },
        where: options,
        order: orderOptions,
        include: [
          {
            association: "user",
            attributes: ["name", "email"],
          },
        ],
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
      return res.status(400).json({ error: '"description" param is required' });
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
    const { name, email, role } = req.body;

    if (role && role !== "AGENT" && role !== "ADMIN") {
      return res
        .status(400)
        .json({ error: 'the "role" field should be "AGENT" or "ADMIN"' });
    }

    try {
      const result = await Task.update(
        { name, email, role },
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
        error: 'failed to update task, try again with another "email"',
      });
    }
  },

  async checkin(req, res) {
    const { task_id } = req.params;

    const { user_id } = req.body;

    try {
      const result = await Task.update(
        { user_id },
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
        error: "failed to check-in",
      });
    }
  },
};
