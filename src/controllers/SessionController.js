const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

module.exports = {
  //register a user
  async signup(req, res) {
    try {
      const { name, email, role, password } = req.body;

      if (!name || !email || !role || !password) {
        return res.status(400).json({
          error: '"name", "email", "role" and "password" params are required',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const { id } = await User.create({
        name,
        email,
        role,
        password: passwordHash,
      });

      let token = jwt.sign(
        {
          id,
          email,
        },
        process.env.SECRET_KEY
      );

      return res.status(200).json({
        id,
        name,
        email,
        role,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error:
          "failed to created user, try again with another email. Role must be 'admin' or 'agent'.",
      });
    }
  },

  //login
  async signin(req, res) {
    try {
      const { email, password } = req.body;

      let userObj = await User.findOne({
        email,
      });

      let { id } = userObj;
      let isMatch = await userObj.comparePassword(password);

      if (isMatch) {
        let token = jwt.sign(
          {
            id,
            email,
          },
          process.env.SECRET_KEY
        );

        return res.status(200).json({
          id,
          email,
          token,
        });
      } else {
        return res.status(400).json({
          error: "Invalid email or password.",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Failed to sign in",
      });
    }
  },
};
