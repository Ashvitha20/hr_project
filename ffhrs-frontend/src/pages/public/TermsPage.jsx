import { Container, Typography, Box } from '@mui/material';

const sections = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using the Future Focus HR Solutions platform, you agree to be bound by these Terms of Service.' },
  { title: '2. Use of the Platform', body: 'You agree to provide accurate information and to use the platform only for lawful recruitment and employment-related purposes.' },
  { title: '3. Account Responsibilities', body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.' },
  { title: '4. Intellectual Property', body: 'All content on this platform, excluding user-submitted materials, is the property of Future Focus HR Solutions.' },
  { title: '5. Limitation of Liability', body: 'Future Focus HR Solutions is not liable for hiring decisions made by employer clients or for the accuracy of candidate-submitted information.' },
  { title: '6. Termination', body: 'We reserve the right to suspend or terminate accounts that violate these terms.' },
];

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h3" sx={{ color: 'primary.dark', mb: 1 }}>Terms of Service</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Last updated: July 2026</Typography>
      {sections.map((s) => (
        <Box key={s.title} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{s.title}</Typography>
          <Typography variant="body1" color="text.secondary">{s.body}</Typography>
        </Box>
      ))}
    </Container>
  );
}
