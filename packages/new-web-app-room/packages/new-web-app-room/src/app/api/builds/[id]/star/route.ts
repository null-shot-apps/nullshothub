import { NextRequest, NextResponse } from 'next/server';
import { createStar, deleteStar, hasUserStarred } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id: buildId } = await params;
    
    // Check if already starred
    const alreadyStarred = await hasUserStarred(buildId, currentUser.userId);
    if (alreadyStarred) {
      return NextResponse.json(
        { error: 'Already starred' },
        { status: 400 }
      );
    }

    await createStar(buildId, currentUser.userId);

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
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id: buildId } = await params;
    await deleteStar(buildId, currentUser.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unstar build error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ starred: false });
    }

    const { id: buildId } = await params;
    const starred = await hasUserStarred(buildId, currentUser.userId);

    return NextResponse.json({ starred });
  } catch (error) {
    console.error('Check star error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

