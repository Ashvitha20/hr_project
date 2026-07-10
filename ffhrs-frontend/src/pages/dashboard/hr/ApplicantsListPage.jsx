import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Paper,
  Alert,
  Stack,
  Pagination,
  Grid,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CardSkeleton } from '../../../components/common/Loader';
import { useApplications } from '../../../features/applications/hrApplicationQueries';

// Backend status enum is snake_case (see constants/applicationStatus.js) —
// mapped here to display labels + chip colors so it stays in sync either way.
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

const STATUS_OPTIONS = [{ value: '', label: 'All Statuses' }, ...Object.entries(STATUS_META).map(
  ([value, meta]) => ({ value, label: meta.label })
)];

export default function ApplicantsListPage() {
  // Same component is mounted at both /hr/applicants and /admin/applicants
  // (see App.jsx) — derive the base path so "View Profile" links stay in
  // whichever portal the user is currently in, instead of always going to /hr.
  const { pathname } = useLocation();
  const basePath = pathname.startsWith('/admin') ? '/admin' : '/hr';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useApplications({
    search: search || undefined,
    status: status || undefined,
    page,
    limit: 15,
  });

  const applications = data?.data?.applications || [];
  const pagination = data?.data?.pagination;

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Applicants</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            placeholder="Search by candidate name"
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => handleFilterChange(setStatus)(e.target.value)}>
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.response?.data?.message || 'Could not load applicants.'}
        </Alert>
      )}

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : applications.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">No applicants match your filters yet.</Typography>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Candidate</TableCell>
                <TableCell>Job</TableCell>
                <TableCell>Applied On</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => {
                const meta = STATUS_META[app.status] || { label: app.status, color: 'default' };
                return (
                  <TableRow key={app.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>{app.personalInfo?.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">{app.personalInfo?.email}</Typography>
                    </TableCell>
                    <TableCell>{app.job?.title}</TableCell>
                    <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={meta.label}
                        color={meta.color}
                        variant={meta.color === 'default' ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button component={Link} to={`${basePath}/applicants/${app.id}`} size="small">
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {pagination && pagination.pages > 1 && (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(_, value) => setPage(value)}
            color="secondary"
          />
        </Stack>
      )}
    </Box>
  );
}