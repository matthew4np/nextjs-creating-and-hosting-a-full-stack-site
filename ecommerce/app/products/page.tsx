import ProductsList from "../ProductList";

export const dynamic = 'force-dynamic';

export default async function Products() {

    const response = await fetch('http://localhost:3000/api/products');
    const products = await response.json();

    const response2 = await fetch('http://localhost:3000/api/users/2/cart', {
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