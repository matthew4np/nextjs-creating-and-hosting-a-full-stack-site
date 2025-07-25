import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/app/api/db';
import { UserSchema } from '@/lib/models/user';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// GET a single user by _id or email from query parameters
// Example: /api/users/user?id=... OR /api/users/user?email=...
export async function GET(request: NextRequest) {
    try {
        const { db } = await connectToDb();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const email = searchParams.get('email');

        let user;
        if (id) {
            if (!ObjectId.isValid(id)) {
                return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
            }
            user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        } else if (email) {
            user = await db.collection('users').findOne({ email });
        } else {
            return NextResponse.json({ message: 'An "id" or "email" query parameter is required' }, { status: 400 });
        }

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Omit password from the response for security
        const { password, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error fetching user', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// POST: Create a new user
// Note: This is unconventional. Creating users is typically done on the collection endpoint (/api/users).
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = UserSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid user data', errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, email, password } = validation.data;
        const { db } = await connectToDb();

        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUserDocument = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        const result = await db.collection('users').insertOne(newUserDocument);

        const { password: _, ...userWithoutPassword } = newUserDocument;
        return NextResponse.json({ ...userWithoutPassword, _id: result.insertedId }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: 'Error creating user', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// PUT: Update a user identified by _id in the request body
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { _id, ...updateData } = body;

        if (!_id || !ObjectId.isValid(_id)) {
            return NextResponse.json({ message: 'A valid user ID (_id) is required in the request body' }, { status: 400 });
        }

        const validation = UserSchema.partial().safeParse(updateData);
        if (!validation.success) {
            return NextResponse.json({ message: 'Invalid update data', errors: validation.error.flatten().fieldErrors }, { status: 400 });
        }

        const { db } = await connectToDb();
        const result = await db.collection('users').findOneAndUpdate(
            { _id: new ObjectId(_id) },
            { $set: validation.data },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const { password, ...userWithoutPassword } = result;
        return NextResponse.json(userWithoutPassword, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error updating user', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// DELETE: Delete a user identified by _id in the request body
export async function DELETE(request: NextRequest) {
    try {
        const { _id } = await request.json();

        if (!_id || !ObjectId.isValid(_id)) {
            return NextResponse.json({ message: 'A valid user ID (_id) is required in the request body' }, { status: 400 });
        }

        const { db } = await connectToDb();
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(_id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error deleting user', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}