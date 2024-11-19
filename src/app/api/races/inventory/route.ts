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
        SELECT i.Inventory_id, i.Item_id, it.Item_name, i.Quantity
        FROM Inventory i
        JOIN Item it ON i.Item_id = it.Item_id
        JOIN Team t ON i.Team_id = t.Team_id
        JOIN Technical_Head th ON t.Team_id = th.Team_id
        WHERE th.Technical_head_id = $1
      `, [username])

      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
