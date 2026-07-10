import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getOffers,
  createOffer,
  updateOffer,
  sendOffer,
  withdrawOffer,
  deleteOffer,
} from '../../services/offerService';

export const offerKeys = {
  all: ['offers'],
  list: (params) => [...offerKeys.all, 'list', params],
};

// OffersPage.jsx
export function useOffers(params = {}) {
  return useQuery({
    queryKey: offerKeys.list(params),
    queryFn: () => getOffers(params),
    keepPreviousData: true,
  });
}

function useInvalidateOffers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: offerKeys.all });
  };
}

export function useCreateOffer() {
  const invalidate = useInvalidateOffers();
  return useMutation({
    mutationFn: (payload) => createOffer(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateOffer() {
  const invalidate = useInvalidateOffers();
  return useMutation({
    mutationFn: ({ offerId, payload }) => updateOffer(offerId, payload),
    onSuccess: invalidate,
  });
}

export function useSendOffer() {
  const invalidate = useInvalidateOffers();
  return useMutation({
    mutationFn: (offerId) => sendOffer(offerId),
    onSuccess: invalidate,
  });
}

export function useWithdrawOffer() {
  const invalidate = useInvalidateOffers();
  return useMutation({
    mutationFn: (offerId) => withdrawOffer(offerId),
    onSuccess: invalidate,
  });
}

export function useDeleteOffer() {
  const invalidate = useInvalidateOffers();
  return useMutation({
    mutationFn: (offerId) => deleteOffer(offerId),
    onSuccess: invalidate,
  });
}