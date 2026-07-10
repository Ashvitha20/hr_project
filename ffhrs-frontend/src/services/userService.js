import axiosClient from '../api/axiosClient';

/**
 * Admin user management API layer.
 * Backs ManageUsersPage.jsx and ManageRolesPage.jsx (role field is edited via the
 * same PUT /admin/users/:userId endpoint since role lives on the User document).
 */

export async function getUsers(params = {}) {
  const { data } = await axiosClient.get('/admin/users', { params });
  return data;
}

export async function getUserById(userId) {
  const { data } = await axiosClient.get(`/admin/users/${userId}`);
  return data;
}

export async function updateUser(userId, payload) {
  const { data } = await axiosClient.put(`/admin/users/${userId}`, payload);
  return data;
}

export async function deactivateUser(userId) {
  const { data } = await axiosClient.patch(`/admin/users/${userId}/deactivate`);
  return data;
}

export async function activateUser(userId) {
  const { data } = await axiosClient.patch(`/admin/users/${userId}/activate`);
  return data;
}

export async function deleteUser(userId) {
  const { data } = await axiosClient.delete(`/admin/users/${userId}`);
  return data;
}