import { useState } from 'react';
import {
  Container,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Chip,
  Stack,
  Pagination,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import JobCard from '../../components/common/JobCard';
import SectionHeading from '../../components/common/SectionHeading';
import { CardSkeleton } from '../../components/common/Loader';
import { usePublicJobs, usePublicJobFilters } from '../../features/jobs/jobQueries';

export default function JobListingPage() {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [employmentType, setEmploymentType] = useState('All');
  const [page, setPage] = useState(1);

  const { data: filtersData } = usePublicJobFilters();
  const filterOptions = filtersData?.data || {};
  const departments = ['All', ...(filterOptions.departments || [])];
  const employmentTypes = ['All', ...(filterOptions.employmentTypes || [])];

  const { data, isLoading, isError, error } = usePublicJobs({
    search: search || undefined,
    department: department !== 'All' ? department : undefined,
    employmentType: employmentType !== 'All' ? employmentType : undefined,
    page,
    limit: 10,
  });

  const jobs = data?.data?.jobs || [];
  const pagination = data?.data?.pagination;

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1); // reset to first page whenever a filter changes
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading eyebrow="Career Portal" title="Find your next opportunity" align="left" />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by title or skill (e.g. React, HR Consulting)"
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select value={department} label="Department" onChange={(e) => handleFilterChange(setDepartment)(e.target.value)}>
              {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Employment Type</InputLabel>
            <Select value={employmentType} label="Employment Type" onChange={(e) => handleFilterChange(setEmploymentType)(e.target.value)}>
              {employmentTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.response?.data?.message || 'Could not load jobs right now. Please try again.'}
        </Alert>
      )}

      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip label={`${pagination?.total ?? jobs.length} jobs found`} color="secondary" variant="outlined" />
      </Stack>

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No jobs match your filters. Try adjusting your search.</Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} md={6} key={job.id}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>

          {pagination && pagination.pages > 1 && (
            <Stack alignItems="center" sx={{ mt: 5 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={(_, value) => setPage(value)}
                color="secondary"
              />
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}