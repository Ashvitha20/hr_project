import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PageLoader } from '../../../components/common/Loader';
import { useOffers, useCreateOffer, useSendOffer, useWithdrawOffer } from '../../../features/offers/offerQueries';
import { useApplications } from '../../../features/applications/hrApplicationQueries';

const STATUS_META = {
  draft: { label: 'Draft', color: 'default' },
  sent: { label: 'Sent', color: 'secondary' },
  accepted: { label: 'Accepted', color: 'success' },
  declined: { label: 'Declined', color: 'error' },
  withdrawn: { label: 'Withdrawn', color: 'warning' },
};

const emptyForm = { applicationId: '', position: '', salary: '', joiningDate: '', notes: '' };

export default function OffersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading, isError, error } = useOffers();
  const { data: selectedApps } = useApplications({ status: 'selected' });
  const createMutation = useCreateOffer();
  const sendMutation = useSendOffer();
  const withdrawMutation = useWithdrawOffer();

  const offers = data?.data?.offers || [];
  const candidatesReadyForOffer = selectedApps?.data?.applications || [];

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClose = () => {
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const handleSubmit = () => {
    createMutation.mutate(form, { onSuccess: handleClose });
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Offer Letters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and track offer letters for selected candidates.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New Offer
        </Button>
      </Stack>

      {isLoading && <PageLoader />}

      {isError && (
        <Alert severity="error">{error?.response?.data?.message || 'Could not load offers right now.'}</Alert>
      )}

      {(sendMutation.isError || withdrawMutation.isError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Something went wrong updating that offer. Please try again.
        </Alert>
      )}

      {!isLoading && !isError && offers.length === 0 && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary">
              No offer letters yet. Create one for a selected candidate.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Stack spacing={2}>
        {offers.map((offer) => {
          const meta = STATUS_META[offer.status] || STATUS_META.draft;
          return (
            <Card variant="outlined" sx={{ borderRadius: 3 }} key={offer.id}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {offer.candidate?.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {offer.position} • {offer.job?.title}
                    </Typography>
                  </Box>
                  <Chip size="small" label={meta.label} color={meta.color} />
                </Stack>

                <Stack direction="row" spacing={3} sx={{ mt: 2 }} flexWrap="wrap" rowGap={1}>
                  <Typography variant="body2">
                    <strong>Salary:</strong> {offer.salary}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Joining:</strong> {new Date(offer.joiningDate).toLocaleDateString()}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                  {offer.status === 'draft' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => sendMutation.mutate(offer.id)}
                      disabled={sendMutation.isPending}
                    >
                      Send Offer
                    </Button>
                  )}
                  {offer.status === 'sent' && (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => withdrawMutation.mutate(offer.id)}
                      disabled={withdrawMutation.isPending}
                    >
                      Withdraw
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>New Offer Letter</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {createMutation.isError && (
              <Alert severity="error">
                {createMutation.error?.response?.data?.message || 'Could not create the offer.'}
              </Alert>
            )}
            <TextField
              select
              label="Candidate (Selected applications)"
              value={form.applicationId}
              onChange={handleChange('applicationId')}
              fullWidth
            >
              {candidatesReadyForOffer.length === 0 && (
                <MenuItem value="" disabled>
                  No selected candidates available
                </MenuItem>
              )}
              {candidatesReadyForOffer.map((app) => (
                <MenuItem key={app.id} value={app.id}>
                  {app.candidate?.fullName} — {app.job?.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Position" value={form.position} onChange={handleChange('position')} fullWidth />
            <TextField label="Salary" value={form.salary} onChange={handleChange('salary')} fullWidth />
            <TextField
              label="Joining Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.joiningDate}
              onChange={handleChange('joiningDate')}
              fullWidth
            />
            <TextField
              label="Notes"
              value={form.notes}
              onChange={handleChange('notes')}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={
              createMutation.isPending || !form.applicationId || !form.position || !form.salary || !form.joiningDate
            }
          >
            {createMutation.isPending ? 'Creating…' : 'Create Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}