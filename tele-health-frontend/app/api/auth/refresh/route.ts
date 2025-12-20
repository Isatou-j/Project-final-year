import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import axios from 'axios';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    // Call backend refresh endpoint
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {
        refreshToken: session.refreshToken,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = response.data;

    // Return new tokens
    return NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
