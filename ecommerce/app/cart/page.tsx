import ShoppingCartList from "./shoppingCartList";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // When fetching from a Server Component, we need to manually forward the cookies.
  // The middleware ensures the user is logged in, but the API call still needs the token.
  const cookieStore = cookies();
  const requestHeaders = new Headers();
  if (cookieStore.has("token")) {
    requestHeaders.set("Cookie", `token=${cookieStore.get("token")?.value}`);
  }

  const response = await fetch(`${apiUrl}/api/cart`, {
    cache: "no-cache",
    headers: requestHeaders,
  });
  const data = await response.json();

  // The middleware protects this page, so we can assume the user is logged in.
  // This check handles cases where the API might return something other than an array
  // for other reasons, preventing a crash.
  const cartProducts = Array.isArray(data) ? data : [];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      <ShoppingCartList initialCartProducts={cartProducts} />
    </div>
  );
}
