"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
const { isAuthenticated, logout, isReady, isAdmin } = useAuth();
  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          component={Link}
          href="/"
          variant="h6"
          sx={{ color: "inherit", textDecoration: "none", fontWeight: 700 }}
        >
          BlogApp
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {!isReady ? null : !isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
              <Button variant="contained" component={Link} href="/register">
                Register
              </Button>
            </>
          ) : (
            <>
            {isAdmin && (
             <Button color="inherit" component={Link} href="/admin">
              Dashboard
             </Button>
            )}

            <Button color="inherit" component={Link} href="/profile">
              Profile
            </Button>

            
            {!isAdmin && (
            <>
              <Button color="inherit" component={Link} href="/create">
                Create
              </Button>

              <Button color="inherit" component={Link} href="/my-posts">
                My posts
              </Button>
            </>
          )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button></>
            
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}