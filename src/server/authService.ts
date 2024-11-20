import { Pool, PoolClient } from 'pg';

const tables = ['team', 'logistics_head', 'financial_head', 'technical_head', 'fia_admin'];

async function createDbConnection(username: string, password: string): Promise<PoolClient | null> {
  const pool = new Pool({
    user: username,
    password: password,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return null;
  }
}

export async function verifyUser(username: string, password: string): Promise<{ success: boolean; message: string; userType?: string }> {
  const client = await createDbConnection(username, password);
  
  if (!client) {
    return { success: false, message: 'Unable to connect to database' };
  }

  try {
    for (const table of tables) {
      const query = `SELECT * FROM ${table} WHERE username = $1`;
      const result = await client.query(query, [username]);
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        if (user.password.trim() === password.trim()) {
          return { success: true, message: 'Login successful', userType: table };
        }
      }
    }
    
    return { success: false, message: 'Invalid username or password' };
  } catch (error) {
    console.error('Error during user verification:', error);
    return { success: false, message: 'An error occurred during verification' };
  } finally {
    client.release();
  }
}
