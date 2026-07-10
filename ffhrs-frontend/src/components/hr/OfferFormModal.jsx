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
import { useApplications } from '../../features/applications/hrApplicationQueries';
import { useCreateOffer, useUpdateOffer } from '../../features/offers/offerQueries';

const schema = yup.object({
  applicationId: yup.string().required('Select a candidate application'),
  position: yup.string().required('Position is required'),
  salary: yup.string().required('Salary is required'),
  joiningDate: yup.string().required('Joining date is required'),
  expiryDate: yup.string(),
  notes: yup.string(),
});

export default function OfferFormModal({ open, onClose, offer }) {
  const isEdit = Boolean(offer);

  // Only "Selected" candidates are eligible for an offer — see Offer.js schema comment
  const { data: applicationsData } = useApplications({ status: 'selected', limit: 100 });
  const applications = applicationsData?.data?.applications || [];

  const createMutation = useCreateOffer();
  const updateMutation = useUpdateOffer();
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      applicationId: '',
      position: '',
      salary: '',
      joiningDate: '',
      expiryDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        applicationId: offer?.application || '',
        position: offer?.position || '',
        salary: offer?.salary || '',
        joiningDate: offer?.joiningDate ? offer.joiningDate.slice(0, 10) : '',
        expiryDate: offer?.expiryDate ? offer.expiryDate.slice(0, 10) : '',
        notes: offer?.notes || '',
      });
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, offer]);

  const onSubmit = async (values) => {
    if (isEdit) {
      const { applicationId, ...payload } = values;
      await updateMutation.mutateAsync({ offerId: offer.id, payload });
    } else {
      await createMutation.mutateAsync(values);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Offer' : 'Create Offer Letter'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error?.response?.data?.message || 'Could not save this offer.'}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="applicationId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    disabled={isEdit}
                    label="Candidate (Selected applications)"
                    error={Boolean(errors.applicationId)}
                    helperText={errors.applicationId?.message}
                  >
                    {applications.length === 0 && (
                      <MenuItem value="" disabled>No selected candidates yet</MenuItem>
                    )}
                    {applications.map((app) => (
                      <MenuItem key={app.id} value={app.id}>
                        {app.personalInfo?.fullName} — {app.job?.title}
                      </MenuItem>
                    ))}
                    {isEdit && (
                      <MenuItem value={offer.application}>
                        {offer.candidate?.fullName || 'Current candidate'}
                      </MenuItem>
                    )}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="position"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Position"
                    error={Boolean(errors.position)}
                    helperText={errors.position?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="salary"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Salary"
                    error={Boolean(errors.salary)}
                    helperText={errors.salary?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="joiningDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Joining Date"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.joiningDate)}
                    helperText={errors.joiningDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth type="date" label="Offer Expiry (optional)" InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline minRows={2} label="Notes (optional)" />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Create Offer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}