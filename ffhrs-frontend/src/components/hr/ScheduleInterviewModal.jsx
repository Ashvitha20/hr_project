import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import {
  useScheduleInterview,
  useRescheduleInterview,
  useCancelInterview,
} from '../../features/applications/hrApplicationQueries';

const MODES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

const baseSchema = {
  interviewDate: yup.string().required('Interview date is required'),
  interviewTime: yup.string().required('Interview time is required'),
  mode: yup.string().oneOf(['online', 'offline']).required('Mode is required'),
  interviewerName: yup.string().required('Interviewer name is required'),
  location: yup.string().when('mode', {
    is: 'offline',
    then: (s) => s.required('Location is required for an offline interview'),
  }),
  meetingLink: yup.string().when('mode', {
    is: 'online',
    then: (s) => s.url('Enter a valid URL').required('Meeting link is required for an online interview'),
  }),
  notes: yup.string(),
};

const schema = yup.object(baseSchema);

export default function ScheduleInterviewModal({ open, onClose, applicationId, existingInterview }) {
  const isReschedule = Boolean(existingInterview);
  const canCancel = isReschedule && existingInterview?.status === 'scheduled';

  const scheduleMutation = useScheduleInterview(applicationId);
  const rescheduleMutation = useRescheduleInterview(applicationId);
  const cancelMutation = useCancelInterview(applicationId);
  const mutation = isReschedule ? rescheduleMutation : scheduleMutation;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      interviewDate: '',
      interviewTime: '',
      mode: 'online',
      location: '',
      meetingLink: '',
      interviewerName: '',
      notes: '',
    },
  });

  const mode = watch('mode');

  useEffect(() => {
    if (open) {
      reset({
        interviewDate: existingInterview?.interviewDate || '',
        interviewTime: existingInterview?.interviewTime || '',
        mode: existingInterview?.mode || 'online',
        location: existingInterview?.location || '',
        meetingLink: existingInterview?.meetingLink || '',
        interviewerName: existingInterview?.interviewerName || '',
        notes: existingInterview?.notes || '',
      });
      mutation.reset();
      cancelMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, existingInterview]);

  const onSubmit = async (values) => {
    if (isReschedule) {
      await rescheduleMutation.mutateAsync({ interviewId: existingInterview.id, payload: values });
    } else {
      await scheduleMutation.mutateAsync(values);
    }
    onClose();
  };

  const handleCancelInterview = async () => {
    if (!window.confirm('Cancel this interview? The application will move back to Shortlisted.')) return;
    await cancelMutation.mutateAsync({ interviewId: existingInterview.id, reason: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isReschedule ? 'Reschedule Interview' : 'Schedule Interview'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error?.response?.data?.message || 'Could not save this interview.'}
            </Alert>
          )}
          {cancelMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {cancelMutation.error?.response?.data?.message || 'Could not cancel this interview.'}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="interviewDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Interview Date"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.interviewDate)}
                    helperText={errors.interviewDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="interviewTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="time"
                    label="Interview Time"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.interviewTime)}
                    helperText={errors.interviewTime?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="mode"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth label="Mode">
                    {MODES.map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            {mode === 'offline' ? (
              <Grid item xs={12}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Interview Location"
                      error={Boolean(errors.location)}
                      helperText={errors.location?.message}
                    />
                  )}
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Controller
                  name="meetingLink"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Google Meet / Zoom Link"
                      error={Boolean(errors.meetingLink)}
                      helperText={errors.meetingLink?.message}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                name="interviewerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Interviewer Name"
                    error={Boolean(errors.interviewerName)}
                    helperText={errors.interviewerName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline minRows={2} label="Interview Notes (optional)" />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {canCancel && (
            <Button
              onClick={handleCancelInterview}
              color="error"
              disabled={cancelMutation.isPending}
              sx={{ mr: 'auto' }}
            >
              {cancelMutation.isPending ? 'Cancelling…' : 'Cancel Interview'}
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={mutation.isPending}>
            {isReschedule ? 'Save Changes' : 'Schedule Interview'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}