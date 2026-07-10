import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import ArticleIcon from '@mui/icons-material/Article';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const items = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Manage Users', path: '/admin/users', icon: <PeopleIcon /> },
  { label: 'Manage Jobs', path: '/admin/jobs', icon: <WorkIcon /> },
  { label: 'Manage Blogs', path: '/admin/blogs', icon: <ArticleIcon /> },
  { label: 'Testimonials', path: '/admin/testimonials', icon: <RateReviewIcon /> },
  { label: 'Contact Messages', path: '/admin/messages', icon: <MailOutlineIcon /> },
  { label: 'Roles & Permissions', path: '/admin/roles', icon: <SecurityIcon /> },
];

export default function AdminLayout() {
  return <DashboardLayout title="Admin Panel" items={items} />;
}
