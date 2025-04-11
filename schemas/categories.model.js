const sequelize = require("../config/db");

const { DataTypes } = require("sequelize");

const Categories = sequelize.define(
  "Categories",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);



module.exports = Categories;
