import { useFieldArray, useFormContext } from 'react-hook-form';
import { Grid, TextField, Typography, Button, IconButton, Paper, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const emptyInternship = { company: '', role: '', duration: '', description: '' };

export default function InternshipStep() {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'internships' });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Internships
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Optional — add any internships you have completed.
        </Typography>
      </Grid>

      {fields.length === 0 && (
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            No internships added yet.
          </Typography>
        </Grid>
      )}

      {fields.map((field, index) => (
        <Grid item xs={12} key={field.id}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Internship {index + 1}</Typography>
              <IconButton size="small" onClick={() => remove(index)} aria-label="Remove internship">
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Company" {...register(`internships.${index}.company`)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Role" {...register(`internships.${index}.role`)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Duration (e.g. 3 months)" {...register(`internships.${index}.duration`)} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label="Description"
                  {...register(`internships.${index}.description`)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button startIcon={<AddIcon />} onClick={() => append(emptyInternship)} variant="outlined">
          Add Internship
        </Button>
      </Grid>
    </Grid>
  );
}
