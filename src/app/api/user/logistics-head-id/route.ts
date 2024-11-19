import { NextResponse } from 'next/server'
import { Pool } from 'pg'
// import { verifyCredentials } from '@/lib/auth'

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
  const [username, password] = credentials

  try {
    const client = await pool.connect()
    const res1=await client.query(`
      Select team_id 
      FROM Team 
      Where Team.username=$1 AND Team.password=$2
    `,[username,password])
    const result = await client.query(`
      SELECT t.current_logistics_head_id
      FROM Team t
      WHERE t.team_id = $1
    `, [res1.rows[0].team_id])
    client.release()
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Logistics head not found' }, { status: 404 })
    }

    return NextResponse.json({ logisiticsHeadId: result.rows[0].current_logistics_head_id })
  } catch (error) {
    console.error('Error fetching logistics head ID:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
