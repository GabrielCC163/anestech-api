const { Model, DataTypes } = require("sequelize");

class Task extends Model {
  static init(sequelize) {
    super.init(
      {
        description: DataTypes.TEXT,
        status: DataTypes.STRING,
        started_at: DataTypes.DATE,
        ended_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "tasks",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

module.exports = Task;
