import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail } from '@/lib/db';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    // Find user
    const user = await getUserByEmail(data.email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

