import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const tables = ['team', 'logistics_head', 'financial_head', 'technical_head','fia_admin'];

export async function verifyUser(username: string, password: string): Promise<{ success: boolean; message: string; userType?: string }> {
  for (const table of tables) {
    try {
      const query = `SELECT * FROM ${table} WHERE username = $1`;
      const result = await pool.query(query, [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        // const passwordMatch = await bcrypt.compare(password, user.password);
        // if (passwordMatch) {
        //   return { success: true, message: 'Login successful', userType: table };
        // }
        if(user.password.trim() === password.trim()){
          return { success: true, message: 'Login successful', userType: table };
        }
        // await pool.end();
      }
    } catch (error) {
      console.error(`Error querying ${table}:`, error);
      await pool.end();
    }
  }

  return { success: false, message: 'Invalid username or password' };
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 1;
  return bcrypt.hash(password, saltRounds);
}
