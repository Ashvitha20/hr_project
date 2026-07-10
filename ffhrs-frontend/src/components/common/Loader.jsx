import { Box, CircularProgress, Skeleton, Stack } from '@mui/material';

export function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
      <CircularProgress color="secondary" />
    </Box>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 3 }} />
      ))}
    </Stack>
  );
}
