import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createReport } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const createReportSchema = z.object({
  buildId: z.string().optional(),
  commentId: z.string().optional(),
  reason: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = createReportSchema.parse(body);

    if (!data.buildId && !data.commentId) {
      return NextResponse.json(
        { error: 'Either buildId or commentId must be provided' },
        { status: 400 }
      );
    }

    const report = await createReport({
      ...data,
      userId: currentUser.userId,
    });

    return NextResponse.json({ report });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

