import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Chip, Stack, Button, Alert } from '@mui/material';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import { PageLoader } from '../../../components/common/Loader';
import { useSavedJobs, useUnsaveJob } from '../../../features/candidate/candidateQueries';

export default function SavedJobsPage() {
  const { data, isLoading, isError, error } = useSavedJobs();
  const unsaveMutation = useUnsaveJob();

  const savedJobs = data?.data?.savedJobs || [];

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load your saved jobs right now.'}
      </Alert>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Saved Jobs
        </Typography>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              You haven't saved any jobs yet.
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
        Saved Jobs
      </Typography>

      {unsaveMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {unsaveMutation.error?.response?.data?.message || 'Could not remove this job.'}
        </Alert>
      )}

      <Stack spacing={2}>
        {savedJobs.map((job) => (
          <Card variant="outlined" sx={{ borderRadius: 3 }} key={job.id}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                flexWrap="wrap"
                gap={1}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.company} • {job.location}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    <Chip size="small" label={job.department} variant="outlined" />
                    <Chip size="small" label={job.employmentType} variant="outlined" />
                  </Stack>
                </Box>
                <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700 }}>
                  {job.salary}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                <Button size="small" variant="outlined" component={RouterLink} to={`/careers/${job.id}`}>
                  View Details
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<BookmarkRemoveIcon fontSize="small" />}
                  onClick={() => unsaveMutation.mutate(job.id)}
                  disabled={unsaveMutation.isPending}
                >
                  Remove
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}