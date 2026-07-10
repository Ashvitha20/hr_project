import { Controller, useFormContext } from 'react-hook-form';
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

function YesNoField({ name, label, control }) {
  return (
    <Grid item xs={12} sm={6}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ fontSize: '0.875rem' }}>
              {label}
            </FormLabel>
            <RadioGroup row {...field}>
              <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
              <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
            </RadioGroup>
          </FormControl>
        )}
      />
    </Grid>
  );
}

export default function AdditionalQuestionsStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const q = errors.additionalInfo || {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Additional Questions
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Why do you want this job?"
          {...register('additionalInfo.whyThisJob')}
          error={!!q.whyThisJob}
          helperText={q.whyThisJob?.message}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Current Salary" {...register('additionalInfo.currentSalary')} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Expected Salary" {...register('additionalInfo.expectedSalary')} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Notice Period" {...register('additionalInfo.noticePeriod')} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Current Location" {...register('additionalInfo.currentLocation')} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Preferred Location" {...register('additionalInfo.preferredLocation')} />
      </Grid>

      <YesNoField name="additionalInfo.willingToRelocate" label="Are you willing to relocate?" control={control} />
      <YesNoField
        name="additionalInfo.priorInterviewWithCompany"
        label="Have you attended interviews with this company before?"
        control={control}
      />
      <YesNoField name="additionalInfo.hasBondObligation" label="Do you have any bond obligations?" control={control} />
      <YesNoField
        name="additionalInfo.comfortableWithShifts"
        label="Are you comfortable working shifts?"
        control={control}
      />

      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          label="Any additional information"
          {...register('additionalInfo.additionalNotes')}
        />
      </Grid>
    </Grid>
  );
}
