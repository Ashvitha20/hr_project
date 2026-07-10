import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPublicBlogPosts,
  getPublicBlogPostBySlug,
  getManagedBlogPosts,
  createBlogPost,
  updateBlogPost,
  publishBlogPost,
  unpublishBlogPost,
  deleteBlogPost,
} from '../../services/blogService';

export const blogKeys = {
  all: ['blog'],
  public: (params) => [...blogKeys.all, 'public', params],
  publicDetail: (slug) => [...blogKeys.all, 'public-detail', slug],
  managed: (params) => [...blogKeys.all, 'managed', params],
};

// ---- Public (Blog pages) ----

// BlogListPage.jsx
export function usePublicBlogPosts(params = {}) {
  return useQuery({
    queryKey: blogKeys.public(params),
    queryFn: () => getPublicBlogPosts(params),
    keepPreviousData: true,
  });
}

// BlogDetailPage.jsx
export function usePublicBlogPost(slug) {
  return useQuery({
    queryKey: blogKeys.publicDetail(slug),
    queryFn: () => getPublicBlogPostBySlug(slug),
    enabled: Boolean(slug),
  });
}

// ---- Admin management ----

// ManageBlogsPage.jsx
export function useManagedBlogPosts(params = {}) {
  return useQuery({
    queryKey: blogKeys.managed(params),
    queryFn: () => getManagedBlogPosts(params),
    keepPreviousData: true,
  });
}

function useInvalidateBlog() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: blogKeys.all });
  };
}

export function useCreateBlogPost() {
  const invalidate = useInvalidateBlog();
  return useMutation({
    mutationFn: (payload) => createBlogPost(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateBlogPost() {
  const invalidate = useInvalidateBlog();
  return useMutation({
    mutationFn: ({ blogId, payload }) => updateBlogPost(blogId, payload),
    onSuccess: invalidate,
  });
}

export function usePublishBlogPost() {
  const invalidate = useInvalidateBlog();
  return useMutation({
    mutationFn: (blogId) => publishBlogPost(blogId),
    onSuccess: invalidate,
  });
}

export function useUnpublishBlogPost() {
  const invalidate = useInvalidateBlog();
  return useMutation({
    mutationFn: (blogId) => unpublishBlogPost(blogId),
    onSuccess: invalidate,
  });
}

export function useDeleteBlogPost() {
  const invalidate = useInvalidateBlog();
  return useMutation({
    mutationFn: (blogId) => deleteBlogPost(blogId),
    onSuccess: invalidate,
  });
}