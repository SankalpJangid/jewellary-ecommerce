import { atom } from "jotai";

export const cartAtom = atom([]);

export const addToCartAtom = atom(
  null,
  (get, set, product) => {
    const cart = get(cartAtom);
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      set(cartAtom, cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      set(cartAtom, [...cart, { ...product, quantity: 1 }]);
    }
  }
);

export const removeFromCartAtom = atom(
  null,
  (get, set, productId) => {
    const cart = get(cartAtom);
    set(cartAtom, cart.filter(item => item.id !== productId));
  }
);

export const updateQuantityAtom = atom(
  null,
  (get, set, { productId, quantity }) => {
    const cart = get(cartAtom);
    if (quantity <= 0) {
      set(cartAtom, cart.filter(item => item.id !== productId));
    } else {
      set(cartAtom, cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  }
);

export const clearCartAtom = atom(
  null,
  (get, set) => {
    set(cartAtom, []);
  }
);
