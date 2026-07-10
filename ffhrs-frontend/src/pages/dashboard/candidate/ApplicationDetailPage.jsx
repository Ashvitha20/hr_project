import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { PageLoader as Loader } from '../../../components/common/Loader';
import { useMyApplicationDetail } from '../../../features/applications/applicationQueries';

const statusFlow = [
  'Applied',
  'Application Viewed',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Interview Completed',
  'Selected',
];

export default function ApplicationDetailPage() {
  const { applicationId } = useParams();
  const { data, isLoading, isError, error } = useMyApplicationDetail(applicationId);
  const application = data?.data;

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load this application.'}
      </Alert>
    );
  }

  if (!application) return null;

  const isRejected = application.status === 'Rejected';
  const activeStepIndex = isRejected
    ? statusFlow.length
    : statusFlow.indexOf(application.status);

  return (
    <Box>
      <Button component={RouterLink} to="/candidate/applications" sx={{ mb: 2 }}>
        ← Back to My Applications
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {application.job?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {application.job?.company} · {application.job?.location}
              </Typography>
            </Box>
            <Chip
              label={application.status}
              color={isRejected ? 'error' : 'secondary'}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {isRejected ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          This application was not selected to move forward.
          {application.recruiterComments ? ` Recruiter notes: ${application.recruiterComments}` : ''}
        </Alert>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Application Progress
            </Typography>
            <Stepper activeStep={activeStepIndex} alternativeLabel sx={{ overflowX: 'auto' }}>
              {statusFlow.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      )}

      {application.interview && (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Interview Details
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2">
                Date & Time:{' '}
                {application.interview.scheduledAt
                  ? new Date(application.interview.scheduledAt).toLocaleString()
                  : 'To be confirmed'}
              </Typography>
              <Typography variant="body2">Mode: {application.interview.mode}</Typography>
              {application.interview.mode === 'Online' && application.interview.meetingLink && (
                <Typography variant="body2">
                  Meeting Link:{' '}
                  <a href={application.interview.meetingLink} target="_blank" rel="noreferrer">
                    {application.interview.meetingLink}
                  </a>
                </Typography>
              )}
              {application.interview.mode === 'Offline' && application.interview.location && (
                <Typography variant="body2">Location: {application.interview.location}</Typography>
              )}
              {application.interview.interviewerName && (
                <Typography variant="body2">Interviewer: {application.interview.interviewerName}</Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
            Submitted Details
          </Typography>
          <Typography variant="body2">Resume: {application.resume?.originalName || 'Uploaded'}</Typography>
          <Typography variant="body2">
            Applied on: {new Date(application.createdAt).toLocaleDateString()}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary">
            Skills: {application.skills?.join(', ') || '—'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
