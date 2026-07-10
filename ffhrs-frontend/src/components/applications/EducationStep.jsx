import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const emptyEducation = {
  qualification: '',
  schoolName: '',
  collegeName: '',
  university: '',
  department: '',
  yearOfPassing: '',
  percentageOrCgpa: '',
};

export default function EducationStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });
  const educationErrors = errors.education || [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Education
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add every qualification, starting with SSLC/HSC through your highest degree.
        </Typography>
      </Grid>

      {fields.map((field, index) => {
        const rowErrors = educationErrors[index] || {};
        return (
          <Grid item xs={12} key={field.id}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Qualification {index + 1}</Typography>
                {fields.length > 1 && (
                  <IconButton size="small" onClick={() => remove(index)} aria-label="Remove qualification">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Qualification (e.g. SSLC, HSC, UG, PG)"
                    {...register(`education.${index}.qualification`)}
                    error={!!rowErrors.qualification}
                    helperText={rowErrors.qualification?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="School Name"
                    {...register(`education.${index}.schoolName`)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="College Name"
                    {...register(`education.${index}.collegeName`)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="University"
                    {...register(`education.${index}.university`)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Department / Branch"
                    {...register(`education.${index}.department`)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Year of Passing"
                    {...register(`education.${index}.yearOfPassing`)}
                    error={!!rowErrors.yearOfPassing}
                    helperText={rowErrors.yearOfPassing?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Percentage / CGPA"
                    {...register(`education.${index}.percentageOrCgpa`)}
                    error={!!rowErrors.percentageOrCgpa}
                    helperText={rowErrors.percentageOrCgpa?.message}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        );
      })}

      <Grid item xs={12}>
        <Button startIcon={<AddIcon />} onClick={() => append(emptyEducation)} variant="outlined">
          Add Another Qualification
        </Button>
      </Grid>
    </Grid>
  );
}
