import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
  Typography,
} from '@mui/material';
import { useCreateJob, useUpdateJob } from '../../features/jobs/jobQueries';

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

// UI-facing status labels mapped to the backend's actual enum ('open' | 'closed' | 'draft')
const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'open' },
];

const schema = yup.object({
  title: yup.string().required('Job title is required'),
  company: yup.string().required('Company is required'),
  department: yup.string().required('Department is required'),
  location: yup.string().required('Location is required'),
  employmentType: yup.string().oneOf(EMPLOYMENT_TYPES).required('Employment type is required'),
  experience: yup.string().required('Experience required is required'),
  salary: yup.string().optional(),
  description: yup.string().required('Job description is required'),
  responsibilities: yup.string().optional(),
  skills: yup.string().optional(),
  requirements: yup.string().optional(),
  applicationDeadline: yup.string().optional(),
  status: yup.string().oneOf(['draft', 'open']).required(),
});

const emptyDefaults = {
  title: '',
  company: '',
  department: '',
  location: '',
  employmentType: 'Full-time',
  experience: '',
  salary: '',
  description: '',
  responsibilities: '',
  skills: '',
  requirements: '',
  applicationDeadline: '',
  status: 'draft',
};

// Backend stores responsibilities/requirements/skills as arrays; the form edits
// them as newline (or comma) separated text for simplicity, converted at the edges.
const toLines = (arr = []) => arr.join('\n');
const toCsv = (arr = []) => arr.join(', ');
const linesToArray = (text = '') => text.split('\n').map((s) => s.trim()).filter(Boolean);
const csvToArray = (text = '') => text.split(',').map((s) => s.trim()).filter(Boolean);

export default function JobFormModal({ open, onClose, job }) {
  const isEdit = Boolean(job);
  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (open) {
      reset(
        job
          ? {
              title: job.title || '',
              company: job.company || '',
              department: job.department || '',
              location: job.location || '',
              employmentType: job.employmentType || 'Full-time',
              experience: job.experience || '',
              salary: job.salary || '',
              description: job.description || '',
              responsibilities: toLines(job.responsibilities),
              skills: toCsv(job.skills),
              requirements: toLines(job.requirements),
              applicationDeadline: job.applicationDeadline
                ? job.applicationDeadline.slice(0, 10)
                : '',
              status: job.status === 'open' ? 'open' : 'draft',
            }
          : emptyDefaults
      );
      mutation.reset?.();
    }
  }, [open, job]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      company: values.company,
      department: values.department,
      location: values.location,
      employmentType: values.employmentType,
      experience: values.experience,
      salary: values.salary || undefined,
      description: values.description,
      responsibilities: linesToArray(values.responsibilities),
      skills: csvToArray(values.skills),
      requirements: linesToArray(values.requirements),
      applicationDeadline: values.applicationDeadline || undefined,
      status: values.status,
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ jobId: job.id, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch {
      // error surfaced via mutation.isError below
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit Job' : 'Add New Job'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error?.response?.data?.message || 'Something went wrong. Please try again.'}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Job Title" {...register('title')} error={!!errors.title} helperText={errors.title?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company" {...register('company')} error={!!errors.company} helperText={errors.company?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Department" {...register('department')} error={!!errors.department} helperText={errors.department?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location" {...register('location')} error={!!errors.location} helperText={errors.location?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth label="Employment Type" error={!!errors.employmentType} helperText={errors.employmentType?.message}>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Experience Required" placeholder="e.g. 2-4 years" {...register('experience')} error={!!errors.experience} helperText={errors.experience?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Salary (optional)" placeholder="e.g. ₹6-9 LPA" {...register('salary')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Application Deadline" InputLabelProps={{ shrink: true }} {...register('applicationDeadline')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth label="Job Status">
                    {STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline minRows={3} label="Job Description" {...register('description')} error={!!errors.description} helperText={errors.description?.message} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">One per line</Typography>
              <TextField fullWidth multiline minRows={3} label="Responsibilities" {...register('responsibilities')} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">Comma separated</Typography>
              <TextField fullWidth label="Required Skills" placeholder="React, Node.js, SQL" {...register('skills')} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">One per line</Typography>
              <TextField fullWidth multiline minRows={3} label="Qualifications" {...register('requirements')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Job'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}