import { useFormContext } from 'react-hook-form';
import { Grid, Typography, Paper, Box, Chip, Divider, Alert } from '@mui/material';

function ReviewSection({ title, children }) {
  return (
    <Grid item xs={12}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 1 }}>
        {children}
      </Paper>
    </Grid>
  );
}

export default function ReviewStep({ job }) {
  const { getValues } = useFormContext();
  const values = getValues();
  const { personalInfo, education, internships, experience, skills, certifications, additionalInfo } = values;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 1 }}>
          Please review your application for <strong>{job?.title}</strong> at {job?.company} before submitting.
        </Alert>
      </Grid>

      <ReviewSection title="Personal Information">
        <Typography variant="body2">
          {personalInfo?.fullName} · {personalInfo?.email} · {personalInfo?.phone}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {personalInfo?.address}, {personalInfo?.city}, {personalInfo?.state}, {personalInfo?.country} -{' '}
          {personalInfo?.pinCode}
        </Typography>
      </ReviewSection>

      <ReviewSection title={`Education (${education?.length || 0})`}>
        {education?.map((e, i) => (
          <Box key={i} sx={{ mb: i < education.length - 1 ? 1.5 : 0 }}>
            <Typography variant="body2">
              {e.qualification} — {e.collegeName || e.schoolName} ({e.yearOfPassing})
            </Typography>
            {i < education.length - 1 && <Divider sx={{ mt: 1 }} />}
          </Box>
        ))}
      </ReviewSection>

      <ReviewSection title={`Internships (${internships?.length || 0})`}>
        {internships?.length ? (
          internships.map((it, i) => (
            <Typography variant="body2" key={i}>
              {it.role} at {it.company} ({it.duration})
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">None added</Typography>
        )}
      </ReviewSection>

      <ReviewSection title={`Work Experience (${experience?.length || 0})`}>
        {experience?.length ? (
          experience.map((ex, i) => (
            <Typography variant="body2" key={i}>
              {ex.role} at {ex.company} ({ex.duration})
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">Fresher — no work experience</Typography>
        )}
      </ReviewSection>

      <ReviewSection title="Skills & Certifications">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: certifications?.length ? 1.5 : 0 }}>
          {skills?.map((s) => (
            <Chip key={s} label={s} size="small" color="secondary" variant="outlined" />
          ))}
        </Box>
        {certifications?.map((c, i) => (
          <Typography variant="body2" key={i}>
            {c.name} — {c.organization} ({c.completionYear})
          </Typography>
        ))}
      </ReviewSection>

      <ReviewSection title="Resume & Cover Letter">
        <Typography variant="body2">Resume: {values.resumeFile?.name || 'Not attached'}</Typography>
        <Typography variant="body2">
          Cover Letter: {values.coverLetterFile?.name || 'Not attached (optional)'}
        </Typography>
      </ReviewSection>

      <ReviewSection title="Additional Questions">
        <Typography variant="body2">Expected Salary: {additionalInfo?.expectedSalary || '—'}</Typography>
        <Typography variant="body2">Notice Period: {additionalInfo?.noticePeriod || '—'}</Typography>
        <Typography variant="body2">Willing to relocate: {additionalInfo?.willingToRelocate || '—'}</Typography>
      </ReviewSection>
    </Grid>
  );
}
