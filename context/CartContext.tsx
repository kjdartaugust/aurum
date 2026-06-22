"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { getProduct } from "@/data/products";

export interface CartItem {
  id: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

type Action =
  | { type: "add"; id: string; qty?: number }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "aurum.cart.v1";

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const existing = state.items.find((i) => i.id === action.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.id ? { ...i, qty: i.qty + (action.qty ?? 1) } : i
          ),
        };
      }
      return { items: [...state.items, { id: action.id, qty: action.qty ?? 1 }] };
    }
    case "setQty":
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      };
    case "remove":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist after hydration so we never overwrite with the empty default.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const item of state.items) {
      const product = getProduct(item.id);
      if (!product || product.price == null) continue;
      count += item.qty;
      subtotal += product.price * item.qty;
    }
    return { count, subtotal };
  }, [state.items]);

  const value: CartContextValue = {
    items: state.items,
    count,
    subtotal,
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    add: (id, qty) => {
      dispatch({ type: "add", id, qty });
      setOpen(true);
    },
    remove: (id) => dispatch({ type: "remove", id }),
    setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
    clear: () => dispatch({ type: "clear" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
