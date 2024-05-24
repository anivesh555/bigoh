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
    const createTripsTableQuery = `
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        childname VARCHAR(255),
        relation VARCHAR(100),
        departure_location VARCHAR(255),
        destination VARCHAR(255),
        date DATE,
        receiver VARCHAR(255),
        receiver_relation VARCHAR(100),
        receiver_phone_number VARCHAR(20),
        status VARCHAR(100),
        crew_id INTEGER REFERENCES users(id),
        user_id INTEGER REFERENCES users(id)
      );
    `;
    try{

      await pool.query(createTripsTableQuery);
      console.log('Trips table created successfully.');
      
    }catch(err){
      console.error('Error creating trips table:', err.message);
    }
    // const createCrewTableQuery = `
    //   CREATE TABLE IF NOT EXISTS crew (
    //     id SERIAL PRIMARY KEY,
    //     name VARCHAR(255),
    //     trip_id INTEGER REFERENCES trips(id),
    //     user_id INTEGER REFERENCES users(id),

    //   );
    // `;
    // try{

    //   await pool.query(createCrewTableQuery);
    //   console.log('Crew table created successfully.');
      
    // }catch(err){
      
    //   console.error('Error creating crew table:', err.message);

    // }


}
module.exports = createUsersTable