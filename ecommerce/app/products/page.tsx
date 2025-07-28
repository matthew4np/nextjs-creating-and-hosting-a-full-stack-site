import ProductsList from "../ProductList";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Products",
  description: "Browse our collection of high-quality products.",
};

export default async function Products() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const cookieStore = cookies();
  const hasToken = cookieStore.has("token");

  // Fetch all products (this is a public request)
  const productsPromise = fetch(`${apiUrl}/api/products`).then((res) =>
    res.json()
  );

  // Fetch cart data only if the user is logged in.
  // Otherwise, resolve immediately with an empty array.
  const cartPromise = hasToken
    ? fetch(`${apiUrl}/api/cart`, {
        cache: "no-cache",
        headers: { Cookie: `token=${cookieStore.get("token")?.value}` },
      }).then((res) => (res.ok ? res.json() : [])) // Gracefully handle API errors
    : Promise.resolve([]);

  // Await both promises in parallel for performance
  const [products, cartData] = await Promise.all([
    productsPromise,
    cartPromise,
  ]);

  // This logic now handles both logged-out users (who get an empty array from cartPromise)
  // and potential API errors for logged-in users, preventing crashes.
  const cartProducts = Array.isArray(cartData) ? cartData : [];
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Our Products
      </h1>
      <ProductsList products={products} initialCartProducts={cartProducts} />
    </div>
  );
}