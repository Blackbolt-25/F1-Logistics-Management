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
  const id = request.url.slice(-5);
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT request_id, time_of_request, cost
        FROM Request
        WHERE requester_id= $1
        ORDER BY time_of_request ASC
      `, [id])

      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching requests spending data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
