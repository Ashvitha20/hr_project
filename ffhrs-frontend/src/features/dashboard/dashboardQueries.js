import { useQuery } from '@tanstack/react-query';
import {
  getCandidateDashboardSummary,
  getHRDashboardSummary,
  getAdminDashboardSummary,
} from '../../services/dashboardService';

export const dashboardKeys = {
  all: ['dashboard'],
  candidate: () => [...dashboardKeys.all, 'candidate'],
  hr: () => [...dashboardKeys.all, 'hr'],
  admin: () => [...dashboardKeys.all, 'admin'],
};

// CandidateDashboard.jsx
export function useCandidateDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.candidate(),
    queryFn: getCandidateDashboardSummary,
  });
}

// HRDashboard.jsx
export function useHRDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.hr(),
    queryFn: getHRDashboardSummary,
  });
}

// AdminDashboard.jsx
export function useAdminDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.admin(),
    queryFn: getAdminDashboardSummary,
  });
}