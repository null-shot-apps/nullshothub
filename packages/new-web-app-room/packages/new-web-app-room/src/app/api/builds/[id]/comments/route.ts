import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createComment, getCommentsByBuildId } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

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
    const body = await request.json();
    const data = createCommentSchema.parse(body);

    const comment = await createComment({
      buildId,
      userId: currentUser.userId,
      content: data.content,
    });

    return NextResponse.json({ comment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create comment error:', error);
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
    const { id: buildId } = await params;
    const comments = await getCommentsByBuildId(buildId);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

