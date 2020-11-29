require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  //ensure the user is logged in with the valid token
  loginRequired(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1]; //Bearer kasjndkjasndakjsdnas
      jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        if (decoded) {
          return next();
        } else {
          return res.status(401).json({
            message: "User not authenticated.",
          });
        }
      });
    } catch (err) {
      return res.status(401).json({
        error: "User not found.",
      });
    }
  },

  //ensure that users cannot check-in / check-out in a task for another user
  ensureCorrectUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
        console.log(decoded.id);
        console.log(req.body.user_id);
        if (decoded && String(decoded.id) === req.body.user_id) {
          return next();
        } else {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }
      });
    } catch (err) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
  },

  ensureUserAdmin(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRET_KEY, async function (err, decoded) {
        if (decoded && decoded.id) {
          const { role } = await User.findByPk(decoded.id, {
            attributes: {
              include: ["role"],
            },
          });
          if (role === "admin") {
            return next();
          } else {
            return res.status(401).json({
              message: "Unauthorized. User is not a admin.",
            });
          }
        }
      });
    } catch (err) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
  },
};
