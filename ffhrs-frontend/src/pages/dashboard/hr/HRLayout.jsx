import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const items = [
  { label: 'Dashboard', path: '/hr/dashboard', icon: <DashboardIcon /> },
  { label: 'Manage Jobs', path: '/hr/jobs', icon: <WorkIcon /> },
  { label: 'Applicants', path: '/hr/applicants', icon: <PeopleIcon /> },
  { label: 'Interviews', path: '/hr/interviews', icon: <EventAvailableIcon /> },
  { label: 'Offer Letters', path: '/hr/offers', icon: <MailOutlineIcon /> },
];

export default function HRLayout() {
  return <DashboardLayout title="HR Panel" items={items} />;
}
