'use strict';
module.exports = (sequelize, DataTypes) => {
  const subject = sequelize.define('subject', {
    UID: {
      primaryKey: true,
      unique: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: require("sequelize").UUIDV4
    },
    startTime_consent: DataTypes.DATE,
    endTime_consent: DataTypes.DATE,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    wantsConsentEmailed: DataTypes.BOOLEAN
  }, {});
  subject.associate = function (models) {
    subject.hasMany(models.trial);
    subject.hasOne(models.exitInterview)
    subject.hasMany(models.quiz)
  };
  return subject;
};