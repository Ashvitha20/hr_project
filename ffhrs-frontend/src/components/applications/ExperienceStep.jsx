import { useFieldArray, useFormContext } from 'react-hook-form';
import { Grid, TextField, Typography, Button, IconButton, Paper, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const emptyExperience = { company: '', role: '', duration: '', responsibilities: '' };

export default function ExperienceStep() {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Work Experience
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Freshers can leave this section empty and continue to the next step.
        </Typography>
      </Grid>

      {fields.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            No work experience added yet.
          </Typography>
        </Grid>
      )}

      {fields.map((field, index) => (
        <Grid item xs={12} key={field.id}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Experience {index + 1}</Typography>
              <IconButton size="small" onClick={() => remove(index)} aria-label="Remove experience">
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Company" {...register(`experience.${index}.company`)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Role" {...register(`experience.${index}.role`)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Duration (e.g. Jan 2022 - Mar 2024)" {...register(`experience.${index}.duration`)} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Responsibilities"
                  {...register(`experience.${index}.responsibilities`)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button startIcon={<AddIcon />} onClick={() => append(emptyExperience)} variant="outlined">
          Add Work Experience
        </Button>
      </Grid>
    </Grid>
  );
}
