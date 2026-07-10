import { Container, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SectionHeading from '../../components/common/SectionHeading';

const faqs = [
  { q: 'What industries does Future Focus HR Solutions serve?', a: 'We work across IT, finance, healthcare, manufacturing, sales & marketing, HR & administration, telecommunications, and education.' },
  { q: 'How do I apply for a job on the career portal?', a: 'Browse open roles under Careers, click into a listing, and use the Apply button. You will need a candidate profile with your resume uploaded.' },
  { q: 'Can I edit or withdraw my application after submitting?', a: 'Yes — from your Candidate Dashboard under Applied Jobs, you can view status and withdraw an active application.' },
  { q: 'Do you offer contract or temporary staffing?', a: 'Yes, we provide flexible contract staffing solutions in addition to full-time recruitment.' },
  { q: 'How does payroll outsourcing work with FFHRS?', a: 'We handle end-to-end payroll processing, statutory compliance, and reporting so your internal team can focus on strategic HR work.' },
];

export default function FAQPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading eyebrow="Support" title="Frequently Asked Questions" />
      {faqs.map((f) => (
        <Accordion key={f.q} sx={{ mb: 1, borderRadius: 2, '&:before': { display: 'none' } }} variant="outlined">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>{f.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">{f.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}
