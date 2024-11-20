import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET(request: Request) {

    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT r.*, race.Race_name
        FROM Request r
        JOIN Race ON r.race_id = Race.Race_id
        WHERE r.Status = 'Pending' AND r.Design_approver_id IS NULL
        ORDER BY r.Time_of_request DESC
      `)
      console.log(result.rows)
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } 
