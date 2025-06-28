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
        <Link key={product.id} href={"/products/" + product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
        </Link>
    ))}
    </>
    )
}