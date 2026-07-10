import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Switch, FormControlLabel, Stack, Button, Alert } from '@mui/material';
import { PageLoader } from '../../../components/common/Loader';
import { useMySettings, useUpdateMySettings } from '../../../features/candidate/candidateQueries';

export default function SettingsPage() {
  const { data, isLoading, isError, error } = useMySettings();
  const updateMutation = useUpdateMySettings();

  const [settings, setSettings] = useState({ emailNotifications: true, smsNotifications: false });

  useEffect(() => {
    const remote = data?.data?.settings;
    if (remote) {
      setSettings({
        emailNotifications: Boolean(remote.emailNotifications),
        smsNotifications: Boolean(remote.smsNotifications),
      });
    }
  }, [data]);

  const handleToggle = (field) => (event) => {
    setSettings((prev) => ({ ...prev, [field]: event.target.checked }));
  };

  const handleSave = () => {
    updateMutation.mutate(settings);
  };

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || 'Could not load your settings right now.'}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Settings
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {updateMutation.error?.response?.data?.message || 'Could not save your settings.'}
        </Alert>
      )}
      {updateMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings updated.
        </Alert>
      )}

      <Card variant="outlined" sx={{ borderRadius: 3, maxWidth: 480 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Notification Preferences
          </Typography>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleToggle('emailNotifications')}
                  color="secondary"
                />
              }
              label="Email notifications"
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mt: -1 }}>
              Get emailed about application status changes and interview updates.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.smsNotifications}
                  onChange={handleToggle('smsNotifications')}
                  color="secondary"
                />
              }
              label="SMS notifications"
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 6, mt: -1 }}>
              Get text alerts for interview reminders.
            </Typography>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}