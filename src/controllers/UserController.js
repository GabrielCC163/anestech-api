const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });
      return res.json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "failed to fetch users" });
    }
  },

  async show(req, res) {
    const { user_id } = req.params;
    try {
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }

      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "failed to fetch user" });
    }
  },

  async delete(req, res) {
    const { user_id } = req.params;

    try {
      const result = await User.destroy({
        where: {
          id: user_id,
        },
      });

      return result
        ? res.send()
        : res.status(404).json({ error: "user not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "failed to remove user",
      });
    }
  },

  async update(req, res) {
    const { user_id } = req.params;
    const { name, email, role, password } = req.body;

    if (!name && !email && !role && !password) {
      return res.status(400).json({
        message:
          "No body data passed. Try 'name', 'email', 'role' or 'password'",
      });
    }

    if (role && role !== "AGENT" && role !== "ADMIN") {
      return res
        .status(400)
        .json({ error: 'the "role" field should be "AGENT" or "ADMIN"' });
    }

    try {
      let result = await User.update(
        { name, email, role },
        {
          where: {
            id: user_id,
          },
        }
      );

      if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        result = await User.update(
          { password: passwordHash },
          {
            where: {
              id: user_id,
            },
          }
        );
      }

      return result[0]
        ? res.send()
        : res.status(404).json({ error: "user not found" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'failed to update user, try again with another "email"',
      });
    }
  },

  async userTasks(req, res) {
    const { user_id } = req.params;
    try {
      const tasks = await Task.findAll({
        where: {
          user_id,
        },
        order: ["createdAt"],
      });

      return res.json(tasks);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "failed to fetch user tasks",
      });
    }
  },
};
