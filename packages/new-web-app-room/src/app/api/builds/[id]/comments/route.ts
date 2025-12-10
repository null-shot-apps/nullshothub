import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCommentsByBuildId, createComment, getBuildById, getUserById } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await getCommentsByBuildId(id);

    // Fetch user data for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await getUserById(comment.userId);
        return {
          ...comment,
          user: user ? {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
          } : null,
        };
      })
    );

    return NextResponse.json({ comments: commentsWithUsers });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const result = createCommentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const comment = await createComment({
      buildId: id,
      userId,
      content: result.data.content,
    });

    const user = await getUserById(userId);

    return NextResponse.json({
      comment: {
        ...comment,
        user: user ? {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        } : null,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

