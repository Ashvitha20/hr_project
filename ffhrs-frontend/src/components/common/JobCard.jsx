import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Chip, Box, Button, Stack } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function JobCard({ job }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 1,
        transition: '0.2s',
        '&:hover': { boxShadow: 4, borderColor: 'secondary.main' },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {job.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {job.company}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={job.employmentType}
            color={job.employmentType === 'Remote' ? 'secondary' : 'default'}
          />
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 2, color: 'text.secondary' }} flexWrap="wrap">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PlaceIcon fontSize="small" />
            <Typography variant="body2">{job.location}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <WorkOutlineIcon fontSize="small" />
            <Typography variant="body2">{job.experience}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeIcon fontSize="small" />
            <Typography variant="body2">{job.postedAgo}</Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
          {job.skills.slice(0, 4).map((s) => (
            <Chip key={s} label={s} size="small" variant="outlined" sx={{ mb: 1 }} />
          ))}
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700 }}>
            {job.salary}
          </Typography>
          <Button component={Link} to={`/careers/${job.id}`} size="small" variant="contained" color="primary">
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
