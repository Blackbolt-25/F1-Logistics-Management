import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function PUT(request: Request) {
  try {
    // if (!await verifyAuth(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { requestId, financialComments, approved, financialHeadId } = await request.json()

    if (!requestId || !financialHeadId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const checkResult = await client.query(
        'SELECT Status FROM Request WHERE Request_id = $1',
        [requestId]
      )

      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Request not found' }, { status: 404 })
      }

      if (checkResult.rows[0].status === 'Approved') {
        await client.query('ROLLBACK')
        return NextResponse.json({ error: 'Request already approved' }, { status: 400 })
      }

      const newStatus = approved ? 'Approved' : 'Pending'
      const result = await client.query(`
        UPDATE Request
        SET Status = $1, Finance_approver_id = $2, Financial_comments = $3
        WHERE Request_id = $4
        RETURNING *
      `, [newStatus, financialHeadId, financialComments, requestId])

      await client.query('COMMIT')

      return NextResponse.json(result.rows[0])
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
