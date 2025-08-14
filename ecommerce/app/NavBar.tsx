import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";
import { Product } from "./product-data"; // Assuming product-data.ts is in the app directory

/**
 * Fetches the number of items in the user's cart.
 * This function runs on the server.
 * @returns {Promise<number>} The number of items in the cart.
 */
async function getCartItemCount(): Promise<number> {
  // We need the full URL for server-side fetch
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  // If there's no token, the user is not logged in, so the cart is empty.
  if (!token) {
    return 0;
  }

  try {
    // We must forward the user's authentication cookie to the API route.
    const response = await fetch(`${apiUrl}/api/cart`, {
      headers: {
        Cookie: `token=${token.value}`,
      },
      // Use 'no-store' to ensure the cart count is always fresh.
      cache: 'no-store',
    });

    if (response.ok) {
      const cartProducts: Product[] = await response.json();
      return cartProducts.length;
    }

    // If the API returns an error (e.g., 401 Unauthorized), treat it as an empty cart.
    return 0;
  } catch (error) {
    console.error("Failed to fetch cart count:", error);
    // In case of a network or other error, also return 0 for a stable UI.
    return 0;
  }
}

// The NavBar is now an async Server Component to fetch data on the server.
export default async function NavBar() {
  const hasToken = cookies().has("token");
  // Await the cart count before rendering the component.
  const cartCount = await getCartItemCount();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-black">
          MyStore
        </Link>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link href="/products" className="text-gray-700 hover:text-black">Products</Link>
          </li>
          <li>
            {/* The link and count are wrapped in a relative container for positioning the badge. */}
            <Link href="/cart" className="relative text-gray-700 hover:text-black">
              Cart
              {/* The count badge is only displayed if there are items in the cart. */}
              {cartCount > 0 && (
                <span className="absolute -top-[0.6rem] -right-[0.9rem] inline-flex items-center justify-center px-[0.28rem] py-[0.18rem] text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {hasToken ? <LogoutButton /> : <Link href="/login">Login</Link>}
          </li>
        </ul>
      </div>
    </nav>
  );
}
