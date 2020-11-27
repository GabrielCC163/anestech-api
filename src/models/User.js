const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        role: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "users",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Task, { foreignKey: "user_id", as: "tasks" });
  }
}

module.exports = User;
