import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { verifyCredentials } from '@/lib/auth'
import { warn } from 'console'

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
    // const isValid = await verifyCredentials(username, password)
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    // }

    const client = await pool.connect()
    const result = await client.query('SELECT race_id,race_name FROM race') // or 'SELECT item_name, item_type, est_weight FROM item' for items
    client.release()

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
