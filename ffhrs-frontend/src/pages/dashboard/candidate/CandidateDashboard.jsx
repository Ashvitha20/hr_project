import { Grid, Card, CardContent, Typography, Box, Avatar, LinearProgress, Alert } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { PageLoader } from '../../../components/common/Loader';
import { useCandidateDashboardSummary } from '../../../features/dashboard/dashboardQueries';

export default function CandidateDashboard() {
  const { data, isLoading, isError, error } = useCandidateDashboardSummary();
  const summary = data?.data;

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load your dashboard right now.'}
      </Alert>
    );
  }

  // Saved Jobs / Notifications aren't backed by a feature yet, so they show 0
  // rather than a fabricated number — see dashboard.service.js on the backend.
  const stats = [
    { label: 'Applied Jobs', value: summary?.appliedJobs ?? 0, icon: <WorkOutlineIcon /> },
    { label: 'Saved Jobs', value: summary?.savedJobs ?? 0, icon: <BookmarkIcon /> },
    {
      label: 'Interviews Scheduled',
      value: summary?.interviewsScheduled ?? 0,
      icon: <EventAvailableIcon />,
    },
    { label: 'Notifications', value: summary?.notifications ?? 0, icon: <NotificationsIcon /> },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Welcome back 👋</Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
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

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Profile Completeness</Typography>
          <LinearProgress variant="determinate" value={65} color="secondary" sx={{ height: 8, borderRadius: 4, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            65% complete — add your certificates and a portfolio project to reach 100%.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}