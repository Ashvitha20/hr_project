import { Container, Grid, Card, CardContent, Typography, Stack, Avatar } from '@mui/material';
import SectionHeading from '../../components/common/SectionHeading';
import { PageLoader } from '../../components/common/Loader';
import { usePublicTestimonials } from '../../features/testimonials/testimonialQueries';

export default function TestimonialsPage() {
  const { data, isLoading } = usePublicTestimonials();
  const testimonials = data?.data?.testimonials || [];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading eyebrow="Client Voices" title="What our clients say" />

      {isLoading && <PageLoader />}

      {!isLoading && testimonials.length === 0 && (
        <Typography color="text.secondary" align="center">
          No testimonials to show yet.
        </Typography>
      )}

      <Grid container spacing={3}>
        {testimonials.map((t) => (
          <Grid item xs={12} md={4} key={t.id}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
              <CardContent>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  “{t.quote}”
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{t.name[0]}</Avatar>
                  <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}