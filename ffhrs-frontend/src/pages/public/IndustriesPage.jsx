import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import SectionHeading from '../../components/common/SectionHeading';

const industries = [
  'Information Technology (IT)',
  'Finance and Accounting',
  'Healthcare',
  'Engineering and Manufacturing',
  'Sales and Marketing',
  'Human Resources (HR) and Administration',
  'Telecommunications',
  'Education and Training',
];

export default function IndustriesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading
        eyebrow="Industries We Work With"
        title="Deep expertise across sectors"
        subtitle="Our recruiters bring domain-specific knowledge to every search, so you get candidates who understand your industry from day one."
      />
      <Grid container spacing={3}>
        {industries.map((name, i) => (
          <Grid item xs={12} sm={6} md={3} key={name}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 800 }}>
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
                  {name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
