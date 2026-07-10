import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPublicTestimonials,
  getManagedTestimonials,
  createTestimonial,
  updateTestimonial,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial,
} from '../../services/testimonialService';

export const testimonialKeys = {
  all: ['testimonials'],
  public: () => [...testimonialKeys.all, 'public'],
  managed: (params) => [...testimonialKeys.all, 'managed', params],
};

// ---- Public (Testimonials page / Homepage) ----

// TestimonialsPage.jsx / HomePage.jsx
export function usePublicTestimonials() {
  return useQuery({
    queryKey: testimonialKeys.public(),
    queryFn: getPublicTestimonials,
  });
}

// ---- Admin management ----

// ManageTestimonialsPage.jsx
export function useManagedTestimonials(params = {}) {
  return useQuery({
    queryKey: testimonialKeys.managed(params),
    queryFn: () => getManagedTestimonials(params),
    keepPreviousData: true,
  });
}

function useInvalidateTestimonials() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
  };
}

export function useCreateTestimonial() {
  const invalidate = useInvalidateTestimonials();
  return useMutation({
    mutationFn: (payload) => createTestimonial(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateTestimonial() {
  const invalidate = useInvalidateTestimonials();
  return useMutation({
    mutationFn: ({ testimonialId, payload }) => updateTestimonial(testimonialId, payload),
    onSuccess: invalidate,
  });
}

export function useApproveTestimonial() {
  const invalidate = useInvalidateTestimonials();
  return useMutation({
    mutationFn: (testimonialId) => approveTestimonial(testimonialId),
    onSuccess: invalidate,
  });
}

export function useRejectTestimonial() {
  const invalidate = useInvalidateTestimonials();
  return useMutation({
    mutationFn: (testimonialId) => rejectTestimonial(testimonialId),
    onSuccess: invalidate,
  });
}

export function useDeleteTestimonial() {
  const invalidate = useInvalidateTestimonials();
  return useMutation({
    mutationFn: (testimonialId) => deleteTestimonial(testimonialId),
    onSuccess: invalidate,
  });
}