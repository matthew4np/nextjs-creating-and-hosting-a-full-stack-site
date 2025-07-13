import ShoppingCartList from "./shoppingCartList";


export const dynamic = "force-dynamic";

export default async function CartPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/api/users/2/cart`, {
    cache: "no-cache",
  });
  const cartProducts = await response.json();

  return <ShoppingCartList initialCartProducts={cartProducts} />;
}
