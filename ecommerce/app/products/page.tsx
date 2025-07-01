import ProductsList from "../ProductList";

export const dynamic = 'force-dynamic';

export default async function Products() {

    const response = await fetch('https://solid-happiness-x5r7xwrg6vjxh6p77.github.dev/api/products');
    const products = await response.json();

    const response2 = await fetch('https://solid-happiness-x5r7xwrg6vjxh6p77.github.dev/api/users/2/cart', {
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