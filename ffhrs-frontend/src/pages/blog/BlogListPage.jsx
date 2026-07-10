import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import SectionHeading from '../../components/common/SectionHeading';
import { sampleBlogPosts } from '../../data/sampleJobs';

export default function BlogListPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <SectionHeading eyebrow="Resources" title="Blog" subtitle="Insights on recruitment, HR strategy, and workforce planning." />
      <Grid container spacing={3}>
        {sampleBlogPosts.map((post) => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card
              component={Link}
              to={`/blog/${post.id}`}
              variant="outlined"
              sx={{ display: 'block', borderRadius: 3, height: '100%', '&:hover': { boxShadow: 4, borderColor: 'secondary.main' } }}
            >
              <CardContent>
                <Chip label={post.category} size="small" color="secondary" sx={{ mb: 1.5 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{post.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{post.excerpt}</Typography>
                <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">{post.author}</Typography>
                  <Typography variant="caption" color="text.secondary">•</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(post.date).toLocaleDateString()}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
