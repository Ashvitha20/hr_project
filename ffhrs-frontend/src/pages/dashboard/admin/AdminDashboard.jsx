import { useQuery } from '@tanstack/react-query';
import { Grid, Card, CardContent, Typography, Box, Avatar, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { PageLoader } from '../../../components/common/Loader';
import { useHRDashboardSummary } from '../../../features/dashboard/dashboardQueries';
import axiosClient from '../../../api/axiosClient';

// Admin sees the same summary endpoint as HR (backend applies no job-ownership
// restriction for the 'admin' role — see dashboard.service.js#getVisibleJobIdsForRequester),
// so counts here reflect the entire platform, not just one recruiter's postings.
function useContactMessageCount() {
  return useQuery({
    queryKey: ['admin', 'contact-message-count'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/admin/contact-messages', { params: { limit: 1 } });
      return data?.data?.pagination?.total ?? 0;
    },
  });
}

export default function AdminDashboard() {
  const { data, isLoading, isError, error } = useHRDashboardSummary();
  const { data: messageCount, isLoading: isMessagesLoading } = useContactMessageCount();
  const summary = data?.data;

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load dashboard data right now.'}
      </Alert>
    );
  }

  // "Total Users" and "Blog Posts" from the original placeholder aren't shown
  // here — there's no admin user-listing endpoint or Blog model in the backend
  // yet, so rather than fabricate numbers we only show metrics that are real.
  const stats = [
    { label: 'Total Jobs', value: summary?.totalJobs ?? 0, icon: <WorkIcon /> },
    { label: 'Total Candidates', value: summary?.totalCandidates ?? 0, icon: <PeopleIcon /> },
    { label: 'Applications Received', value: summary?.applicationsReceived ?? 0, icon: <DescriptionIcon /> },
    {
      label: 'Contact Messages',
      value: isMessagesLoading ? '—' : messageCount ?? 0,
      icon: <MailOutlineIcon />,
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Admin Overview</Typography>
      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>{s.icon}</Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{s.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{summary?.openJobs ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Open Jobs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{summary?.shortlisted ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Shortlisted</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{summary?.selected ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Selected</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{summary?.rejected ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Rejected</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}