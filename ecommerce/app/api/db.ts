
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

let cachedClient: MongoClient | null  = null;
let cachedDb: Db | null = null;

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.j39co6v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export async function connectToDb() {

if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb}
}

const client = new MongoClient(uri, {
serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
}
});

await client.connect();

cachedClient = client;
cachedDb = client.db('ecommerce-nextjs');

return { client, db: client.db() }

}