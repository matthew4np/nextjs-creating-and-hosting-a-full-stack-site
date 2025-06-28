import ProductsList from "./ProductList";

export default async function ProductsPage() {

    const response = await fetch('http://127.0.0.1:3000/api/products')
    const products = await response.json();

    return (
        <>
        <h1>Products</h1>
        <ProductsList products={products} />
        </>
    )
}