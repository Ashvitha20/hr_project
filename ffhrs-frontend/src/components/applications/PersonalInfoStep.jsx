import { Controller, useFormContext } from 'react-hook-form';
import {
  Grid,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';

const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function PersonalInfoStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const p = errors.personalInfo || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Personal Information
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Full Name"
          {...register('personalInfo.fullName')}
          error={!!p.fullName}
          helperText={p.fullName?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email"
          {...register('personalInfo.email')}
          error={!!p.email}
          helperText={p.email?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone Number"
          {...register('personalInfo.phone')}
          error={!!p.phone}
          helperText={p.phone?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Date of Birth"
          InputLabelProps={{ shrink: true }}
          {...register('personalInfo.dob')}
          error={!!p.dob}
          helperText={p.dob?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Controller
          name="personalInfo.gender"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="Gender"
              error={!!p.gender}
              helperText={p.gender?.message}
            >
              {genders.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          multiline
          minRows={2}
          {...register('personalInfo.address')}
          error={!!p.address}
          helperText={p.address?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="City"
          {...register('personalInfo.city')}
          error={!!p.city}
          helperText={p.city?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="State"
          {...register('personalInfo.state')}
          error={!!p.state}
          helperText={p.state?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Country"
          {...register('personalInfo.country')}
          error={!!p.country}
          helperText={p.country?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="PIN Code"
          {...register('personalInfo.pinCode')}
          error={!!p.pinCode}
          helperText={p.pinCode?.message}
        />
      </Grid>
    </Grid>
  );
}
