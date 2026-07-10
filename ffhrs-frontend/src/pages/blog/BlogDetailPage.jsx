import { useParams } from 'react-router-dom';
import { Container, Typography, Chip, Stack, Divider } from '@mui/material';
import { PageLoader } from '../../components/common/Loader';
import { usePublicBlogPost } from '../../features/blog/blogQueries';
import NotFoundPage from '../public/NotFoundPage';

export default function BlogDetailPage() {
  const { postId: slug } = useParams();
  const { data, isLoading, isError } = usePublicBlogPost(slug);
  const post = data?.data?.post;

  if (isLoading) return <PageLoader />;
  if (isError || !post) return <NotFoundPage />;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Chip label={post.category} color="secondary" size="small" sx={{ mb: 2 }} />
      <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.dark' }}>{post.title}</Typography>
      <Stack direction="row" spacing={1.5} sx={{ mt: 2, mb: 4 }}>
        <Typography variant="body2" color="text.secondary">{post.author}</Typography>
        <Typography variant="body2" color="text.secondary">•</Typography>
        <Typography variant="body2" color="text.secondary">{new Date(post.date).toLocaleDateString()}</Typography>
      </Stack>
      <Divider sx={{ mb: 4 }} />
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line' }}>{post.content}</Typography>
    </Container>
  );
}