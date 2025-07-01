import ShoppingCartList from "./shoppingCartList";

export const dynamic = 'force-dynamic';

export default async function CartPage() {

    const response = await fetch('https://solid-happiness-x5r7xwrg6vjxh6p77-3000.app.github.dev/api/users/2/cart', {
        cache: 'no-cache'
    }
    );
    const cartProducts = await response.json();

    return (
        <ShoppingCartList initialCartProducts={cartProducts} />
    );
}