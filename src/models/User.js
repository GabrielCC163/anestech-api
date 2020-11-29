const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        role: DataTypes.ENUM("admin", "agent"),
        password: DataTypes.STRING,
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

  async comparePassword(candidatePassword, next) {
    try {
      let isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = User;
