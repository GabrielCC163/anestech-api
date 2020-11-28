const User = require("../models/User");

module.exports = {
  async index(req, res) {
    try {
      const users = await User.findAll();
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

  async store(req, res) {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ error: '"name" and "email" params are required' });
    }

    try {
      const user = await User.create({ name, email, role });

      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "failed to created user, try again with another email",
      });
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
    const { name, email, role } = req.body;

    if (role && role !== "AGENT" && role !== "ADMIN") {
      return res
        .status(400)
        .json({ error: 'the "role" field should be "AGENT" or "ADMIN"' });
    }

    try {
      const result = await User.update(
        { name, email, role },
        {
          where: {
            id: user_id,
          },
        }
      );

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
};
