import axiosClient from '../api/axiosClient';

/**
 * Offer Letters API layer.
 * Backs OffersPage.jsx (GET/POST /hr/offers, PUT/PATCH/DELETE /hr/offers/:offerId).
 * Mirrors the backend's offer.routes.js exactly.
 */

// GET /hr/offers?status=&page=&limit=
export async function getOffers(params = {}) {
  const { data } = await axiosClient.get('/hr/offers', { params });
  return data;
}

// POST /hr/offers — "Send Offer" from a selected application
// payload: { applicationId, position, salary, joiningDate, expiryDate?, notes? }
export async function createOffer(payload) {
  const { data } = await axiosClient.post('/hr/offers', payload);
  return data;
}

// PUT /hr/offers/:offerId
export async function updateOffer(offerId, payload) {
  const { data } = await axiosClient.put(`/hr/offers/${offerId}`, payload);
  return data;
}

// PATCH /hr/offers/:offerId/send
export async function sendOffer(offerId) {
  const { data } = await axiosClient.patch(`/hr/offers/${offerId}/send`);
  return data;
}

// PATCH /hr/offers/:offerId/withdraw
export async function withdrawOffer(offerId) {
  const { data } = await axiosClient.patch(`/hr/offers/${offerId}/withdraw`);
  return data;
}

// DELETE /hr/offers/:offerId
export async function deleteOffer(offerId) {
  const { data } = await axiosClient.delete(`/hr/offers/${offerId}`);
  return data;
}