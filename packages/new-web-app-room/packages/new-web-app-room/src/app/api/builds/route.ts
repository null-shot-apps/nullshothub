import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createBuild, getAllBuilds } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const createBuildSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(5000),
  images: z.array(z.string().url()).max(10),
  videoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  codeSnippets: z.array(z.object({
    language: z.string(),
    code: z.string(),
    filename: z.string().optional(),
  })).optional(),
  tags: z.array(z.string()).max(10),
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
    const data = createBuildSchema.parse(body);

    const build = await createBuild({
      ...data,
      userId: currentUser.userId,
    });

    return NextResponse.json({ build });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create build error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId') || undefined;

    const builds = await getAllBuilds({ limit, offset, userId });

    return NextResponse.json({ builds });
  } catch (error) {
    console.error('Get builds error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

