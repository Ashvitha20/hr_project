import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPublicJobs,
  getPublicJobFilters,
  getPublicJobById,
  getManagedJobs,
  createJob,
  updateJob,
  closeJob,
  reopenJob,
  deleteJob,
} from '../../services/jobService';

export const jobKeys = {
  all: ['jobs'],
  public: (params) => [...jobKeys.all, 'public', params],
  publicFilters: () => [...jobKeys.all, 'public-filters'],
  publicDetail: (jobId) => [...jobKeys.all, 'public-detail', jobId],
  managed: (params) => [...jobKeys.all, 'managed', params],
};

// ---- Public (Careers page) ----

// JobListingPage.jsx
export function usePublicJobs(params = {}) {
  return useQuery({
    queryKey: jobKeys.public(params),
    queryFn: () => getPublicJobs(params),
    keepPreviousData: true,
  });
}

// JobListingPage.jsx department/employment-type <Select> filters
export function usePublicJobFilters() {
  return useQuery({
    queryKey: jobKeys.publicFilters(),
    queryFn: getPublicJobFilters,
  });
}

// JobDetailPage.jsx / ApplyJobPage.jsx
export function usePublicJob(jobId) {
  return useQuery({
    queryKey: jobKeys.publicDetail(jobId),
    queryFn: () => getPublicJobById(jobId),
    enabled: Boolean(jobId),
  });
}

// ---- HR/Admin management ----

export function useManagedJobs(params = {}) {
  return useQuery({
    queryKey: jobKeys.managed(params),
    queryFn: () => getManagedJobs(params),
    keepPreviousData: true,
  });
}

function useInvalidateManagedJobs() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: jobKeys.all });
  };
}

export function useCreateJob() {
  const invalidate = useInvalidateManagedJobs();
  return useMutation({
    mutationFn: (payload) => createJob(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateJob() {
  const invalidate = useInvalidateManagedJobs();
  return useMutation({
    mutationFn: ({ jobId, payload }) => updateJob(jobId, payload),
    onSuccess: invalidate,
  });
}

export function useCloseJob() {
  const invalidate = useInvalidateManagedJobs();
  return useMutation({
    mutationFn: (jobId) => closeJob(jobId),
    onSuccess: invalidate,
  });
}

export function useReopenJob() {
  const invalidate = useInvalidateManagedJobs();
  return useMutation({
    mutationFn: (jobId) => reopenJob(jobId),
    onSuccess: invalidate,
  });
}

export function useDeleteJob() {
  const invalidate = useInvalidateManagedJobs();
  return useMutation({
    mutationFn: (jobId) => deleteJob(jobId),
    onSuccess: invalidate,
  });
}