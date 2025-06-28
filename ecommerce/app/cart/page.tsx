import ShoppingCartList from "./shoppingCartList";

export default async function CartPage() {

    const response = await fetch('http://127.0.0.1:3000/api/users/2/cart', {
        cache: 'no-cache'
    }
    );
    const cartProducts = await response.json();

    return (
        <ShoppingCartList initialCartProducts={cartProducts} />
    );
}