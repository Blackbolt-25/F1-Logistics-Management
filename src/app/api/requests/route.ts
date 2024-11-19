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

  const { searchParams } = new URL(request.url)
  const technicalHeadId = searchParams.get('technicalHeadId')

  if (!technicalHeadId) {
    return NextResponse.json({ error: 'Technical head ID is required' }, { status: 400 })
  }

  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        Request_id, 
        Request.race_id,
        Time_of_request, 
        race_name, 
        Status, 
        Requester_id, 
        Design_approver_id, 
        Design_comments, 
        Finance_approver_id, 
        Financial_comments, 
        Cost
      FROM Request,race
      WHERE Requester_id = $1 AND Request.race_id = race.race_id;
    `, [technicalHeadId])
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }}

// ... POST method implementation
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
  const [username, password] = credentials


    const { requestId, raceId, items, technicalHeadId } = await request.json()

    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')

      // Insert the request
      const requestResult = await client.query(`
        INSERT INTO Request (Request_id, race_id, Status, Requester_id)
        VALUES ($1, $2, 'Pending', $3)
        RETURNING *
      `, [requestId, raceId, technicalHeadId])

      // Insert cargo items
      for (const item of items) {
        await client.query(`
          INSERT INTO Cargo (Request_id, Item_id, Quantity)
          VALUES ($1, $2, $3)
        `, [requestId, item.id, item.quantity])
      }

      await client.query('COMMIT')

      return NextResponse.json(requestResult.rows[0])
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
}

