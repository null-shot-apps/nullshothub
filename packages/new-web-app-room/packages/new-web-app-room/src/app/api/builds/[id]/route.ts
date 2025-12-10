import { NextRequest, NextResponse } from 'next/server';
import { getBuildById, deleteBuild } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

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

    return NextResponse.json({ build });
  } catch (error) {
    console.error('Get build error:', error);
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

    const { id } = await params;
    const build = await getBuildById(id);

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    if (build.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }

    await deleteBuild(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete build error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

