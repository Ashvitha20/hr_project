import { Grid, Card, CardContent, Typography, Box, Avatar, Alert } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { PageLoader } from '../../../components/common/Loader';
import { useHRDashboardSummary } from '../../../features/dashboard/dashboardQueries';

export default function HRDashboard() {
  const { data, isLoading, isError, error } = useHRDashboardSummary();
  const summary = data?.data;

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load dashboard data right now.'}
      </Alert>
    );
  }

  const stats = [
    { label: 'Open Jobs', value: summary?.openJobs ?? 0, icon: <WorkIcon /> },
    { label: 'Total Applicants', value: summary?.totalApplicants ?? 0, icon: <PeopleIcon /> },
    {
      label: 'Interviews This Week',
      value: summary?.interviewsThisWeek ?? 0,
      icon: <EventAvailableIcon />,
    },
    { label: 'Offers Pending', value: summary?.offersPending ?? 0, icon: <MailOutlineIcon /> },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>HR Overview</Typography>
      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{s.icon}</Avatar>
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
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{summary?.totalJobs ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Total Jobs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{summary?.totalCandidates ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Total Candidates</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{summary?.pendingReview ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Pending Review</Typography>
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
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{summary?.interviewScheduled ?? 0}</Typography>
              <Typography variant="body2" color="text.secondary">Interview Scheduled</Typography>
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