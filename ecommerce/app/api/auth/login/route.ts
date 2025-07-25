import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/app/api/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = LoginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { email, password } = validation.data;
        const { db } = await connectToDb();

        // 1. Find the user by email
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }); // Use a generic message
        }

        // 2. Compare the provided password with the stored hash
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // 3. If correct, create a JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // 4. Return the token to the client
        return NextResponse.json({ token }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error during login', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}