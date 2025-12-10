import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, getUserByEmail, getUserByUsername } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  name: z.string().min(1).max(50),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = signupSchema.parse(body);

    // Check if user already exists
    const existingEmail = await getUserByEmail(data.email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const existingUsername = await getUserByUsername(data.username);
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(data.password);
    const user = await createUser({
      email: data.email,
      username: data.username,
      name: data.name,
      password: hashedPassword,
    });

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

    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

