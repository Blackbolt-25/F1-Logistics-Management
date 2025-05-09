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

  const { searchParams } = new URL(request.url)
  const logisticsHeadId = searchParams.get('logisticsHeadId')
  if (!logisticsHeadId) {
    return NextResponse.json({ error: 'logisticsHeadId head ID is required' }, { status: 400 })
  }
  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT 
        shipment_id,
        shipment_type,
        start_location,
        sh.race_id,
        race_name,
        request_id,
        estimated_delivery_date,
        actual_delivery_date,
        current_status
        FROM Shipment sh,race 
        WHERE Logistics_head_id = $1 AND sh.race_id=race.race_id
        ORDER BY Estimated_delivery_date DESC
      `, [logisticsHeadId])
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
