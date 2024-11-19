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
        SELECT 
          t.Team_id,
          t.Budget as budget,
          COALESCE((
            SELECT SUM(req.Cost)
            FROM Request req
            JOIN Financial_Head fh ON req.Finance_approver_id = fh.Financial_head_id
            WHERE fh.Team_id = t.Team_id
          ), 0) as spending,
          get_budget_left_for_team(t.Team_id) as budget_left
        FROM Team t
        ORDER BY t.Team_id
      `)
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching all teams budget:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
