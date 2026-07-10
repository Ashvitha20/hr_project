import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useUsers, useUpdateUser } from '../../../features/users/userQueries';

const ROLES = ['candidate', 'hr', 'recruiter', 'admin'];

// Static permission matrix describing what each role can do across the platform.
const PERMISSIONS = [
  { key: 'apply', label: 'Apply to jobs', roles: ['candidate'] },
  { key: 'manageOwnProfile', label: 'Manage own profile & saved jobs', roles: ['candidate'] },
  { key: 'postJobs', label: 'Post & manage job listings', roles: ['hr', 'recruiter', 'admin'] },
  { key: 'reviewApplicants', label: 'Review applicants & update status', roles: ['hr', 'recruiter', 'admin'] },
  { key: 'scheduleInterviews', label: 'Schedule interviews', roles: ['hr', 'recruiter', 'admin'] },
  { key: 'sendOffers', label: 'Send offer letters', roles: ['hr', 'recruiter', 'admin'] },
  { key: 'manageBlog', label: 'Manage blog & testimonials', roles: ['admin'] },
  { key: 'manageUsers', label: 'Manage users & roles', roles: ['admin'] },
];

export default function ManageRolesPage() {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [feedback, setFeedback] = useState(null);

  const { data } = useUsers({ search: email || undefined, limit: 5 });
  const updateMutation = useUpdateUser();

  const matches = data?.data?.users || [];
  const exactMatch = matches.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

  const handleAssign = () => {
    if (!exactMatch || !selectedRole) return;
    updateMutation.mutate(
      { userId: exactMatch.id, payload: { role: selectedRole } },
      {
        onSuccess: () => {
          setFeedback({ type: 'success', text: `${exactMatch.fullName} is now ${selectedRole}.` });
          setEmail('');
          setSelectedRole('');
        },
        onError: () => setFeedback({ type: 'error', text: 'Could not update role.' }),
      }
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Roles &amp; Permissions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Reference what each role can access, and quickly reassign a user's role by email.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card variant="outlined" sx={{ borderRadius: 3, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Permission</TableCell>
                  {ROLES.map((role) => (
                    <TableCell key={role} align="center">
                      <Chip size="small" label={role} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {PERMISSIONS.map((perm) => (
                  <TableRow key={perm.key}>
                    <TableCell>{perm.label}</TableCell>
                    {ROLES.map((role) => (
                      <TableCell key={role} align="center">
                        {perm.roles.includes(role) ? (
                          <CheckCircleIcon fontSize="small" color="success" />
                        ) : (
                          <CancelIcon fontSize="small" color="disabled" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                Assign a Role
              </Typography>

              {feedback && (
                <Alert severity={feedback.type} sx={{ mb: 2 }}>
                  {feedback.text}
                </Alert>
              )}

              <Stack spacing={2}>
                <TextField
                  label="User Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                {email && !exactMatch && (
                  <Typography variant="caption" color="text.secondary">
                    No exact match found for this email yet.
                  </Typography>
                )}
                {exactMatch && (
                  <Typography variant="body2">
                    Found: <strong>{exactMatch.fullName}</strong> — currently{' '}
                    <Chip size="small" label={exactMatch.role} sx={{ ml: 0.5 }} />
                  </Typography>
                )}
                <TextField
                  select
                  label="New Role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  fullWidth
                  disabled={!exactMatch}
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleAssign}
                  disabled={!exactMatch || !selectedRole || updateMutation.isPending}
                >
                  {updateMutation.isPending ? 'Saving…' : 'Assign Role'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}