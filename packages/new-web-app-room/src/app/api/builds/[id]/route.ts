import { NextRequest, NextResponse } from 'next/server';
import { getBuildById, getUserById, getStarCount, hasUserStarred } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const build = await getBuildById(id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    const user = await getUserById(build.userId);
    const starCount = await getStarCount(id);
    const userId = getCurrentUserId(request);
    const isStarred = userId ? await hasUserStarred(id, userId) : false;

    return NextResponse.json({
      build: {
        ...build,
        user: user ? {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        } : null,
        starCount,
        isStarred,
      },
    });
  } catch (error) {
    console.error('Get build error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

