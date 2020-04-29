'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    number: DataTypes.INTEGER,
    initials: DataTypes.STRING,
    consent: DataTypes.BOOLEAN,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    demographic: DataTypes.STRING,
    timesQuizFailed: DataTypes.INTEGER
  }, {});
  Subject.associate = function (models) {
    Subject.hasMany(models.Trial);
    Subject.hasOne(models.exitInterview)
  };
  return Subject;
};