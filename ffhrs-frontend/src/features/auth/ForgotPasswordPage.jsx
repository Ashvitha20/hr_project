import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import logo from '../../assets/logo.jpeg';
import axiosClient from '../../api/axiosClient';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email }) => {
    setServerError('');
    try {
      // POST /auth/forgot-password — sends a reset link if the email exists
      await axiosClient.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 8, md: 12 } }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img src={logo} alt="Future Focus HR Solutions" style={{ height: 40 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}>
          Reset your password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Enter your email and we'll send you a link to reset your password.
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
        {sent ? (
          <Alert severity="success">If an account exists for that email, a reset link has been sent.</Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField fullWidth label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 2 }} />
            <Button type="submit" fullWidth size="large" variant="contained" color="secondary" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </Box>
        )}

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          <Box component={Link} to="/login" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Back to sign in
          </Box>
        </Typography>
      </Paper>
    </Container>
  );
}
