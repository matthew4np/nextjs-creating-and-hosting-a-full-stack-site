import { connectToDb} from '../db';

export async function GET() {

    const { db } = await connectToDb();



    return new Response(JSON.stringify(products), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}