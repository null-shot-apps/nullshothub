import { NextRequest, NextResponse } from 'next/server';
import { addStar, removeStar, hasUserStarred, getBuildById } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const build = await getBuildById(id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    const isStarred = await hasUserStarred(id, userId);
    if (isStarred) {
      return NextResponse.json(
        { error: 'Already starred' },
        { status: 400 }
      );
    }

    await addStar(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Star build error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const build = await getBuildById(id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    const isStarred = await hasUserStarred(id, userId);
    if (!isStarred) {
      return NextResponse.json(
        { error: 'Not starred' },
        { status: 400 }
      );
    }

    await removeStar(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unstar build error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

