const pool= require("./db")

const createUsersTable = async () => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        roles VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      );
    `;
    try {

      await pool.query(createTableQuery);

      console.log('Users table created (if not exist)');
    } catch (error) {
      console.log("erroro")
      console.error('Error creating users table:', error.message);
    }

}
module.exports = createUsersTable