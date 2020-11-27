module.exports = {
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "123456",
  database: "task_management",
  define: {
    timestamps: true, //created_at, updated_at
    underscored: true,
  },
};
