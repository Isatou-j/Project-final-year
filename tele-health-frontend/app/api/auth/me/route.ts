import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return the current user information from the session
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          role: session.user.role,
          profileUrl: session.user.image || session.user.profileUrl,
          isVerified: session.user.isVerified,
          isActive: session.user.isActive,
          createdAt: session.user.createdAt,
          updatedAt: session.user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
