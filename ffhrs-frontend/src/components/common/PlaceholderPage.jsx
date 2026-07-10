import { Box, Typography, Card, CardContent } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

/**
 * Generic placeholder for dashboard sub-pages whose UI is scaffolded here
 * but whose data still needs a backend endpoint wired up. Swap the body
 * of each usage for the real table/form once the corresponding API exists.
 */
export default function PlaceholderPage({ title, description }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent sx={{ textAlign: 'center', py: 8 }}>
        <ConstructionIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 420, mx: 'auto' }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
