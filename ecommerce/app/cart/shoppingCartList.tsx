"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../product-data";
import Link from "next/link";

export default function ShoppingCartList({ initialCartProducts } : { initialCartProducts: Product[] }) {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function removeFromCart(productId: string) {
    const response = await fetch(`${apiUrl}/api/users/2/cart`, {
      method: "DELETE",
      body: JSON.stringify({
        productId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const updatedCartProducts = await response.json();
    setCartProducts(updatedCartProducts);
    router.refresh();
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      <ul className="space-y-4">
        {cartProducts.map((product) => (
          <li className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
            <Link key={product.id} href={"/products/" + product.id}>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className=" text-gray-600">${product.price}</p>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500  hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromCart(product.id);
                  }}
                >
                  Remove from Cart
                </button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
