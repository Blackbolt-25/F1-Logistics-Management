import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
  const [username, password] = credentials

  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT r.*, race.Race_name
        FROM Request r
        JOIN Race ON r.race_id = Race.Race_id
        WHERE r.Status = 'Pending'
        ORDER BY r.Time_of_request DESC
      `)

      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching financial requests:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
