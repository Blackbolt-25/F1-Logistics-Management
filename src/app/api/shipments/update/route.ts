import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function PUT(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
  const [username, password] = credentials

  const { shipmentId, updates, logisticsHeadId } = await request.json()

  try {
    const client = await pool.connect()
    try {
      const { actual_delivery_date, current_status } = updates
      const result = await client.query(`
        UPDATE Shipment
        SET 
          Actual_delivery_date = COALESCE($1, Actual_delivery_date),
          Current_status = COALESCE($2, Current_status)
        WHERE Shipment_id = $3 AND Logistics_head_id = $4
        RETURNING *
      `, [actual_delivery_date, current_status, shipmentId, logisticsHeadId])

      if (result.rowCount === 0) {
        return NextResponse.json({ error: 'Shipment not found or unauthorized' }, { status: 404 })
      }

      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating shipment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
