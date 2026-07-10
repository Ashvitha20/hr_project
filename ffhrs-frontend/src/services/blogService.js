import axiosClient from '../api/axiosClient';

/**
 * Blog API layer.
 * Public endpoints back BlogListPage.jsx/BlogDetailPage.jsx (GET /blog, /blog/:slug).
 * Management endpoints back ManageBlogsPage.jsx (GET/POST /admin/blogs, PUT/PATCH/DELETE /admin/blogs/:blogId).
 */

// ---- Public (Blog pages) ----
export async function getPublicBlogPosts(params = {}) {
  const { data } = await axiosClient.get('/blog', { params });
  return data;
}

export async function getPublicBlogPostBySlug(slug) {
  const { data } = await axiosClient.get(`/blog/${slug}`);
  return data;
}

// ---- Admin management ----
export async function getManagedBlogPosts(params = {}) {
  const { data } = await axiosClient.get('/admin/blogs', { params });
  return data;
}

export async function createBlogPost(payload) {
  const { data } = await axiosClient.post('/admin/blogs', payload);
  return data;
}

export async function updateBlogPost(blogId, payload) {
  const { data } = await axiosClient.put(`/admin/blogs/${blogId}`, payload);
  return data;
}

export async function publishBlogPost(blogId) {
  const { data } = await axiosClient.patch(`/admin/blogs/${blogId}/publish`);
  return data;
}

export async function unpublishBlogPost(blogId) {
  const { data } = await axiosClient.patch(`/admin/blogs/${blogId}/unpublish`);
  return data;
}

export async function deleteBlogPost(blogId) {
  const { data } = await axiosClient.delete(`/admin/blogs/${blogId}`);
  return data;
}