import ProductsList from "../ProductList";

export const dynamic = "force-dynamic";

export default async function Products() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // Fetch products and cart data in parallel for better performance
  const [productsResponse, cartResponse] = await Promise.all([
    fetch(`${apiUrl}/api/products`),
    fetch(`${apiUrl}/api/users/2/cart`, {
      cache: "no-cache",
    }),
  ]);

  const [products, cartProducts] = await Promise.all([
    productsResponse.json(),
    cartResponse.json(),
  ]);

  return (
    <>
      <h1>Products</h1>
      <ProductsList products={products} initialCartProducts={cartProducts} />
    </>
  );
}
