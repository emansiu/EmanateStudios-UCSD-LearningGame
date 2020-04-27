'use strict';
module.exports = (sequelize, DataTypes) => {
  const instructions = sequelize.define('instructions', {
    consent: DataTypes.BOOLEAN,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    demographic: DataTypes.STRING,
    timesQuizFailed: DataTypes.INTEGER
  }, {});
  instructions.associate = function(models) {
    // associations can be defined here
  };
  return instructions;
};