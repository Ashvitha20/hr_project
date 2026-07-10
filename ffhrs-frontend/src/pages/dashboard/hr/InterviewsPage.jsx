import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Alert,
  Tabs,
  Tab,
  Button,
  Divider,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { PageLoader } from '../../../components/common/Loader';
import { useAllInterviews } from '../../../features/applications/hrApplicationQueries';

const TABS = [
  { value: '', label: 'All' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_META = {
  scheduled: { label: 'Scheduled', color: 'secondary' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'default' },
  rescheduled: { label: 'Rescheduled', color: 'warning' },
};

export default function InterviewsPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading, isError, error } = useAllInterviews({ status: status || undefined });

  const interviews = data?.data?.interviews || [];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Interviews
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Interviews you've scheduled across all candidates.
      </Typography>

      <Tabs
        value={status}
        onChange={(_e, val) => setStatus(val)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {isLoading && <PageLoader />}

      {isError && (
        <Alert severity="error">
          {error?.response?.data?.message || 'Could not load interviews right now.'}
        </Alert>
      )}

      {!isLoading && !isError && interviews.length === 0 && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary">
              No interviews found for this filter.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Stack spacing={2}>
        {interviews.map((interview) => {
          const meta = STATUS_META[interview.status] || STATUS_META.scheduled;
          return (
            <Card variant="outlined" sx={{ borderRadius: 3 }} key={interview.id}>
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
                      {interview.candidate?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interview.job?.title} • {interview.job?.company}
                    </Typography>
                  </Box>
                  <Chip size="small" label={meta.label} color={meta.color} />
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack direction="row" spacing={3} flexWrap="wrap" rowGap={1}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <EventIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {new Date(interview.interviewDate).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography variant="body2">{interview.interviewTime}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2">{interview.candidate?.email}</Typography>
                  </Stack>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    component={RouterLink}
                    to={`/hr/applicants/${interview.application}`}
                  >
                    View Application
                  </Button>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}