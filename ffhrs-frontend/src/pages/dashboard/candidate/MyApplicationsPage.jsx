import { PageLoader as Loader } from '../../../components/common/Loader';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Alert,
} from '@mui/material';

import { useMyApplications } from '../../../features/applications/applicationQueries';

const statusColor = {
  Applied: 'default',
  'Application Viewed': 'info',
  'Under Review': 'info',
  Shortlisted: 'secondary',
  'Interview Scheduled': 'secondary',
  'Interview Completed': 'secondary',
  Selected: 'success',
  Rejected: 'error',
};

export default function MyApplicationsPage() {
  const { data, isLoading, isError, error } = useMyApplications();
  const applications = data?.data || [];

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load your applications right now.'}
      </Alert>
    );
  }

  if (applications.length === 0) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          My Applications
        </Typography>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              You haven't applied to any jobs yet.
            </Typography>
            <Button variant="contained" color="secondary" component={RouterLink} to="/careers">
              Browse Open Roles
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        My Applications
      </Typography>
      <Stack spacing={2}>
        {applications.map((app) => (
          <Card variant="outlined" sx={{ borderRadius: 3 }} key={app.id}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {app.job?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.job?.company}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip label={app.status} color={statusColor[app.status] || 'default'} />
              </Stack>

              {app.interview?.scheduledAt && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Interview scheduled for {new Date(app.interview.scheduledAt).toLocaleString()} (
                  {app.interview.mode})
                </Alert>
              )}

              <Box sx={{ mt: 2 }}>
                <Button size="small" variant="outlined" component={RouterLink} to={`/candidate/applications/${app.id}`}>
                  View Details
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
