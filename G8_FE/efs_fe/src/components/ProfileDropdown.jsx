import { useState } from 'react';
import { useSession } from '../contexts/SessionContext';
import { IconButton, Menu, MenuItem, Typography, Divider, Avatar } from '@mui/material';
import { AccountCircle, Person, Settings, ExitToApp } from '@mui/icons-material';

const ProfileDropdown = ({ user }) => {
  const { logout } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="large">
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <AccountCircle />
        </Avatar>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem disabled>
          <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">{user.role}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <Person sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Settings sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileDropdown;