import { connectToDb } from '../db';

export async function GET() {

    const { db } = await connectToDb();
    const users = await db.collection('users').find({}).toArray();

    return new Response(JSON.stringify(users), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}