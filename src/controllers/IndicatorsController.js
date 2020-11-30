const { Op } = require("sequelize");
const Task = require("../models/Task");
const moment = require("moment");
require("moment-precise-range-plugin");

module.exports = {
  async qtCompletedTasks(req, res) {
    const { started_at, ended_at } = req.query;

    const whereOptions = {};
    if (started_at) {
      whereOptions.started_at = {
        [Op.gte]: started_at,
      };
    }

    if (ended_at) {
      whereOptions.ended_at = {
        [Op.lte]: ended_at,
      };
    }

    const result = await Task.count({
      where: {
        status: "DONE",
        ended_at: {
          [Op.not]: null,
        },
        ...whereOptions,
      },
    });

    return res.json(result);
  },

  async qtCompletedTasksByUser(req, res) {
    const { started_at, ended_at } = req.query;

    const whereOptions = {};
    if (started_at) {
      whereOptions.started_at = {
        [Op.gte]: started_at,
      };
    }

    if (ended_at) {
      whereOptions.ended_at = {
        [Op.lte]: ended_at,
      };
    }

    const tasks = await Task.count({
      attributes: {
        include: ["user_id"],
      },
      where: {
        status: "DONE",
        ended_at: {
          [Op.not]: null,
        },
        ...whereOptions,
      },
      group: ["user_id"],
    });

    return res.json(tasks);
  },

  async timeBetweenOpenAndInProgress(req, res) {
    const { started_at, ended_at } = req.query;

    const whereOptions = {};
    if (started_at) {
      whereOptions.started_at = {
        [Op.gte]: started_at,
      };
    }

    if (ended_at) {
      whereOptions.ended_at = {
        [Op.lte]: ended_at,
      };
    }

    const tasks = await Task.findAll({
      attributes: {
        include: ["description", "createdAt", "started_at"],
      },
      where: {
        started_at: {
          [Op.not]: null,
        },
        ...whereOptions,
      },
    });

    const result = [];
    tasks.forEach((task) => {
      result.push({
        description: task.description,
        createdAt: task.createdAt,
        started_at: task.started_at,
        timeOpenInProgress: moment.preciseDiff(
          task.createdAt,
          task.started_at,
          true
        ),
      });
    });

    return res.json(result);
  },

  async timeBetweenInProgressAndDone(req, res) {
    const { started_at, ended_at } = req.query;

    const whereOptions = {};
    if (started_at) {
      whereOptions.started_at = {
        [Op.gte]: started_at,
      };
    }

    if (ended_at) {
      whereOptions.ended_at = {
        [Op.lte]: ended_at,
      };
    }

    const tasks = await Task.findAll({
      attributes: {
        include: ["description", "createdAt", "started_at"],
      },
      where: {
        started_at: {
          [Op.not]: null,
        },
        ended_at: {
          [Op.not]: null,
        },
        status: "DONE",
        ...whereOptions,
      },
    });

    const result = [];
    tasks.forEach((task) => {
      result.push({
        description: task.description,
        createdAt: task.createdAt,
        started_at: task.started_at,
        timeOpenInProgress: moment.preciseDiff(
          task.started_at,
          task.ended_at,
          true
        ),
      });
    });

    return res.json(result);
  },
};
