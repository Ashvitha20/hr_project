import { Container, Typography, Box } from '@mui/material';

const sections = [
  { title: '1. Information We Collect', body: 'We collect information you provide directly (such as your name, email, resume, and profile details) and information collected automatically (such as usage data and device information).' },
  { title: '2. How We Use Your Information', body: 'We use your information to match you with relevant job opportunities, communicate with you about applications, and improve our services.' },
  { title: '3. Sharing of Information', body: 'We share candidate information with prospective employer clients only as part of the recruitment process, and never sell personal data to third parties.' },
  { title: '4. Data Security', body: 'We use industry-standard security measures, including encryption in transit and at rest, to protect your information.' },
  { title: '5. Your Rights', body: 'You may access, update, or request deletion of your personal data at any time by contacting us at team@ffhrs.com.' },
  { title: '6. Changes to This Policy', body: 'We may update this policy periodically. Continued use of our platform after changes constitutes acceptance of the updated policy.' },
];

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h3" sx={{ color: 'primary.dark', mb: 1 }}>Privacy Policy</Typography>
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
