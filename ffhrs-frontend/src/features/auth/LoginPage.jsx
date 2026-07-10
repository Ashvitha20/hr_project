import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Alert,
  Stack,
} from '@mui/material';
import logo from '../../assets/logo.jpeg';
import axiosClient from '../../api/axiosClient';
import { setCredentials } from './authSlice';

const dashboardPathByRole = {
  candidate: '/candidate/dashboard',
  hr: '/hr/dashboard',
  recruiter: '/hr/dashboard',
  admin: '/admin/dashboard',
};

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginPage() {
  const [serverError, setServerError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Set by ProtectedRoute when an unauthenticated visitor is bounced from a
  // page like /careers/:jobId/apply — send them straight back there instead
  // of to the generic role dashboard.
  const from = location.state?.from;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      // POST /auth/login — backend determines role from the account record
      const { data: res } = await axiosClient.post('/auth/login', data);
      dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
      // Only honor `from` if it matches the user's own role area (e.g. don't
      // send an HR login back to a candidate-only apply page).
      const fromPath = from?.pathname;
      const canReturnToFrom =
        fromPath && (!fromPath.startsWith('/candidate') || res.user.role === 'candidate') &&
        (!fromPath.startsWith('/hr') || ['hr', 'recruiter'].includes(res.user.role)) &&
        (!fromPath.startsWith('/admin') || res.user.role === 'admin');
      navigate(canReturnToFrom ? fromPath : dashboardPathByRole[res.user.role] || '/', { replace: true });
    } catch (err) {
      setServerError(err?.response?.data?.message || 'Invalid email or password.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 8, md: 12 } }}>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img src={logo} alt="Future Focus HR Solutions" style={{ height: 40 }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', mb: 3 }}>
          Sign in to your account
        </Typography>

        {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField label="Email" fullWidth {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
            <TextField label="Password" type="password" fullWidth {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControlLabel control={<Checkbox size="small" />} label={<Typography variant="body2">Remember me</Typography>} />
              <Typography component={Link} to="/forgot-password" variant="body2" color="primary.main">
                Forgot password?
              </Typography>
            </Stack>
            <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
          Don't have an account?{' '}
          <Box
            component={Link}
            to="/register"
            state={{ from }}
            sx={{ color: 'primary.main', fontWeight: 600 }}
          >
            Create one
          </Box>
        </Typography>
      </Paper>
    </Container>
  );
}
