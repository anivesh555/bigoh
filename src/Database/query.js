const pool = require('./db');

const executeQuery = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows;
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  } finally {
    client.release();
  }
};

const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const generateDynamicModel = (tableName, fields) => {
  const attributes = {};
  Object.keys(fields).forEach(key => {
    attributes[key] = {
      type: DataTypes.STRING, // Adjust type based on your needs
      allowNull: false
    };
  });

  return sequelize.define(tableName, attributes, {
    tableName,
    timestamps: false
  });
};

module.exports ={ generateDynamicModel, executeQuery}