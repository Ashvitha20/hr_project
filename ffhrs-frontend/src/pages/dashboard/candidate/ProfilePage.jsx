import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Alert,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import { PageLoader } from '../../../components/common/Loader';
import {
  useMyProfile,
  useUpdateMyProfile,
  useUploadResume,
} from '../../../features/candidate/candidateQueries';

function ListFieldEditor({ label, items, onChange }) {
  const [draft, setDraft] = useState('');

  const addItem = () => {
    if (!draft.trim()) return;
    onChange([...items, draft.trim()]);
    setDraft('');
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>{label}</Typography>
      <Stack spacing={1} sx={{ mb: 1 }}>
        {items.map((item, index) => (
          <Stack key={`${item}-${index}`} direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>{item}</Typography>
            <IconButton size="small" onClick={() => removeItem(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          fullWidth
          placeholder={`Add ${label.toLowerCase()}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button variant="outlined" onClick={addItem} startIcon={<AddIcon />}>Add</Button>
      </Stack>
    </Box>
  );
}

function ResumeCard({ resume }) {
  const uploadMutation = useUploadResume();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Resume</Typography>

        {uploadMutation.isSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>Resume uploaded.</Alert>
        )}
        {uploadMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadMutation.error?.response?.data?.message || 'Could not upload your resume.'}
          </Alert>
        )}

        <Stack direction="row" alignItems="center" spacing={2}>
          {resume?.url ? (
            <>
              <DescriptionIcon color="secondary" />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">{resume.originalName}</Typography>
                <Button size="small" href={resume.url} target="_blank" rel="noopener" sx={{ pl: 0 }}>
                  Preview
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              No resume uploaded yet — add one so you can apply faster next time.
            </Typography>
          )}
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading…' : resume?.url ? 'Replace' : 'Upload'}
            <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { data, isLoading, isError, error } = useMyProfile();
  const updateMutation = useUpdateMyProfile();

  const [form, setForm] = useState({
    headline: '',
    education: [],
    experience: [],
    skills: [],
    certificates: [],
  });
  const [skillDraft, setSkillDraft] = useState('');

  useEffect(() => {
    const profile = data?.data?.profile;
    if (profile) {
      setForm({
        headline: profile.headline || '',
        education: profile.education || [],
        experience: profile.experience || [],
        skills: profile.skills || [],
        certificates: profile.certificates || [],
      });
    }
  }, [data]);

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load your profile right now.'}
      </Alert>
    );
  }

  const addSkill = () => {
    if (!skillDraft.trim()) return;
    setForm((f) => ({ ...f, skills: [...f.skills, skillDraft.trim()] }));
    setSkillDraft('');
  };

  const removeSkill = (skill) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const handleSave = () => {
    updateMutation.mutate(form);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>My Profile</Typography>

      <ResumeCard resume={data?.data?.profile?.resume} />

      {updateMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>Profile updated.</Alert>
      )}
      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {updateMutation.error?.response?.data?.message || 'Could not save your profile.'}
        </Alert>
      )}

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Headline</Typography>
          <TextField
            fullWidth
            placeholder="e.g. Senior Frontend Developer with 5 years experience"
            value={form.headline}
            onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
          />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <ListFieldEditor
                label="Education"
                items={form.education}
                onChange={(education) => setForm((f) => ({ ...f, education }))}
              />
              <ListFieldEditor
                label="Experience"
                items={form.experience}
                onChange={(experience) => setForm((f) => ({ ...f, experience }))}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Skills</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
                {form.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => removeSkill(skill)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Add a skill"
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button variant="outlined" onClick={addSkill} startIcon={<AddIcon />}>Add</Button>
              </Stack>

              <ListFieldEditor
                label="Certificates"
                items={form.certificates}
                onChange={(certificates) => setForm((f) => ({ ...f, certificates }))}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
        </Button>
      </Box>
    </Box>
  );
}