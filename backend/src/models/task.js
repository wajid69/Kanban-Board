const { DataTypes } = require('sequelize')

// Define Task model
module.exports = (sequelize) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('todo','in-progress','done'),
      allowNull: false,
      defaultValue: 'todo'
    }
  }, {
    tableName: 'tasks',
    timestamps: true
  })
  return Task
}
