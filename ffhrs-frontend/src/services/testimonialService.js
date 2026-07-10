import axiosClient from '../api/axiosClient';

/**
 * Testimonial API layer.
 * Public endpoint backs TestimonialsPage.jsx / HomePage.jsx testimonials section (GET /testimonials).
 * Management endpoints back ManageTestimonialsPage.jsx (GET/POST /admin/testimonials, PUT/PATCH/DELETE /admin/testimonials/:testimonialId).
 */

// ---- Public (Testimonials page / Homepage) ----
export async function getPublicTestimonials() {
  const { data } = await axiosClient.get('/testimonials');
  return data;
}

// ---- Admin management ----
export async function getManagedTestimonials(params = {}) {
  const { data } = await axiosClient.get('/admin/testimonials', { params });
  return data;
}

export async function createTestimonial(payload) {
  const { data } = await axiosClient.post('/admin/testimonials', payload);
  return data;
}

export async function updateTestimonial(testimonialId, payload) {
  const { data } = await axiosClient.put(`/admin/testimonials/${testimonialId}`, payload);
  return data;
}

export async function approveTestimonial(testimonialId) {
  const { data } = await axiosClient.patch(`/admin/testimonials/${testimonialId}/approve`);
  return data;
}

export async function rejectTestimonial(testimonialId) {
  const { data } = await axiosClient.patch(`/admin/testimonials/${testimonialId}/reject`);
  return data;
}

export async function deleteTestimonial(testimonialId) {
  const { data } = await axiosClient.delete(`/admin/testimonials/${testimonialId}`);
  return data;
}