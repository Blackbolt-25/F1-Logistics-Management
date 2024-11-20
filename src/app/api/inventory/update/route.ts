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

  const { inventoryId, quantity, technicalHeadId } = await request.json()

  if (!inventoryId || quantity === undefined || !technicalHeadId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        UPDATE Inventory
        SET Quantity = $1
        WHERE Inventory_id = $2
        AND Team_id = (SELECT Team_id FROM Technical_Head WHERE Technical_head_id = $3)
        RETURNING *
      `, [quantity, inventoryId, technicalHeadId])

      if (result.rowCount === 0) {
        return NextResponse.json({ error: 'Inventory item not found or unauthorized' }, { status: 404 })
      }

      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
