import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CardSkeleton } from '../../../components/common/Loader';
import JobFormModal from '../../../components/jobs/JobFormModal';
import { useManagedJobs, useCloseJob, useReopenJob, useDeleteJob } from '../../../features/jobs/jobQueries';

const STATUS_META = {
  open: { label: 'Published', color: 'success' },
  draft: { label: 'Draft', color: 'default' },
  closed: { label: 'Closed', color: 'warning' },
};

export default function ManageJobsPage() {
  const { data, isLoading, isError, error } = useManagedJobs({ limit: 50 });
  const closeMutation = useCloseJob();
  const reopenMutation = useReopenJob();
  const deleteMutation = useDeleteJob();

  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuJob, setMenuJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const jobs = data?.data?.jobs || data?.jobs || [];

  const openCreate = () => {
    setEditingJob(null);
    setFormOpen(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setFormOpen(true);
    closeMenu();
  };

  const openMenu = (event, job) => {
    setMenuAnchor(event.currentTarget);
    setMenuJob(job);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuJob(null);
  };

  const handleClose = async (job) => {
    closeMenu();
    await closeMutation.mutateAsync(job.id);
  };

  const handleReopen = async (job) => {
    closeMenu();
    await reopenMutation.mutateAsync(job.id);
  };

  const confirmDelete = (job) => {
    setDeleteTarget(job);
    closeMenu();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Manage Jobs</Typography>
        {/* Add Job — visible only to HR/Admin, since this whole page sits behind
            ProtectedRoute allowedRoles={['hr','recruiter']} or {['admin']} in App.jsx */}
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add Job
        </Button>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.response?.data?.message || 'Could not load jobs.'}
        </Alert>
      )}

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : jobs.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No job postings yet.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add your first job
          </Button>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Posted</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => {
                const meta = STATUS_META[job.status] || STATUS_META.draft;
                return (
                  <TableRow key={job.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.employmentType}</TableCell>
                    <TableCell>
                      <Chip size="small" label={meta.label} color={meta.color} variant={meta.color === 'default' ? 'outlined' : 'filled'} />
                    </TableCell>
                    <TableCell>{job.postedAgo}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => openMenu(e, job)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={() => openEdit(menuJob)}>Edit</MenuItem>
        {menuJob?.status === 'open' && (
          <MenuItem onClick={() => handleClose(menuJob)}>Close posting</MenuItem>
        )}
        {menuJob?.status === 'closed' && (
          <MenuItem onClick={() => handleReopen(menuJob)}>Reopen posting</MenuItem>
        )}
        <MenuItem onClick={() => confirmDelete(menuJob)} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      <JobFormModal open={formOpen} onClose={() => setFormOpen(false)} job={editingJob} />

      {/* Lightweight inline confirm dialog — no reusable ConfirmDialog component
          exists in the codebase yet, so this is scoped locally to this page. */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete job posting?</DialogTitle>
        <DialogContent>
          <Typography>
            This will permanently remove "{deleteTarget?.title}". This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={deleteMutation.isPending}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}