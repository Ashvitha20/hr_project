import { Box, Typography, Card, CardContent, Chip, Stack, Alert, Link, Divider } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonIcon from '@mui/icons-material/Person';
import { PageLoader } from '../../../components/common/Loader';
import { useMyInterviews } from '../../../features/candidate/candidateQueries';

const STATUS_META = {
  scheduled: { label: 'Scheduled', color: 'secondary' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'default' },
  rescheduled: { label: 'Rescheduled', color: 'warning' },
};

export default function InterviewSchedulePage() {
  const { data, isLoading, isError, error } = useMyInterviews();
  const interviews = data?.data?.interviews || [];

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load your interview schedule right now.'}
      </Alert>
    );
  }

  if (interviews.length === 0) {
    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Interview Schedule
        </Typography>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary">
              You have no upcoming interviews right now. Check back once an employer schedules one.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Interview Schedule
      </Typography>
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
                      {interview.job?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {interview.job?.company} • {interview.job?.location}
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
                    <Typography variant="body2">{interview.interviewerName}</Typography>
                  </Stack>
                  {interview.mode === 'online' && interview.meetingLink ? (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <VideocamIcon fontSize="small" color="action" />
                      <Link href={interview.meetingLink} target="_blank" rel="noopener">
                        Join meeting
                      </Link>
                    </Stack>
                  ) : interview.location ? (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PlaceIcon fontSize="small" color="action" />
                      <Typography variant="body2">{interview.location}</Typography>
                    </Stack>
                  ) : null}
                </Stack>

                {interview.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {interview.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}