import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createReport, getBuildById } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

const createReportSchema = z.object({
  buildId: z.string(),
  reason: z.enum(['spam', 'inappropriate', 'copyright', 'other']),
  description: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = createReportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const { buildId, reason, description } = result.data;

    // Verify build exists
    const build = await getBuildById(buildId);
    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    const report = await createReport({
      buildId,
      userId,
      reason,
      description,
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

