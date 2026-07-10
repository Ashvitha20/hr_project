import { Box, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import SectionHeading from '../../components/common/SectionHeading';
import aboutImage from '../../assets/about.png';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 700 }}>
            ABOUT US
          </Typography>
          <Typography variant="h3" sx={{ mt: 1, color: 'primary.dark' }}>
            Future Focus HR Solutions
          </Typography>
          <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary' }}>
            Future Focus HR Solutions is a leading provider of HR and recruitment services,
            offering tailored solutions to help organizations source, select, and retain top
            talent. Our services span recruitment, executive search, payroll, contract staffing,
            HR consulting, training and development, digital marketing, content writing, and
            website development.
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            With a commitment to excellence, integrity, and innovation, we partner with clients
            across industries to drive growth and success.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box component="img" src={aboutImage} alt="Our team at work" sx={{ width: '100%', borderRadius: 4, boxShadow: 6 }} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 10 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  Our Mission
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  To empower businesses and individuals through strategic human resource
                  solutions — connecting exceptional talent with visionary organizations,
                  fostering growth, and contributing to the success stories of our clients.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  Our Vision
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  To be the best full-service HR partner where clients can trust us for the
                  success of their business, and candidates can trust us to champion their careers.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 10 }}>
        <SectionHeading eyebrow="Why HR Planning Matters" title="Built on strong workforce planning" align="left" />
        <Grid container spacing={3}>
          {[
            ['Workforce Productivity', 'Aligning skills with roles enhances efficiency and performance.'],
            ['Adapts to Change', 'We help organizations navigate industry shifts with the right talent.'],
            ['Cost Savings', 'Proactive planning avoids last-minute hiring costs and skill shortages.'],
            ['Succession Planning', 'Identifying successors for key roles mitigates continuity risk.'],
          ].map(([title, desc]) => (
            <Grid item xs={12} sm={6} key={title}>
              <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
