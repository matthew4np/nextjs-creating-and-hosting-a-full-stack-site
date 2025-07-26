import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/app/api/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { cookies } from 'next/headers';

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(request: NextRequest) {
    // Best practice: Check for the environment variable at the start.
    if (!process.env.JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined in .env.local');
        return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const validation = LoginSchema.safeParse(body);

        console.log('Login request body:', body);

        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { email, password } = validation.data;
        const { db } = await connectToDb();

        // 1. Find the user by email
        const user = await db.collection('users').findOne({ email });
        console.log('User found:', user);
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }); // Use a generic message
        }

        // 2. Compare the provided password with the stored hash
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log('Password match:', isPasswordCorrect);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // 3. If correct, create a JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET, // CRITICAL FIX: Use the environment variable, not a string
            { expiresIn: '1h' }
        );

        // 4. Set the token in a secure, httpOnly cookie
        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour
            path: '/',
        });

        return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } catch (error) {
        console.error('Login API Error:', error); // Log the full error to the server console
        return NextResponse.json({ message: 'Error during login', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}