import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const items = [
  { label: 'Dashboard', path: '/candidate/dashboard', icon: <DashboardIcon /> },
  { label: 'My Profile', path: '/candidate/profile', icon: <PersonIcon /> },
  { label: 'Applied Jobs', path: '/candidate/applications', icon: <WorkOutlineIcon /> },
  { label: 'Saved Jobs', path: '/candidate/saved', icon: <BookmarkIcon /> },
  { label: 'Interviews', path: '/candidate/interviews', icon: <EventAvailableIcon /> },
  { label: 'Settings', path: '/candidate/settings', icon: <SettingsIcon /> },
];

export default function CandidateLayout() {
  return <DashboardLayout title="Candidate Portal" items={items} />;
}
