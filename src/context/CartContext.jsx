// src/context/CartContext.jsx
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [update, setUpdate] = useState(true);
  return (
    <CartContext.Provider value={{ update, setUpdate }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartFlag() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartFlag must be used within CartProvider");
  return ctx; // { update, setUpdate }
}
