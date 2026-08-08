import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ColorwaySlug } from "@/lib/colorways";
import { nomadMeta } from "@/lib/specs";

export type CartItem = {
  colorwaySlug: ColorwaySlug;
  size: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (colorwaySlug: ColorwaySlug, size: number) => void;
  removeItem: (colorwaySlug: ColorwaySlug, size: number) => void;
  setQuantity: (colorwaySlug: ColorwaySlug, size: number, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (colorwaySlug, size) =>
        set((state) => {
          const existing = state.items.find(
            (item) => item.colorwaySlug === colorwaySlug && item.size === size
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item === existing
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { colorwaySlug, size, quantity: 1 }],
          };
        }),
      removeItem: (colorwaySlug, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.colorwaySlug === colorwaySlug && item.size === size)
          ),
        })),
      setQuantity: (colorwaySlug, size, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) => !(item.colorwaySlug === colorwaySlug && item.size === size)
                )
              : state.items.map((item) =>
                  item.colorwaySlug === colorwaySlug && item.size === size
                    ? { ...item, quantity }
                    : item
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "klot-nomad-cart" }
  )
);

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotalUSD(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.quantity * nomadMeta.priceUSD,
    0
  );
}
