
const { DataTypes } = require('sequelize');
const sequelize = require('./../Database/db');

function generateCreateTableQuery(tableName, fields) {
    console.log(tableName, fields,"==>")
    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

    // Iterate over each field and add it to the query
    for (const fieldName in fields) {
        const fieldType = fields[fieldName];
        let sqlType;
        switch (fieldType) {
            case 'uuid':
                sqlType = 'UUID';
                break;
            case 'string':
                sqlType = 'VARCHAR';
                break;
            case 'email':
                sqlType = 'VARCHAR CHECK (' + fieldName + " ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')";
                break;
            case 'number':
                sqlType = 'NUMERIC';
                break;
            case 'boolean':
                sqlType = 'BOOLEAN';
                break;
            default:
                throw new Error(`Unsupported field type: ${fieldType}`);
        }
        query += `${fieldName} ${sqlType}, `;
    }

    // Add primary key constraint
    query += `PRIMARY KEY (uniqueId));`;

    return query;
}
function validateFormData(data) {
    const { uniqueId, name, email, phoneNumber, isGraduate } = data;

    if (!uniqueId || !name || !email || !phoneNumber || isGraduate === undefined) {
        return { valid: false, message: 'All fields are required' };
    }

    if (typeof uniqueId !== 'string' || !/^[0-9a-fA-F-]{36}$/.test(uniqueId)) {
        return { valid: false, message: 'Invalid UUID' };
    }

    if (typeof name !== 'string') {
        return { valid: false, message: 'Name must be a string' };
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email' };
    }
    if (typeof phoneNumber != 'number' || !/^\d+$/.test(phoneNumber)) {
        console.log(typeof phoneNumber ,'===')
        return { valid: false, message: 'Phone number must be numeric' };
    }

    if (typeof isGraduate !== 'boolean') {
        return { valid: false, message: 'isGraduate must be boolean' };
    }

    return { valid: true };
}


const generateDynamicModel = (tableName, fields) => {
  const attributes = {};

  Object.keys(fields).forEach(fieldName => {
    const fieldType = fields[fieldName];
    let sequelizeType;

    switch (fieldType) {
      case 'uuid':
        sequelizeType = DataTypes.UUID;
        break;
      case 'string':
        sequelizeType = DataTypes.STRING;
        break;
      case 'email':
        sequelizeType = DataTypes.STRING; // Add validation in model options below
        break;
      case 'number':
        sequelizeType = DataTypes.NUMERIC;
        break;
      case 'boolean':
        sequelizeType = DataTypes.BOOLEAN;
        break;
      default:
        throw new Error(`Unsupported field type: ${fieldType}`);
    }

    attributes[fieldName] = {
      type: sequelizeType,
      allowNull: false
    };

    // Add additional validation for email
    if (fieldType === 'email') {
      attributes[fieldName].validate = {
        isEmail: true
      };
    }
  });

  // Add primary key constraint for uniqueId
  attributes.uniqueId = {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  };

  return sequelize.define(tableName, attributes, {
    tableName,
    timestamps: false
  });
};

const checkTableExists = async (tableName) => {
  try {
    console.log("-1first")
    await sequelize.queryInterface.describeTable(tableName);
    console.log("first")
    return true;
  } catch (err) {
    return false
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeUnknownTableError') {
      console.log(err.name,"===")
      return false;
    }
    throw err;
  }
};

module.exports = {generateCreateTableQuery,validateFormData,generateDynamicModel,checkTableExists}