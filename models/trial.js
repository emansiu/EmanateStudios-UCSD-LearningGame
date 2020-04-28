'use strict';
module.exports = (sequelize, DataTypes) => {
  const trial = sequelize.define('trial', {
    trial: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    condition: DataTypes.INTEGER,
    cursorX_exitOccluder: DataTypes.FLOAT,
    cursorY_exitOccluder: DataTypes.FLOAT,
    cursorX_enterOccluder: DataTypes.FLOAT,
    cursorY_enterOccluder: DataTypes.FLOAT,
    success: DataTypes.INTEGER,
    bg_color: DataTypes.STRING,
    eye_size: DataTypes.INTEGER,
    eye_color: DataTypes.STRING,
    mouth_w: DataTypes.INTEGER,
    mouth_h: DataTypes.INTEGER,
    horns_w: DataTypes.INTEGER,
    horns_h: DataTypes.INTEGER
  }, {});
  trial.associate = function (models) {
    trial.belongsTo(models.Subject)
  };
  return trial;
};