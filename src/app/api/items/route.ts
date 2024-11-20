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


    const client = await pool.connect()
    const result = await client.query('SELECT item_id,item_name, item_type, est_weight FROM item')
    // console.log(result)
    client.release()

    return NextResponse.json(result.rows)
} 

