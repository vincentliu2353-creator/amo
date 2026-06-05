"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { QuoteItem } from "@/types";

const STORAGE_KEY = "amo-site-store";

interface StoreState {
  favorites: string[];
  quoteItems: QuoteItem[];
}

interface LegacyStoreState {
  favorites?: unknown;
  quote?: unknown;
  quoteItems?: unknown;
}

interface SiteStoreValue {
  favorites: string[];
  quoteItems: QuoteItem[];
  favoriteCount: number;
  quoteCount: number;
  hydrated: boolean;
  isFavorite: (slug: string) => boolean;
  inQuote: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  addToQuote: (item: QuoteItem) => void;
  updateQuoteItem: (slug: string, updates: Partial<Pick<QuoteItem, "quantity" | "notes">>) => void;
  removeFromQuote: (slug: string) => void;
  clearQuote: () => void;
}

const SiteStoreContext = createContext<SiteStoreValue | null>(null);

const initialState: StoreState = {
  favorites: [],
  quoteItems: [],
};

function formatLegacyProductName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function normalizeFavorites(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function normalizeQuoteItem(value: unknown): QuoteItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Record<string, unknown>;
  const productSlug = typeof item.product_slug === "string" ? item.product_slug.trim() : "";

  if (!productSlug) {
    return null;
  }

  const rawQuantity = typeof item.quantity === "number" ? item.quantity : Number(item.quantity);
  const quantity = Number.isFinite(rawQuantity) && rawQuantity > 0 ? Math.floor(rawQuantity) : 1;

  return {
    product_id: typeof item.product_id === "string" ? item.product_id : "",
    product_name:
      typeof item.product_name === "string" && item.product_name.trim().length > 0
        ? item.product_name
        : formatLegacyProductName(productSlug),
    product_slug: productSlug,
    product_image: typeof item.product_image === "string" ? item.product_image : "",
    quantity,
    notes: typeof item.notes === "string" ? item.notes : "",
  };
}

function normalizeQuoteItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const items = value
    .map((item) => normalizeQuoteItem(item))
    .filter((item): item is QuoteItem => Boolean(item));

  return items.reduce<QuoteItem[]>((accumulator, item) => {
    if (accumulator.some((entry) => entry.product_slug === item.product_slug)) {
      return accumulator;
    }

    accumulator.push(item);
    return accumulator;
  }, []);
}

function normalizeLegacyQuoteItems(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((slug) => ({
      product_id: "",
      product_name: formatLegacyProductName(slug),
      product_slug: slug,
      product_image: "",
      quantity: 1,
      notes: "",
    }));
}

export function SiteStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      setHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as LegacyStoreState;
      const quoteItems = normalizeQuoteItems(parsed.quoteItems);

      setState({
        favorites: normalizeFavorites(parsed.favorites),
        quoteItems: quoteItems.length > 0 ? quoteItems : normalizeLegacyQuoteItems(parsed.quote),
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  function toggleFavorite(slug: string) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        favorites: current.favorites.includes(slug)
          ? current.favorites.filter((item) => item !== slug)
          : [...current.favorites, slug],
      }));
    });
  }

  function removeFavorite(slug: string) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        favorites: current.favorites.filter((item) => item !== slug),
      }));
    });
  }

  function addToQuote(item: QuoteItem) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        quoteItems: current.quoteItems.some((entry) => entry.product_slug === item.product_slug)
          ? current.quoteItems.map((entry) =>
              entry.product_slug === item.product_slug
                ? {
                    ...entry,
                    product_id: item.product_id || entry.product_id,
                    product_name: item.product_name || entry.product_name,
                    product_image: item.product_image || entry.product_image,
                  }
                : entry,
            )
          : [...current.quoteItems, normalizeQuoteItem(item) ?? item],
      }));
    });
  }

  function updateQuoteItem(slug: string, updates: Partial<Pick<QuoteItem, "quantity" | "notes">>) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        quoteItems: current.quoteItems.map((item) => {
          if (item.product_slug !== slug) {
            return item;
          }

          const nextQuantity =
            typeof updates.quantity === "number" && Number.isFinite(updates.quantity) && updates.quantity > 0
              ? Math.floor(updates.quantity)
              : item.quantity;

          return {
            ...item,
            quantity: nextQuantity,
            notes: typeof updates.notes === "string" ? updates.notes : item.notes,
          };
        }),
      }));
    });
  }

  function removeFromQuote(slug: string) {
    startTransition(() => {
      setState((current) => ({
        ...current,
        quoteItems: current.quoteItems.filter((item) => item.product_slug !== slug),
      }));
    });
  }

  function clearQuote() {
    startTransition(() => {
      setState((current) => ({
        ...current,
        quoteItems: [],
      }));
    });
  }

  const value: SiteStoreValue = {
    favorites: state.favorites,
    quoteItems: state.quoteItems,
    favoriteCount: state.favorites.length,
    quoteCount: state.quoteItems.length,
    hydrated,
    isFavorite: (slug) => state.favorites.includes(slug),
    inQuote: (slug) => state.quoteItems.some((item) => item.product_slug === slug),
    toggleFavorite,
    removeFavorite,
    addToQuote,
    updateQuoteItem,
    removeFromQuote,
    clearQuote,
  };

  return <SiteStoreContext.Provider value={value}>{children}</SiteStoreContext.Provider>;
}

export function useSiteStore() {
  const context = useContext(SiteStoreContext);

  if (!context) {
    throw new Error("useSiteStore must be used within SiteStoreProvider.");
  }

  return context;
}
