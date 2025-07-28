import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
  // As a Server Component, the Navbar can directly read cookies.
  const hasToken = cookies().has("token");

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
            <Link href="/cart" className="text-gray-700 hover:text-black">Cart</Link>
          </li>
          <li className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {hasToken ? <LogoutButton /> : <Link href="/login">Login</Link>}
          </li>
        </ul>
      </div>
    </nav>
  );

}