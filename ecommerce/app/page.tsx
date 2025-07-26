import Link from 'next/link';
import Image from 'next/image';
import { Product } from './product-data';

// By making the Home page an `async` function, it becomes a Server Component,
// which is perfect for fetching data.
export default async function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // In a real application, you might have a specific API endpoint for featured products.
  // For now, we'll fetch all products and take the first 4 to feature.
  let featuredProducts: Product[] = [];
  try {
    // We add a query parameter to limit the results on the API side if it supports it.
    const response = await fetch(`${apiUrl}/api/products?limit=4`, {
      // Cache the data for an hour to improve performance for all visitors.
      next: { revalidate: 3600 },
    });
    if (response.ok) {
      featuredProducts = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    // In a real app, you might render a specific error state here.
  }

  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gray-50">
        <h1 className="text-5xl font-bold mb-4">Welcome to MyStore</h1>
        <p className="text-xl text-gray-600 mb-8">Your one-stop shop for amazing products.</p>
        <Link href="/products" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">
          Shop Now
        </Link>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <Link href={`/products/${product.id}`} className="group block">
                <div className="relative h-64 w-full"><Image src={'/' + product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} /></div>
                <div className="p-4"><h3 className="text-lg font-semibold mb-2 group-hover:underline">{product.name}</h3><p className="text-gray-700 font-bold">${product.price.toFixed(2)}</p></div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}