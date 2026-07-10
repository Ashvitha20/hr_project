import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

export default function NotFoundPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 14, textAlign: 'center' }}>
      <Typography variant="h1" sx={{ fontSize: 96, fontWeight: 800, color: 'secondary.main' }}>404</Typography>
      <Typography variant="h5" sx={{ mt: 1, color: 'primary.dark' }}>Page not found</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Box>
        <Button component={Link} to="/" variant="contained" color="primary">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
