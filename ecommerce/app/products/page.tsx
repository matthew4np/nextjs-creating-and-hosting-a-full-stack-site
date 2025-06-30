import ProductsList from "../ProductList";

export const dynamic = 'force-dynamic';

export default async function Products() {

    const response = await fetch('process.env.NEXT_PUBLIC_SITE_URL/api/products')
    const products = await response.json();

    const response2 = await fetch('process.env.NEXT_PUBLIC_SITE_URL/api/users/2/cart', {
        cache : 'no-cache',
    })
    const cartProducts = await response2.json();

    return (
        <>
        <h1>Products</h1>
        <ProductsList products={products} initialCartProducts={cartProducts}/>
        </>
    )
}