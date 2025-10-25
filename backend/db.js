import 'dotenv/config';
import mysql from 'mysql2/promise';


// Create a connection to the database
export const db = mysql.createPool({
  host: process.env.DB_HOST,     
  port: process.env.DB_PORT,
  user: process.env.DB_USER,  
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


async function testConnection() {
  try {
      const connection = await db.getConnection();
    console.log('Database connected!');
    connection.release();
  } catch (err) {
      console.error('DB connection error:', err.message);
  }
}