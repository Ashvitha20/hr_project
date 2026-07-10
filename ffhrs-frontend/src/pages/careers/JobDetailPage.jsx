import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Chip,
  Button,
  Box,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { usePublicJob } from '../../features/jobs/jobQueries';
import JobCard from '../../components/common/JobCard';
import { PageLoader } from '../../components/common/Loader';
import NotFoundPage from '../public/NotFoundPage';

export default function JobDetailPage() {
  const { jobId } = useParams();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data, isLoading, isError } = usePublicJob(jobId);

  if (isLoading) return <PageLoader />;
  if (isError || !data?.data?.job) return <NotFoundPage />;

  const { job, relatedJobs = [] } = data.data;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={8}>
          <Chip label={job.employmentType} color="secondary" size="small" sx={{ mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.dark' }}>{job.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>{job.company}</Typography>

          <Stack direction="row" spacing={3} sx={{ mt: 2, color: 'text.secondary' }} flexWrap="wrap">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PlaceIcon fontSize="small" /> <Typography variant="body2">{job.location}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <WorkOutlineIcon fontSize="small" /> <Typography variant="body2">{job.experience}</Typography>
            </Stack>
          </Stack>

          {job.status !== 'open' && (
            <Alert severity="warning" sx={{ mt: 3 }}>
              This posting is no longer accepting applications.
            </Alert>
          )}

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Job Description</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{job.description}</Typography>

          {job.responsibilities?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Responsibilities</Typography>
              <List sx={{ mb: 3 }}>
                {job.responsibilities.map((r) => (
                  <ListItem key={r} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlineIcon fontSize="small" color="secondary" /></ListItemIcon>
                    {r}
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {job.requirements?.length > 0 && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Requirements</Typography>
              <List>
                {job.requirements.map((r) => (
                  <ListItem key={r} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}><CheckCircleOutlineIcon fontSize="small" color="secondary" /></ListItemIcon>
                    {r}
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {relatedJobs.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Related Jobs</Typography>
              <Grid container spacing={2}>
                {relatedJobs.map((rj) => (
                  <Grid item xs={12} sm={6} key={rj.id}><JobCard job={rj} /></Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 3, position: 'sticky', top: 90 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Salary</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark', mb: 2 }}>{job.salary}</Typography>

              <Button
                fullWidth
                size="large"
                variant="contained"
                color="secondary"
                component={Link}
                to={`/careers/${job.id}/apply`}
                disabled={job.status !== 'open'}
                sx={{ mb: 1.5 }}
              >
                {job.status !== 'open' ? 'Closed' : isAuthenticated ? 'Apply Now' : 'Login to Apply'}
              </Button>
              <Stack direction="row" spacing={1}>
                <Button fullWidth variant="outlined" startIcon={<BookmarkBorderIcon />}>Save</Button>
                <Button fullWidth variant="outlined" startIcon={<ShareIcon />}>Share</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}