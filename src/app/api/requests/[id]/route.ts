// src/app/api/requests/[id]/route.ts
import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// Create pool outside the handler to reuse connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
})

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

async function verifyAuth(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false
  }
  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')
  const [username, password] = credentials
  // Add your authentication logic here if needed
  return true
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    if (!await verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const id = params.id;
    const client = await pool.connect()
    try {
      const result = await client.query(`
        DELETE FROM Request
        WHERE Request_id = $1 AND Status = 'Pending'
        RETURNING *
      `, [id])

      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: 'Request not found or not pending' }, 
          { status: 404 }
        )
      }

      return NextResponse.json({ message: 'Request deleted successfully' })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error deleting request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    if (!await verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { raceId } = body

    // Validate required fields
    if (!raceId) {
      return NextResponse.json(
        { error: 'Race ID is required' },
        { status: 400 }
      )
    }

    console.log(params.id)
    const client = await pool.connect()
    try {
      // Log the query parameters for debugging
      console.log('Updating request:', { raceId, requestId: params.id })
      const result = await client.query(`
        UPDATE Request
        SET race_id = $1
        WHERE Request_id = $2
        RETURNING *
      `, [raceId, params.id])
      
      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: 'Request not found or not pending' },
          { status: 404 }
        )
      }
      return NextResponse.json(result.rows[0])
    } catch (dbError: any) {
      // Return the specific database error message
      console.log(dbError)
      return NextResponse.json(
        { 
          error: 'Database error',
          message: dbError.message,
          code: dbError.code // Include PostgreSQL error code if available
        },
        { status: 400}
      )
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('Error updating request:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    )
  }
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!await verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = params.id;
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT * FROM Request
        WHERE Request_id = $1
      `, [id])

      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: 'Request not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
