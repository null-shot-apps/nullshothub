import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getBuilds, createBuild, getUserById } from '@/lib/db';
import { getCurrentUserId } from '@/lib/auth';

const createBuildSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  images: z.array(z.string().url()).optional(),
  videoUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  codeSnippet: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const builds = await getBuilds({
      userId: userId || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    // Fetch user data for each build
    const buildsWithUsers = await Promise.all(
      builds.map(async (build) => {
        const user = await getUserById(build.userId);
        return {
          ...build,
          user: user ? {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
          } : null,
        };
      })
    );

    return NextResponse.json({ builds: buildsWithUsers });
  } catch (error) {
    console.error('Get builds error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const result = createBuildSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    const build = await createBuild({
      userId,
      ...result.data,
    });

    return NextResponse.json({ build }, { status: 201 });
  } catch (error) {
    console.error('Create build error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

