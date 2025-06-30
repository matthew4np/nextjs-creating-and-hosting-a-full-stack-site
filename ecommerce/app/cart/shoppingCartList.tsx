'use client';

import { useState } from "react";
import { Product } from "../product-data";
import Link from 'next/link'

export default function ShoppingCartList({ initialCartProducts } : {initialCartProducts: Product[] }) {

    const [cartProducts] = useState( initialCartProducts );

    return (
        <>
        <h1>Shopping Cart</h1>
        {cartProducts.map(product => (
                <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
                <Link key={product.id} href={"/products/" + product.id}>
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl text-gray-600">${product.price}</p>
                </Link>
                </div>
                )
            )
        }
        </>
    )
}