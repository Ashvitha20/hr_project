import { Box, Typography } from '@mui/material';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <Box sx={{ textAlign: align, mb: 5, maxWidth: 720, mx: align === 'center' ? 'auto' : 0 }}>
      {eyebrow && (
        <Typography
          variant="overline"
          sx={{ color: 'secondary.main', fontWeight: 700, letterSpacing: 1.5 }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography variant="h3" sx={{ mt: 1, color: 'primary.dark' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" sx={{ mt: 1.5, color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
