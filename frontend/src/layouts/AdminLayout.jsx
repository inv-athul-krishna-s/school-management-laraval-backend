import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  ListItemButton,
  Button,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 240;
const collapsedWidth = 60;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const handleMobileDrawerToggle = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { label: "🏠 Dashboard", path: "/admin/dashboard" },
    { label: "👨‍🏫 Teachers", path: "/admin/teachers" },
    { label: "👩‍🎓 Students", path: "/admin/students" },
    { label: "➕ Register User", path: "/admin/register" },
  ];

  const drawerContent = (
    <Box>
      <Toolbar sx={{ display: "flex", justifyContent: isDrawerOpen ? "flex-end" : "center", px: 1 }}>
        {!isMobile && (
          <IconButton onClick={toggleDrawer}>
            {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                minHeight: 48,
                justifyContent: isDrawerOpen || isMobile ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  opacity: isDrawerOpen || isMobile ? 1 : 0,
                  whiteSpace: "nowrap",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${isDrawerOpen ? drawerWidth : collapsedWidth}px)`, xs: "100%" },
          ml: { md: `${isDrawerOpen ? drawerWidth : collapsedWidth}px`, xs: 0 },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Laravel School Admin Panel
          </Typography>
          {!isMobile && user?.name && (
            <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              <Typography variant="h6">Welcome, {user.name}</Typography>
            </Box>
          )}
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {!isMobile && (
        <Drawer
          variant="permanent"
          open={isDrawerOpen}
          sx={{
            width: isDrawerOpen ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isDrawerOpen ? drawerWidth : collapsedWidth,
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
          ml: { md: isDrawerOpen ? `${drawerWidth}px` : `${collapsedWidth}px`, xs: 0 },
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
