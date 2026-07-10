import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
  activateUser,
  deleteUser,
} from '../../services/userService';

export const userKeys = {
  all: ['users'],
  list: (params) => [...userKeys.all, 'list', params],
  detail: (userId) => [...userKeys.all, 'detail', userId],
};

// ManageUsersPage.jsx / ManageRolesPage.jsx
export function useUsers(params = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    keepPreviousData: true,
  });
}

export function useUser(userId) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId),
  });
}

function useInvalidateUsers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: userKeys.all });
  };
}

// ManageUsersPage.jsx edit / ManageRolesPage.jsx role change
export function useUpdateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    onSuccess: invalidate,
  });
}

export function useDeactivateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (userId) => deactivateUser(userId),
    onSuccess: invalidate,
  });
}

export function useActivateUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (userId) => activateUser(userId),
    onSuccess: invalidate,
  });
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers();
  return useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: invalidate,
  });
}