'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { Product } from './product-data';
import Link from 'next/link';


export default function ProductList({ products, initialCartProducts = [] }: { products: Product[], initialCartProducts: Product[] }) {
    const router = useRouter();
  
  const [cartProducts, setCartProducts] = useState(initialCartProducts);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function addToCart(productId: string) {
    // Use the new, secure endpoint that works for the logged-in user
    const response = await fetch(`${apiUrl}/api/cart`, {
      method: "POST",
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
      setError(null);
      router.refresh();
    } else {
      const errorMessage = data.message || "Could not add item to cart. Please log in.";
      setError(errorMessage);
      console.error("Error adding to cart:", errorMessage);
    }
  }

  async function removeFromCart(productId: string) {
    // Use the new, secure endpoint that works for the logged-in user
    const response = await fetch(`${apiUrl}/api/cart`, {
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
      setError(null);
      router.refresh();
    } else {
      const errorMessage = data.message || "Could not remove item from cart. Please log in.";
      setError(errorMessage);
      console.error("Error removing from cart:", errorMessage);
    }
  }

  function productIsInCart(productId: string) {
    return cartProducts.some((cp) => cp.id === productId);
  }

  return (
    <div>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-center">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition duration-300">
            {/* This link wraps the clickable parts of the card that lead to the product page */}
            <Link href={`/products/${product.id}`} className="group flex-grow">
              <div className="flex justify-center mb-4 h-48 relative">
                <Image
                  src={'/' + product.imageUrl}
                  alt="Product image"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:underline">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>
            </Link>

            {/* The buttons are now separate from the link, which is much better for accessibility and predictability. */}
            <div className="mt-4">
              {productIsInCart(product.id)
                ? (
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 rounded w-full"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Remove from Cart
                  </button>
                ) : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded w-full"
                    onClick={() => addToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                )}
            </div>
          </div>
    ))}
      </div>
    </div>
  )
}
