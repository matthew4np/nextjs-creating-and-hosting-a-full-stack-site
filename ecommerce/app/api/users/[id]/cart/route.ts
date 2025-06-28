import { NextRequest } from 'next/server';
import { products } from '@/app/products/product-data';
import { connectToDb } from '@/app/api/db';

type ShoppingCart = Record<string, string[]>;

const carts: ShoppingCart = {
    '1': ['123', '345'],
    '2': ['345', '456'],
    '3': ['234'],
}

type Params = {
    id: string;
}

export async function GET(request: NextRequest, {params}: {params: Params}) {

const { db } = await connectToDb();

const userId = params.id;
const userCart = await db.collection('carts').findOne({ userId});

if (!userCart) {
    return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const cartIds = userCart.cartIds;
const cartProducts = await db.collection('products').find({id: { $in: cartIds}}).toArray();

    return new Response(JSON.stringify(cartProducts), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });

}

type CartBody = {
    productId: string;
}

export async function POST(request: NextRequest, {params}: {params: Params}) {

const userId = params.id;
const body: CartBody = await request.json();
const productId = body.productId;


carts[userId] = carts[userId] ? carts[userId].concat(productId) : [productId]

const cartProducts = carts[userId].map(id => products.find(p => p.id === id));

return new Response(JSON.stringify(cartProducts), {
    status: 201,
    headers: {
        'Content-Type' : 'application/json',
    }
})

}

