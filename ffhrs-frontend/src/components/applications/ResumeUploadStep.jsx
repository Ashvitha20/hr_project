import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Grid,
  Typography,
  Button,
  Paper,
  Stack,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import { useMyProfile } from '../../features/candidate/candidateQueries';

const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function FileDropZone({ label, accept, hint, file, onChange, error }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        borderStyle: 'dashed',
        textAlign: 'center',
        borderColor: error ? 'error.main' : undefined,
      }}
    >
      <UploadFileIcon color={error ? 'error' : 'action'} sx={{ fontSize: 36, mb: 1 }} />
      <Typography variant="subtitle2">{label}</Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        {hint}
      </Typography>
      <Button variant="outlined" component="label" size="small">
        Choose File
        <input
          type="file"
          hidden
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </Button>
      {file && (
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" sx={{ mt: 1.5 }}>
          <DescriptionIcon fontSize="small" color="secondary" />
          <Chip label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`} size="small" />
        </Stack>
      )}
      {error && (
        <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
}

export default function ResumeUploadStep() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { data } = useMyProfile();
  const savedResume = data?.data?.profile?.resume || null;
  const hasSavedResume = Boolean(savedResume?.url);

  const [resumeMode, setResumeMode] = useState(hasSavedResume ? 'existing' : 'new');

  const handleModeChange = (_e, nextMode) => {
    if (!nextMode) return;
    setResumeMode(nextMode);
    if (nextMode === 'existing') {
      setValue('resumeFile', null);
      setValue('useExistingResume', true);
      setValue('existingResumeUrl', savedResume?.url || '');
    } else {
      setValue('useExistingResume', false);
      setValue('existingResumeUrl', '');
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Resume & Cover Letter
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        {hasSavedResume && (
          <ToggleButtonGroup
            value={resumeMode}
            exclusive
            onChange={handleModeChange}
            size="small"
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="existing">Use my saved resume</ToggleButton>
            <ToggleButton value="new">Upload a new resume</ToggleButton>
          </ToggleButtonGroup>
        )}

        {resumeMode === 'existing' && hasSavedResume ? (
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <DescriptionIcon color="secondary" sx={{ fontSize: 36, mb: 1 }} />
            <Typography variant="subtitle2">{savedResume.originalName || 'My saved resume'}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Saved on your profile — no need to upload again
            </Typography>
            <Button size="small" href={savedResume.url} target="_blank" rel="noopener">
              Preview
            </Button>
          </Paper>
        ) : (
          <Controller
            name="resumeFile"
            control={control}
            rules={{
              validate: (file) => {
                if (resumeMode === 'existing') return true;
                if (!file) return 'Resume is required';
                if (!ACCEPTED_RESUME_TYPES.includes(file.type)) return 'Only PDF, DOC or DOCX files are allowed';
                if (file.size > MAX_SIZE_BYTES) return 'File must be 5 MB or smaller';
                return true;
              },
            }}
            render={({ field: { value, onChange } }) => (
              <FileDropZone
                label="Resume (required)"
                hint="PDF, DOC or DOCX — max 5 MB"
                accept=".pdf,.doc,.docx"
                file={value}
                onChange={onChange}
                error={errors.resumeFile?.message}
              />
            )}
          />
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="coverLetterFile"
          control={control}
          rules={{
            validate: (file) => {
              if (!file) return true;
              if (!ACCEPTED_RESUME_TYPES.includes(file.type)) return 'Only PDF, DOC or DOCX files are allowed';
              if (file.size > MAX_SIZE_BYTES) return 'File must be 5 MB or smaller';
              return true;
            },
          }}
          render={({ field: { value, onChange } }) => (
            <FileDropZone
              label="Cover Letter (optional)"
              hint="PDF, DOC or DOCX — max 5 MB"
              accept=".pdf,.doc,.docx"
              file={value}
              onChange={onChange}
              error={errors.coverLetterFile?.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}