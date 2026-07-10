import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SectionHeading from '../../components/common/SectionHeading';
import axiosClient from '../../api/axiosClient';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9+\-\s]{7,15}$/, 'Enter a valid phone number').required('Phone is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().min(10, 'Message should be at least 10 characters').required('Message is required'),
});

export default function ContactPage() {
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setStatus(null);
    try {
      // POST /contact — stores the message and triggers admin notification + auto-reply
      await axiosClient.post('/contact', data);
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading eyebrow="Get in touch" title="Contact Us" subtitle="Have a hiring need or a question about our services? Send us a message." />
      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <LocationOnIcon color="secondary" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Office</Typography>
                <Typography variant="body2" color="text.secondary">Chennai, Tamil Nadu, India</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <PhoneIcon color="secondary" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Call Us</Typography>
                <Typography variant="body2" color="text.secondary">+91 96554 41229</Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <EmailIcon color="secondary" />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Email</Typography>
                <Typography variant="body2" color="text.secondary">team@ffhrs.com</Typography>
              </Box>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {status === 'success' && <Alert severity="success" sx={{ mb: 2 }}>Message sent — we'll get back to you shortly.</Alert>}
            {status === 'error' && <Alert severity="error" sx={{ mb: 2 }}>Something went wrong. Please try again.</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Subject" {...register('subject')} error={!!errors.subject} helperText={errors.subject?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={5} label="Message" {...register('message')} error={!!errors.message} helperText={errors.message?.message} />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="secondary" size="large" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
