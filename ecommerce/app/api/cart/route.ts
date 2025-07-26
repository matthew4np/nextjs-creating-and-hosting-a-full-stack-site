import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDb } from '@/app/api/db';
import { ObjectId } from 'mongodb';

interface UserJwtPayload {
    userId: string;
    iat: number;
    exp: number;
}

async function getUserIdFromToken(): Promise<string | null> {
    const token = cookies().get('token')?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserJwtPayload;
        return decoded.userId;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

// GET /api/cart - Fetches the cart for the logged-in user
export async function GET(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { db } = await connectToDb();
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user || !user.cartIds) {
            return NextResponse.json([], { status: 200 }); // Return empty cart
        }

        // The products collection uses a string 'id' field, not a BSON '_id'.
        const cartProducts = await db.collection('products').find({
            id: { $in: user.cartIds }
        }).toArray();

        return NextResponse.json(cartProducts, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error fetching cart', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// POST /api/cart - Adds an item to the logged-in user's cart
export async function POST(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }

        const { db } = await connectToDb();

        // Add the product ID to the user's cartIds array if it doesn't exist already
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { cartIds: productId } } // $addToSet prevents duplicates
        );

        // Fetch the updated cart to return to the client for a seamless UI update
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user || !user.cartIds || user.cartIds.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const updatedCartProducts = await db.collection('products').find({
            // The products collection uses a string 'id' field, not a BSON '_id'.
            id: { $in: user.cartIds }
        }).toArray();

        return NextResponse.json(updatedCartProducts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error adding item to cart', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// DELETE /api/cart - Removes an item from the logged-in user's cart
export async function DELETE(request: NextRequest) {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }

        const { db } = await connectToDb();

        // Remove the product ID from the user's cartIds array
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { cartIds: productId } }
        );

        // Fetch the updated cart to return to the client
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user || !user.cartIds || user.cartIds.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const updatedCartProducts = await db.collection('products').find({
            // The products collection uses a string 'id' field, not a BSON '_id'.
            id: { $in: user.cartIds }
        }).toArray();

        return NextResponse.json(updatedCartProducts, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error removing item from cart', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}