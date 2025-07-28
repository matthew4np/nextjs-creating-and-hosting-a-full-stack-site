"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "../product-data";
import Link from "next/link";

export default function ShoppingCartList({
  initialCartProducts,
}: {
  initialCartProducts: Product[];
}) {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function removeFromCart(productId: string) {
    // Use the new, centralized and secure cart API endpoint
    const response = await fetch(`${apiUrl}/api/cart`, {
      // This now securely calls the DELETE endpoint for the logged-in user
      method: "DELETE",
      body: JSON.stringify({
        productId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      setCartProducts(data);
      setError(null); // Clear previous errors
      router.refresh(); // Sync server state
    } else {
      const errorMessage = data.message || "Failed to remove item from cart.";
      setError(errorMessage);
      console.error("Error removing from cart:", errorMessage);
    }
  }

  return (
    <>
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>
      )}
      <ul className="space-y-4">
        {cartProducts.map((product) => (
          <li
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition duration-300"
          >
            <Link href={`/products/${product.id}`} className="group">
              <h3 className="text-xl font-semibold mb-1 group-hover:underline">
                {product.name}
              </h3>
              <p className="text-gray-600">${product.price}</p>
            </Link>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 rounded transition-colors"
              onClick={() => removeFromCart(product.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
