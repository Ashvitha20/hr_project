import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Button, Stack, Card, CardContent, Avatar } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import PaymentsIcon from '@mui/icons-material/Payments';
import SchoolIcon from '@mui/icons-material/School';
import CampaignIcon from '@mui/icons-material/Campaign';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LanguageIcon from '@mui/icons-material/Language';
import SectionHeading from '../../components/common/SectionHeading';
import JobCard from '../../components/common/JobCard';
import heroImage from '../../assets/hero.png';
import { usePublicJobs } from '../../features/jobs/jobQueries';
import { usePublicTestimonials } from '../../features/testimonials/testimonialQueries';

const services = [
  { icon: <GroupsIcon />, title: 'Recruitment', desc: 'End-to-end hiring for every level and function.' },
  { icon: <WorkIcon />, title: 'Executive Search', desc: 'Confidential search for leadership and C-suite roles.' },
  { icon: <PaymentsIcon />, title: 'Payroll Services', desc: 'Accurate, compliant payroll processing at scale.' },
  { icon: <GroupsIcon />, title: 'Contract Staffing', desc: 'Flexible workforce solutions for project needs.' },
  { icon: <SchoolIcon />, title: 'HR Consulting', desc: 'Strategic HR advisory tailored to your business.' },
  { icon: <SchoolIcon />, title: 'Training & Development', desc: 'Upskilling programs that grow with your team.' },
  { icon: <CampaignIcon />, title: 'Digital Marketing', desc: 'Targeted campaigns that build employer brand.' },
  { icon: <EditNoteIcon />, title: 'Content Writing', desc: 'Compelling content that connects with your audience.' },
  { icon: <LanguageIcon />, title: 'Website Development', desc: 'Custom, user-friendly web experiences.' },
];

export default function HomePage() {
  const { data, isLoading } = usePublicJobs({ limit: 3 });
  const featuredJobs = data?.data?.jobs || [];
  const { data: testimonialsData } = usePublicTestimonials();
  const testimonials = testimonialsData?.data?.testimonials || [];

  return (
    <Box>
      {/* HERO */}
      <Box sx={{ bgcolor: 'background.default', pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 700 }}>
                HR RECRUITMENT · EXECUTIVE SEARCH · PAYROLL
              </Typography>
              <Typography variant="h2" sx={{ mt: 1, color: 'primary.dark', lineHeight: 1.2 }}>
                Connecting exceptional talent with visionary organizations
              </Typography>
              <Typography variant="body1" sx={{ mt: 3, color: 'text.secondary', maxWidth: 480 }}>
                Future Focus HR Solutions helps you source, select, and retain top talent —
                backed by tailored recruitment, payroll, and consulting expertise across industries.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                <Button component={Link} to="/careers" size="large" variant="contained" color="secondary">
                  Browse Jobs
                </Button>
                <Button component={Link} to="/contact" size="large" variant="outlined" color="primary">
                  Hire Talent
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={heroImage}
                alt="Future Focus HR Solutions team collaborating"
                sx={{ width: '100%', borderRadius: 4, boxShadow: 6 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SERVICES */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading
          eyebrow="What we do"
          title="Full-spectrum HR & talent services"
          subtitle="From individual hires to complete workforce strategy, we cover every stage of the employee lifecycle."
        />
        <Grid container spacing={3}>
          {services.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.title}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, p: 1 }}>
                <CardContent>
                  <Avatar sx={{ bgcolor: 'secondary.main', mb: 2 }}>{s.icon}</Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {s.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FEATURED JOBS */}
      {(isLoading || featuredJobs.length > 0) && (
        <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
          <Container maxWidth="lg">
            <SectionHeading eyebrow="Career Portal" title="Featured Openings" align="left" />
            <Grid container spacing={3}>
              {featuredJobs.map((job) => (
                <Grid item xs={12} md={4} key={job.id}>
                  <JobCard job={job} />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button component={Link} to="/careers" variant="contained" color="primary">
                View All Jobs
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* TESTIMONIALS */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <SectionHeading eyebrow="Client Voices" title="What our clients say" />
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
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.role}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
