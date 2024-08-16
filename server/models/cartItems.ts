import { Cart } from "./cart";
import { Product } from "./product";

export interface CartItems {
    product: Product,
    amount: number,
    price: number,
    cart: Cart
}