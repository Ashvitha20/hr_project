import { useState } from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import {
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Chip,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const emptyCertification = { name: '', organization: '', completionYear: '' };

export default function SkillsCertificationsStep() {
  const { register, control } = useFormContext();
  const [skillInput, setSkillInput] = useState('');
  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({ control, name: 'certifications' });

  const addSkill = (skills, onChange) => {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) {
      onChange([...skills, value]);
    }
    setSkillInput('');
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Skills
        </Typography>
        <Controller
          name="skills"
          control={control}
          defaultValue={[]}
          render={({ field: { value = [], onChange } }) => (
            <>
              <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a skill and press Add (e.g. React, Excel, PLC)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(value, onChange);
                    }
                  }}
                />
                <Button variant="outlined" onClick={() => addSkill(value, onChange)}>
                  Add
                </Button>
              </Stack>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {value.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => onChange(value.filter((s) => s !== skill))}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </>
          )}
        />
      </Grid>

      <Grid item xs={12} sx={{ mt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Certifications
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Optional — add any relevant certifications.
        </Typography>
      </Grid>

      {certFields.map((field, index) => (
        <Grid item xs={12} key={field.id}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle2">Certification {index + 1}</Typography>
              <IconButton size="small" onClick={() => removeCert(index)} aria-label="Remove certification">
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Certificate Name" {...register(`certifications.${index}.name`)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Organization" {...register(`certifications.${index}.organization`)} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Completion Year"
                  {...register(`certifications.${index}.completionYear`)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button startIcon={<AddIcon />} onClick={() => appendCert(emptyCertification)} variant="outlined">
          Add Certification
        </Button>
      </Grid>
    </Grid>
  );
}
