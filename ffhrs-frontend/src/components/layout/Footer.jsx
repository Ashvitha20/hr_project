import { Box, Container, Grid, Typography, Link as MLink, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import logo from '../../assets/logo.jpeg';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'Services', path: '/services' },
      { label: 'Industries', path: '/industries' },
      { label: 'Testimonials', path: '/testimonials' },
      { label: 'Blog', path: '/blog' },
    ],
  },
  {
    title: 'Candidates',
    links: [
      { label: 'Browse Jobs', path: '/careers' },
      { label: 'Create Profile', path: '/register' },
      { label: 'FAQs', path: '/faqs' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Contact Us', path: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.dark', color: '#fff', mt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <img src={logo} alt="Future Focus HR Solutions" style={{ height: 42, background: '#fff', padding: 6, borderRadius: 6 }} />
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.85, maxWidth: 320 }}>
              A leading provider of HR and recruitment services — connecting exceptional
              talent with visionary organizations across industries.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" /> <Typography variant="body2">Chennai, Tamil Nadu</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" /> <Typography variant="body2">+91 96554 41229</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" /> <Typography variant="body2">team@ffhrs.com</Typography>
              </Box>
            </Box>
          </Grid>

          {columns.map((col) => (
            <Grid item xs={6} md={2.5} key={col.title}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
                {col.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {col.links.map((l) => (
                  <MLink
                    key={l.path}
                    component={Link}
                    to={l.path}
                    underline="hover"
                    color="inherit"
                    sx={{ opacity: 0.85, fontSize: 14 }}
                  >
                    {l.label}
                  </MLink>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', my: 4 }} />
        <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
          © {new Date().getFullYear()} Future Focus HR Solutions. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
