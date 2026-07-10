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
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { PageLoader } from '../../../components/common/Loader';
import {
  useUsers,
  useUpdateUser,
  useDeactivateUser,
  useActivateUser,
  useDeleteUser,
} from '../../../features/users/userQueries';

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'candidate', label: 'Candidate' },
  { value: 'hr', label: 'HR' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'admin', label: 'Admin' },
];

export default function ManageUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', role: '' });

  const { data, isLoading, isError, error } = useUsers({ search: search || undefined, role: role || undefined });
  const updateMutation = useUpdateUser();
  const deactivateMutation = useDeactivateUser();
  const activateMutation = useActivateUser();
  const deleteMutation = useDeleteUser();

  const users = data?.data?.users || [];

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ fullName: user.fullName || '', phone: user.phone || '', role: user.role });
  };

  const closeEdit = () => setEditUser(null);

  const saveEdit = () => {
    updateMutation.mutate(
      { userId: editUser.id, payload: editForm },
      { onSuccess: closeEdit }
    );
  };

  const handleDelete = (user) => {
    if (window.confirm(`Delete ${user.fullName}? This cannot be undone.`)) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Manage Users
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Search, edit, and manage access for every account on the platform.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap" rowGap={2}>
        <TextField
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ minWidth: 260 }}
        />
        <TextField select label="Role" value={role} onChange={(e) => setRole(e.target.value)} sx={{ minWidth: 180 }}>
          {ROLE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {isLoading && <PageLoader />}

      {isError && (
        <Alert severity="error">{error?.response?.data?.message || 'Could not load users right now.'}</Alert>
      )}

      {!isLoading && !isError && (
        <Card variant="outlined" sx={{ borderRadius: 3, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No users match this filter.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip size="small" label={user.role} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={() => openEdit(user)}>
                        Edit
                      </Button>
                      {user.isActive ? (
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => deactivateMutation.mutate(user.id)}
                          disabled={deactivateMutation.isPending}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          color="success"
                          onClick={() => activateMutation.mutate(user.id)}
                          disabled={activateMutation.isPending}
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(user)}
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

      <Dialog open={Boolean(editUser)} onClose={closeEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {updateMutation.isError && (
              <Alert severity="error">
                {updateMutation.error?.response?.data?.message || 'Could not save changes.'}
              </Alert>
            )}
            <TextField
              label="Full Name"
              value={editForm.fullName}
              onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Role"
              value={editForm.role}
              onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
              fullWidth
            >
              {ROLE_OPTIONS.filter((opt) => opt.value).map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={saveEdit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}