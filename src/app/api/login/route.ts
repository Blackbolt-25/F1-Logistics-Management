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
