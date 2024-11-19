import { NextResponse } from 'next/server';
import { verifyUser } from '@/server/authService';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
  }

  try {
    const result = await verifyUser(username, password);
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred during login' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (!action) {
    return NextResponse.json({ success: false, message: 'Action is required' }, { status: 400 });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

  try {
    const result = await verifyUser(username, password);
    if (!result.success) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    switch (action) {
      case 'getName':
        return NextResponse.json({ success: true, name: result.name });
      case 'getEmail':
        return NextResponse.json({ success: true, email: result.email });
      case 'getUserType':
        return NextResponse.json({ success: true, userType: result.userType });
      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
