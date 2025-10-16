import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createWishlist, deleteWishlist } from '../../api/wishlist';

export function useAddWishlist(userId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars) => createWishlist(vars), // { user, product }
    retry: 0,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist', userId] }),
  });
}

export function useDeleteWishlist(userId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars) => deleteWishlist(vars), // { user, product }
    retry: 0,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist', userId] }),
  });
}
