import { useState } from 'react';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Alert,
  Divider,
  List,
  ListItem,
  TextField,
  Menu,
  MenuItem,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageLoader } from '../../../components/common/Loader';
import {
  useApplicationDetail,
  useUpdateApplicationStatus,
} from '../../../features/applications/hrApplicationQueries';
import ScheduleInterviewModal from '../../../components/hr/ScheduleInterviewModal';

const STATUS_META = {
  applied: { label: 'Applied', color: 'default' },
  viewed: { label: 'Application Viewed', color: 'info' },
  under_review: { label: 'Under Review', color: 'info' },
  shortlisted: { label: 'Shortlisted', color: 'secondary' },
  interview_scheduled: { label: 'Interview Scheduled', color: 'secondary' },
  interview_completed: { label: 'Interview Completed', color: 'secondary' },
  selected: { label: 'Selected', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

// Next-step suggestions per current status — kept short and non-exhaustive;
// "Update Status" dropdown below still allows any valid transition.
const NEXT_STATUS_SUGGESTIONS = {
  applied: ['under_review', 'shortlisted', 'rejected'],
  viewed: ['under_review', 'shortlisted', 'rejected'],
  under_review: ['shortlisted', 'rejected'],
  shortlisted: ['interview_scheduled', 'rejected'],
  interview_scheduled: ['interview_completed', 'rejected'],
  interview_completed: ['selected', 'rejected'],
};

function Section({ title, children }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export default function ApplicantDetailPage() {
  const { applicationId } = useParams();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/hr';
  const { data, isLoading, isError, error } = useApplicationDetail(applicationId);
  const application = data?.data?.application;

  const updateStatusMutation = useUpdateApplicationStatus(applicationId);
  const [comment, setComment] = useState('');
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load this applicant.'}
      </Alert>
    );
  }

  if (!application) return null;

  const meta = STATUS_META[application.status] || { label: application.status, color: 'default' };
  const isTerminal = application.status === 'selected' || application.status === 'rejected';
  const suggestions = NEXT_STATUS_SUGGESTIONS[application.status] || [];

  const handleStatusChange = async (status) => {
    setStatusMenuAnchor(null);
    setActionError('');
    try {
      await updateStatusMutation.mutateAsync({ status, comment: comment || undefined });
      setComment('');
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Could not update status.');
    }
  };

  return (
    <Box>
      <Button component={RouterLink} to={`${basePath}/applicants`} sx={{ mb: 2 }}>
        ← Back to Applicants
      </Button>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{application.personalInfo?.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Applied for <strong>{application.job?.title}</strong> · {application.job?.company}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {application.personalInfo?.email} · {application.personalInfo?.phone}
              </Typography>
            </Box>
            <Chip label={meta.label} color={meta.color} sx={{ fontWeight: 600 }} />
          </Stack>

          {actionError && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}

          {!isTerminal && (
            <>
              <Divider sx={{ my: 2 }} />
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Add a recruiter comment (optional, saved with the next status change)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                {suggestions.map((s) => (
                  <Button
                    key={s}
                    variant="contained"
                    color={s === 'rejected' ? 'error' : 'secondary'}
                    disabled={updateStatusMutation.isPending}
                    onClick={() => handleStatusChange(s)}
                  >
                    {STATUS_META[s]?.label}
                  </Button>
                ))}
                {application.status === 'shortlisted' && (
                  <Button variant="outlined" onClick={() => setScheduleOpen(true)}>
                    Schedule Interview
                  </Button>
                )}
                <Button
                  variant="text"
                  endIcon={<ExpandMoreIcon />}
                  onClick={(e) => setStatusMenuAnchor(e.currentTarget)}
                >
                  More Actions
                </Button>
                <Menu
                  anchorEl={statusMenuAnchor}
                  open={Boolean(statusMenuAnchor)}
                  onClose={() => setStatusMenuAnchor(null)}
                >
                  {Object.entries(STATUS_META).map(([value, m]) => (
                    <MenuItem key={value} onClick={() => handleStatusChange(value)}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Stack>
            </>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Section title="Personal Information">
            <Grid container spacing={1.5}>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Date of Birth</Typography><Typography>{application.personalInfo?.dob}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Gender</Typography><Typography>{application.personalInfo?.gender}</Typography></Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Address</Typography>
                <Typography>
                  {[application.personalInfo?.address, application.personalInfo?.city, application.personalInfo?.state, application.personalInfo?.country, application.personalInfo?.pinCode].filter(Boolean).join(', ')}
                </Typography>
              </Grid>
            </Grid>
          </Section>

          <Section title="Education">
            <List>
              {application.education?.map((edu, i) => (
                <ListItem key={i} disableGutters sx={{ display: 'block', mb: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>{edu.qualification} — {edu.department || ''}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.collegeName || edu.schoolName} {edu.university ? `(${edu.university})` : ''} · {edu.yearOfPassing} · {edu.percentageOrCgpa}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Section>

          {application.experience?.length > 0 && (
            <Section title="Work Experience">
              <List>
                {application.experience.map((exp, i) => (
                  <ListItem key={i} disableGutters sx={{ display: 'block', mb: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{exp.role} at {exp.company}</Typography>
                    <Typography variant="body2" color="text.secondary">{exp.duration}</Typography>
                    <Typography variant="body2">{exp.responsibilities}</Typography>
                  </ListItem>
                ))}
              </List>
            </Section>
          )}

          {application.internships?.length > 0 && (
            <Section title="Internships">
              <List>
                {application.internships.map((it, i) => (
                  <ListItem key={i} disableGutters sx={{ display: 'block', mb: 1 }}>
                    <Typography sx={{ fontWeight: 600 }}>{it.role} at {it.company}</Typography>
                    <Typography variant="body2" color="text.secondary">{it.duration}</Typography>
                    <Typography variant="body2">{it.description}</Typography>
                  </ListItem>
                ))}
              </List>
            </Section>
          )}

          <Section title="Skills & Certifications">
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: application.certifications?.length ? 2 : 0 }}>
              {application.skills?.map((s) => <Chip key={s} label={s} size="small" />)}
            </Stack>
            {application.certifications?.length > 0 && (
              <List>
                {application.certifications.map((c, i) => (
                  <ListItem key={i} disableGutters>
                    {c.name} — {c.organization} ({c.completionYear})
                  </ListItem>
                ))}
              </List>
            )}
          </Section>

          <Section title="Additional Questions">
            <Grid container spacing={1.5}>
              <Grid item xs={12}><Typography variant="body2" color="text.secondary">Why this job?</Typography><Typography>{application.additionalInfo?.whyThisJob}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Current Salary</Typography><Typography>{application.additionalInfo?.currentSalary || '—'}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Expected Salary</Typography><Typography>{application.additionalInfo?.expectedSalary}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Notice Period</Typography><Typography>{application.additionalInfo?.noticePeriod}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Willing to Relocate</Typography><Typography>{application.additionalInfo?.willingToRelocate}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Current Location</Typography><Typography>{application.additionalInfo?.currentLocation}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Preferred Location</Typography><Typography>{application.additionalInfo?.preferredLocation}</Typography></Grid>
              {application.additionalInfo?.additionalNotes && (
                <Grid item xs={12}><Typography variant="body2" color="text.secondary">Additional Notes</Typography><Typography>{application.additionalInfo.additionalNotes}</Typography></Grid>
              )}
            </Grid>
          </Section>
        </Grid>

        <Grid item xs={12} md={4}>
          <Section title="Documents">
            <Button
              fullWidth
              variant="outlined"
              startIcon={<DownloadIcon />}
              href={application.resume?.url}
              target="_blank"
              rel="noreferrer"
              sx={{ mb: 1.5 }}
            >
              Download Resume
            </Button>
            {application.coverLetter?.url && (
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                href={application.coverLetter.url}
                target="_blank"
                rel="noreferrer"
              >
                Download Cover Letter
              </Button>
            )}
          </Section>

          {application.currentInterview && (
            <Section title="Interview">
              <Typography variant="body2">
                {application.currentInterview.interviewDate} at {application.currentInterview.interviewTime}
              </Typography>
              <Typography variant="body2">Mode: {application.currentInterview.mode}</Typography>
              {application.currentInterview.mode === 'online' && application.currentInterview.meetingLink && (
                <Typography variant="body2">
                  <a href={application.currentInterview.meetingLink} target="_blank" rel="noreferrer">
                    {application.currentInterview.meetingLink}
                  </a>
                </Typography>
              )}
              {application.currentInterview.mode === 'offline' && application.currentInterview.location && (
                <Typography variant="body2">Location: {application.currentInterview.location}</Typography>
              )}
              <Typography variant="body2">Interviewer: {application.currentInterview.interviewerName}</Typography>
              <Button size="small" sx={{ mt: 1 }} onClick={() => setScheduleOpen(true)}>
                Reschedule
              </Button>
            </Section>
          )}

          <Section title="Status History">
            <Stack spacing={1.5}>
              {[...(application.statusHistory || [])].reverse().map((h, i) => (
                <Box key={i}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {STATUS_META[h.status]?.label || h.status}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(h.changedAt).toLocaleString()}
                  </Typography>
                  {h.comment && <Typography variant="body2" color="text.secondary">"{h.comment}"</Typography>}
                </Box>
              ))}
            </Stack>
          </Section>
        </Grid>
      </Grid>

      <ScheduleInterviewModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        applicationId={applicationId}
        existingInterview={application.currentInterview}
      />
    </Box>
  );
}