// src/hooks/categories/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { getBrands } from "../../api/brands";

const brandsKey = (params = {}) => ["brands", params];

export function useBrands(params = {}) {
  return useQuery({
    queryKey: brandsKey(params),
    queryFn: () => getBrands(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    select: (payload) => {
      const items = Array.isArray(payload?.data) ? payload.data : [];

      const rows = items.map((it, idx) => ({
        id: it._id || it.id || idx,
        name: it.name || "",
        ar_name: it.ar_name || "",
        logo: it.logo || "",
      }));

      return {
        rows,
        success: payload?.success ?? true,
        message: payload?.message ?? "",
      };
    },
  });
}
