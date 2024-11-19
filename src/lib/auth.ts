import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT password FROM users WHERE username = $1',
      [username]
    )
    client.release()

    if (result.rows.length > 0) {
      const storedHash = result.rows[0].password
      return await bcrypt.compare(password, storedHash)
    }

    return false
  } catch (error) {
    console.error('Error verifying credentials:', error)
    return false
  }
}
