import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PageLoader } from '../../../components/common/Loader';
import {
  useManagedTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useApproveTestimonial,
  useRejectTestimonial,
  useDeleteTestimonial,
} from '../../../features/testimonials/testimonialQueries';

const emptyForm = { name: '', role: '', quote: '' };

const TABS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ManageTestimonialsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading, isError, error } = useManagedTestimonials({ status: statusFilter || undefined });
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const approveMutation = useApproveTestimonial();
  const rejectMutation = useRejectTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const testimonials = data?.data?.testimonials || [];
  const saveMutation = editingId ? updateMutation : createMutation;

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, role: item.role, quote: item.quote });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ testimonialId: editingId, payload: form }, { onSuccess: handleClose });
    } else {
      createMutation.mutate(form, { onSuccess: handleClose });
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`Delete testimonial from "${item.name}"? This cannot be undone.`)) {
      deleteMutation.mutate(item.id);
    }
  };

  const statusColor = { pending: 'warning', approved: 'success', rejected: 'error' };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Manage Testimonials
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review submissions and control what appears on the public site.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>
          New Testimonial
        </Button>
      </Stack>

      <Tabs
        value={statusFilter}
        onChange={(_e, val) => setStatusFilter(val)}
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
          {error?.response?.data?.message || 'Could not load testimonials right now.'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <Card variant="outlined" sx={{ borderRadius: 3, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Quote</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testimonials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No testimonials found.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {testimonials.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Typography variant="body2" noWrap>
                      {item.quote}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={item.status} color={statusColor[item.status] || 'default'} />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={() => openEdit(item)}>
                        Edit
                      </Button>
                      {item.status !== 'approved' && (
                        <Button
                          size="small"
                          color="success"
                          onClick={() => approveMutation.mutate(item.id)}
                          disabled={approveMutation.isPending}
                        >
                          Approve
                        </Button>
                      )}
                      {item.status !== 'rejected' && (
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => rejectMutation.mutate(item.id)}
                          disabled={rejectMutation.isPending}
                        >
                          Reject
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(item)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {saveMutation.isError && (
              <Alert severity="error">
                {saveMutation.error?.response?.data?.message || 'Could not save this testimonial.'}
              </Alert>
            )}
            <TextField label="Name" value={form.name} onChange={handleChange('name')} fullWidth />
            <TextField label="Role / Company" value={form.role} onChange={handleChange('role')} fullWidth />
            <TextField
              label="Quote"
              value={form.quote}
              onChange={handleChange('quote')}
              multiline
              rows={4}
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
            disabled={saveMutation.isPending || !form.name || !form.role || !form.quote}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}