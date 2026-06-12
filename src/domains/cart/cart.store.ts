import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartItem } from './cart.types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let idCounter = 0;
const generateLocalId = (): string => `cart-${Date.now()}-${++idCounter}`;

/**
 * Two cart entries are considered "mergeable" when they share the same
 * variant.  This lets `addItem` silently increment quantity instead of
 * duplicating entries.
 *
 * Backend constraint: `cart_items.variant_id` is NOT NULL with a unique
 * index on `(user_id, variant_id)` — the store mirrors this.
 */
const isSameProductVariant = (a: CartItem, b: Omit<CartItem, 'localId' | 'checked'>) =>
  a.variantId === b.variantId;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface CartState {
  items: CartItem[];
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

interface CartActions {
  /**
   * Add an item or increment quantity if the same variant already exists.
   *
   * Backend equivalent: `INSERT … ON CONFLICT (user_id, variant_id)
   * DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`
   */
  addItem: (item: Omit<CartItem, 'localId' | 'checked'>) => void;

  /** Remove a single cart entry by its local id. */
  removeItem: (localId: string) => void;

  /**
   * Set quantity for an entry.
   * Pass `0` or negative to remove the entry entirely.
   */
  updateQuantity: (localId: string, quantity: number) => void;

  /** Toggle the checkout checkbox of one entry. */
  toggleItemCheck: (localId: string) => void;

  /** Check or un-check every entry in one shot. */
  toggleSelectAll: (checked: boolean) => void;

  /** Remove every checked entry (called after a successful checkout). */
  clearChecked: () => void;

  /** Remove everything. */
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;

// ---------------------------------------------------------------------------
// Factory  —  exported so the provider in lib/providers creates one instance
// per React tree (SSR-safe).
// ---------------------------------------------------------------------------

export const createCartStore = () =>
  createStore<CartStore>()(
    persist(
      (set, get) => ({
        // ── State ────────────────────────────────────────────────────────

        items: [],

        // ── Actions ──────────────────────────────────────────────────────

        addItem: (item) => {
          const { items } = get();
          const existing = items.find((i) => isSameProductVariant(i, item));

          if (existing) {
            set({
              items: items.map((i) =>
                i.localId === existing.localId ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            });
          } else {
            set({
              items: [
                ...items,
                {
                  ...item,
                  localId: generateLocalId(),
                  checked: true,
                },
              ],
            });
          }
        },

        removeItem: (localId) => {
          set({ items: get().items.filter((i) => i.localId !== localId) });
        },

        updateQuantity: (localId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(localId);
            return;
          }
          set({
            items: get().items.map((i) => (i.localId === localId ? { ...i, quantity } : i)),
          });
        },

        toggleItemCheck: (localId) => {
          set({
            items: get().items.map((i) =>
              i.localId === localId ? { ...i, checked: !i.checked } : i,
            ),
          });
        },

        toggleSelectAll: (checked) => {
          set({
            items: get().items.map((i) => ({ ...i, checked })),
          });
        },

        clearChecked: () => {
          set({ items: get().items.filter((i) => !i.checked) });
        },

        clearCart: () => {
          set({ items: [] });
        },
      }),

      // ── Persistence ────────────────────────────────────────────────────
      {
        name: 'ganesha-goods-cart',
        partialize: (state) => ({ items: state.items }),
      },
    ),
  );
