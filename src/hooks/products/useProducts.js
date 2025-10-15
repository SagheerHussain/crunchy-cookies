// client/src/hooks/products/useProducts.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductsInFlowerInVases,
  getTopSoldProducts,
  getProductsInChocolatesOrHandBouquets,
  getProductsForFriendsOccasion,
  getProductsInPerfumes,
  getProductsInPreservedFlowers,
  getFeaturedProducts,
} from "../../api/products";

// ---------- 30 minutes (ms) ----------
const THIRTY_MIN = 30 * 60 * 1000;

// Default options for product queries
const defaultQueryOpts = {
  staleTime: THIRTY_MIN, // data fresh for 30 mins (no auto refetch)
  cacheTime: THIRTY_MIN, // GC after 30 mins of inactivity
  refetchOnWindowFocus: false,
  keepPreviousData: true, // good for pagination
};

// --------- query key helpers (to keep keys stable) ----------
const qk = {
  all: ["products"],
  lists: (params) => ["products", "list", params || {}],
  filtered: (params) => ["products", "filtered", params || {}],
  names: ["products", "names"],
  detail: (id) => ["products", "detail", id],

  // custom lists
  inFlowerInVases: (params) => ["products", "inFlowerInVases", params || {}],
  topSold: (limit = 1) => ["products", "topSold", { limit }],
  inChocolatesOrHandBouquets: (params) => ["products", "inChocOrBouquets", params || {}],
  friendsOccasion: (params) => ["products", "friendsOccasion", params || {}],
  inPerfumes: (params) => ["products", "inPerfumes", params || {}],
  inPreservedFlowers: (params) => ["products", "inPreservedFlowers", params || {}],
  featured: (params) => ["products", "featured", params || {}],
};

/* ============================= QUERIES ============================= */


// ----------- custom lists -----------
export function useProductsInFlowerInVases(params) {
  return useQuery({
    queryKey: qk.inFlowerInVases(params),
    queryFn: () => getProductsInFlowerInVases(params),
    ...defaultQueryOpts,
  });
}

export function useTopSoldProducts(limit = 1, { enabled = true } = {}) {
  return useQuery({
    queryKey: qk.topSold(limit),
    queryFn: () => getTopSoldProducts(limit),
    enabled,
    ...defaultQueryOpts,
  });
}

export function useProductsInChocolatesOrHandBouquets(params) {
  return useQuery({
    queryKey: qk.inChocolatesOrHandBouquets(params),
    queryFn: () => getProductsInChocolatesOrHandBouquets(params),
    ...defaultQueryOpts,
  });
}

export function useProductsForFriendsOccasion(params) {
  return useQuery({
    queryKey: qk.friendsOccasion(params),
    queryFn: () => getProductsForFriendsOccasion(params),
    ...defaultQueryOpts,
  });
}

export function useProductsInPerfumes(params) {
  return useQuery({
    queryKey: qk.inPerfumes(params),
    queryFn: () => getProductsInPerfumes(params),
    ...defaultQueryOpts,
  });
}

export function useProductsInPreservedFlowers(params) {
  return useQuery({
    queryKey: qk.inPreservedFlowers(params),
    queryFn: () => getProductsInPreservedFlowers(params),
    ...defaultQueryOpts,
  });
}

export function useFeaturedProducts(params) {
  return useQuery({
    queryKey: qk.featured(params),
    queryFn: () => getFeaturedProducts(params),
    ...defaultQueryOpts,
  });
}


