import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PageLoader } from '../../../components/common/Loader';
import {
  useManagedBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  usePublishBlogPost,
  useUnpublishBlogPost,
  useDeleteBlogPost,
} from '../../../features/blog/blogQueries';

const emptyForm = { title: '', excerpt: '', content: '', category: '', status: 'draft' };

export default function ManageBlogsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading, isError, error } = useManagedBlogPosts();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const publishMutation = usePublishBlogPost();
  const unpublishMutation = useUnpublishBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const posts = data?.data?.posts || [];
  const saveMutation = editingId ? updateMutation : createMutation;

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      status: post.status,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ blogId: editingId, payload: form }, { onSuccess: handleClose });
    } else {
      createMutation.mutate(form, { onSuccess: handleClose });
    }
  };

  const handleDelete = (post) => {
    if (window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(post.id);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Manage Blog
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Write, edit, publish, and unpublish articles shown on the public blog.
          </Typography>
        </Box>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={openCreate}>
          New Post
        </Button>
      </Stack>

      {isLoading && <PageLoader />}

      {isError && (
        <Alert severity="error">{error?.response?.data?.message || 'Could not load blog posts right now.'}</Alert>
      )}

      {!isLoading && !isError && (
        <Card variant="outlined" sx={{ borderRadius: 3, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No blog posts yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {posts.map((post) => (
                <TableRow key={post.id} hover>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={post.status}
                      color={post.status === 'published' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" onClick={() => openEdit(post)}>
                        Edit
                      </Button>
                      {post.status === 'published' ? (
                        <Button
                          size="small"
                          color="warning"
                          onClick={() => unpublishMutation.mutate(post.id)}
                          disabled={unpublishMutation.isPending}
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          color="success"
                          onClick={() => publishMutation.mutate(post.id)}
                          disabled={publishMutation.isPending}
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(post)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Post' : 'New Post'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {saveMutation.isError && (
              <Alert severity="error">
                {saveMutation.error?.response?.data?.message || 'Could not save this post.'}
              </Alert>
            )}
            <TextField label="Title" value={form.title} onChange={handleChange('title')} fullWidth />
            <TextField label="Category" value={form.category} onChange={handleChange('category')} fullWidth />
            <TextField
              label="Excerpt"
              value={form.excerpt}
              onChange={handleChange('excerpt')}
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              label="Content"
              value={form.content}
              onChange={handleChange('content')}
              multiline
              rows={6}
              fullWidth
            />
            <TextField select label="Status" value={form.status} onChange={handleChange('status')} fullWidth>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={saveMutation.isPending || !form.title || !form.excerpt || !form.content || !form.category}
          >
            {saveMutation.isPending ? 'Saving…' : 'Save Post'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}