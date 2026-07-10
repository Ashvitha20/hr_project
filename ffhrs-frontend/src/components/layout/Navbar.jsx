import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import logo from '../../assets/logo.jpeg';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Industries', path: '/industries' },
  { label: 'Careers', path: '/careers' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

const dashboardPathByRole = {
  candidate: '/candidate/dashboard',
  hr: '/hr/dashboard',
  recruiter: '/hr/dashboard',
  admin: '/admin/dashboard',
};

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Future Focus HR Solutions" style={{ height: 40 }} />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Box
                key={link.path}
                component={NavLink}
                to={link.path}
                sx={{
                  fontWeight: 600,
                  fontSize: 15,
                  color: 'text.primary',
                  '&.active': { color: 'primary.main' },
                  '&:hover': { color: 'secondary.main' },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
            {user ? (
              <>
                <Button
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ color: 'text.primary' }}
                >
                  <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: 'secondary.main' }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                  {user.name?.split(' ')[0]}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      navigate(dashboardPathByRole[user.role] || '/');
                    }}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" variant="outlined" color="primary">
                  Login
                </Button>
                <Button component={Link} to="/careers" variant="contained" color="secondary">
                  Find Jobs
                </Button>
              </>
            )}
          </Box>

          <IconButton sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {navLinks.map((link) => (
              <ListItemButton key={link.path} component={NavLink} to={link.path}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            <ListItemButton component={Link} to={user ? (dashboardPathByRole[user.role] || '/') : '/login'}>
              <ListItemText primary={user ? 'Dashboard' : 'Login'} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
