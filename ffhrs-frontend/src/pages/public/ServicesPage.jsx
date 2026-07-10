import { Container, Grid, Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import WorkIcon from '@mui/icons-material/Work';
import PaymentsIcon from '@mui/icons-material/Payments';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SchoolIcon from '@mui/icons-material/School';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import CampaignIcon from '@mui/icons-material/Campaign';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LanguageIcon from '@mui/icons-material/Language';
import SectionHeading from '../../components/common/SectionHeading';

const services = [
  { icon: <GroupsIcon />, title: 'Recruitment', desc: 'Full-cycle hiring — from needs assessment and sourcing through screening, interviews, and offer negotiation.' },
  { icon: <WorkIcon />, title: 'Executive Search', desc: 'Confidential, research-driven search for senior leadership and specialist roles.' },
  { icon: <PaymentsIcon />, title: 'Payroll Services', desc: 'End-to-end payroll processing, statutory compliance, and reporting.' },
  { icon: <AssignmentIndIcon />, title: 'Contract Staffing', desc: 'On-demand, compliant contract and temp workforce solutions.' },
  { icon: <SchoolIcon />, title: 'HR Consulting', desc: 'Policy design, org structuring, and HR process optimization.' },
  { icon: <ModelTrainingIcon />, title: 'Training & Development', desc: 'Custom learning programs to upskill and retain your workforce.' },
  { icon: <CampaignIcon />, title: 'Digital Marketing', desc: 'Targeted campaigns that build your employer brand and reach.' },
  { icon: <EditNoteIcon />, title: 'Content Writing', desc: 'Compelling, brand-aligned content across web, social, and print.' },
  { icon: <LanguageIcon />, title: 'Website Development', desc: 'Custom, responsive websites and web applications.' },
];

export default function ServicesPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading
        eyebrow="Our Services"
        title="Everything you need, under one roof"
        subtitle="Recruitment, payroll, consulting, and digital services — all editable and manageable from our Admin Dashboard for easy updates."
      />
      <Grid container spacing={3}>
        {services.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s.title}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: 3, p: 1 }}>
              <CardContent>
                <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>{s.icon}</Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{s.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{s.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
