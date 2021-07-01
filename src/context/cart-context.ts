import * as React from 'react';
import {Option} from "@src/models/option";
import {Item} from "@src/models/item";

export type CartItem = {
  dish: Item;
  sideDishes: Option[];
};

export type CartState = {
  cartItems: CartItem[];
  updateCartItems: (items: CartItem[], totlaPrice: number) => void;
  totalPrice: number;
  clearCart: () => void;
};

const initialCartState: CartState = {
  cartItems: [],
  updateCartItems: () => {},
  totalPrice: 0,
  clearCart: () => {},
};

export default React.createContext(initialCartState);
