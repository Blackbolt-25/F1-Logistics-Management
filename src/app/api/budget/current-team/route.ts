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
      // First get the team_id for the current user
      const userResult = await client.query(`
        SELECT team_id
        FROM team  
        WHERE username=$1 and password=$2
      `, [username,password])

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }

      const teamId = userResult.rows[0].team_id

      // Get the budget data using the functions we created
      const budgetResult = await client.query(`
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
        WHERE t.Team_id = $1
      `, [teamId])
      return NextResponse.json(budgetResult.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching current team budget:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
