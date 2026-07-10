import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Paper,
  Alert,
  Stack,
  Pagination,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import { CardSkeleton } from '../../../components/common/Loader';
import axiosClient from '../../../api/axiosClient';

// Kept self-contained (no separate service/queries files) since this is the
// only screen that needs Contact Message data — mirrors the inline pattern
// already used for the message count on AdminDashboard.jsx.

const STATUS_META = {
  new: { label: 'Unread', color: 'secondary' },
  read: { label: 'Read', color: 'default' },
  responded: { label: 'Responded', color: 'success' },
  archived: { label: 'Archived', color: 'default' },
};

async function fetchMessages(params) {
  const { data } = await axiosClient.get('/admin/contact-messages', { params });
  return data;
}

async function updateMessageStatus(id, status) {
  const { data } = await axiosClient.patch(`/admin/contact-messages/${id}`, { status });
  return data;
}

async function replyToMessage(id, replyMessage) {
  const { data } = await axiosClient.post(`/admin/contact-messages/${id}/reply`, { replyMessage });
  return data;
}

async function deleteMessage(id) {
  const { data } = await axiosClient.delete(`/admin/contact-messages/${id}`);
  return data;
}

export default function ContactMessagesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyError, setReplyError] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'contact-messages', { search, status, page }],
    queryFn: () => fetchMessages({ search: search || undefined, status: status || undefined, page, limit: 15 }),
    keepPreviousData: true,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'contact-messages'] });

  const statusMutation = useMutation({
    mutationFn: ({ id, status: s }) => updateMessageStatus(id, s),
    onSuccess: invalidate,
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, replyMessage }) => replyToMessage(id, replyMessage),
    onSuccess: () => {
      invalidate();
      setReplyTarget(null);
      setReplyText('');
    },
    onError: (err) => setReplyError(err?.response?.data?.message || 'Could not send reply.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMessage(id),
    onSuccess: invalidate,
  });

  const messages = data?.data?.messages || [];
  const pagination = data?.data?.pagination;

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const toggleRead = (msg) => {
    statusMutation.mutate({ id: msg.id, status: msg.status === 'new' ? 'read' : 'new' });
  };

  const openReply = (msg) => {
    setReplyTarget(msg);
    setReplyText('');
    setReplyError('');
  };

  const submitReply = () => {
    if (!replyTarget || replyText.trim().length < 5) {
      setReplyError('Reply must be at least 5 characters.');
      return;
    }
    replyMutation.mutate({ id: replyTarget.id, replyMessage: replyText.trim() });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Contact Messages</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            placeholder="Search by name, email, or subject"
            value={search}
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} label="Status" onChange={(e) => handleFilterChange(setStatus)(e.target.value)}>
              <MenuItem value="">All Statuses</MenuItem>
              {Object.entries(STATUS_META).map(([value, meta]) => (
                <MenuItem key={value} value={value}>{meta.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.response?.data?.message || 'Could not load messages.'}
        </Alert>
      )}

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : messages.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography color="text.secondary">No messages match your filters.</Typography>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Received</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((msg) => {
                const meta = STATUS_META[msg.status] || { label: msg.status, color: 'default' };
                return (
                  <TableRow key={msg.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: msg.status === 'new' ? 700 : 500 }}>{msg.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{msg.email} · {msg.phone}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography sx={{ fontWeight: 600 }}>{msg.subject}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>{msg.message}</Typography>
                    </TableCell>
                    <TableCell>{new Date(msg.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip size="small" label={meta.label} color={meta.color} variant={meta.color === 'default' ? 'outlined' : 'filled'} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" title={msg.status === 'new' ? 'Mark as read' : 'Mark as unread'} onClick={() => toggleRead(msg)}>
                        {msg.status === 'new' ? <MarkEmailReadIcon fontSize="small" /> : <MarkEmailUnreadIcon fontSize="small" />}
                      </IconButton>
                      <IconButton size="small" title="Reply" onClick={() => openReply(msg)}>
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" title="Delete" onClick={() => deleteMutation.mutate(msg.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {pagination && pagination.pages > 1 && (
        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={pagination.page}
            onChange={(_, value) => setPage(value)}
            color="secondary"
          />
        </Stack>
      )}

      <Dialog open={Boolean(replyTarget)} onClose={() => setReplyTarget(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Reply to {replyTarget?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Original message: "{replyTarget?.message}"
          </Typography>
          {replyError && <Alert severity="error" sx={{ mb: 2 }}>{replyError}</Alert>}
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Your reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Typography variant="caption" color="text.secondary">
            This is sent as a real email to {replyTarget?.email} via the backend's Nodemailer service.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyTarget(null)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={submitReply} disabled={replyMutation.isPending}>
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}