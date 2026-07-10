import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import logo from '../../assets/logo.jpeg';
import axiosClient from '../../api/axiosClient';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9+\-\s]{7,15}$/, 'Enter a valid phone number').required('Phone is required'),
  password: yup.string().min(8, 'At least 8 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Carried over from LoginPage's "Create one" link so that, after
  // Register -> Login, the user lands back on the page (e.g. the Apply
  // form) that first sent them to sign in, instead of the home page.
  const from = location.state?.from;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      // POST /auth/register — creates a candidate account and sends a verification email
      await axiosClient.post('/auth/register', { ...data, role: 'candidate' });
      setSuccess(true);
      setTimeout(() => navigate('/login', { state: { from } }), 1500);
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 8, md: 10 } }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img src={logo} alt="Future Focus HR Solutions" style={{ height: 40 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}>
          Create your candidate profile
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Account created — check your email to verify, then sign in.</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" {...register('fullName')} error={!!errors.fullName} helperText={errors.fullName?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="password" label="Password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="password" label="Confirm Password" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth size="large" variant="contained" color="secondary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Already have an account?{' '}
          <Box component={Link} to="/login" state={{ from }} sx={{ color: 'primary.main', fontWeight: 600 }}>
            Sign in
          </Box>
        </Typography>
      </Paper>
    </Container>
  );
}
