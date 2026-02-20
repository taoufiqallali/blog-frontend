"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Container,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminRoute from "@/components/AdminRoute";
import { deleteUserById, getUsersPage } from "@/services/userService";
import { deletePostById, getPostsPage } from "@/services/postService";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState(0);

  const [uPage, setUPage] = useState(1);
  const uSize = 10;
  const [usersData, setUsersData] = useState(null);

  const [pPage, setPPage] = useState(1);
  const pSize = 10;
  const [postsData, setPostsData] = useState(null);

  const [error, setError] = useState("");

  const loadUsers = async () => {
    const res = await getUsersPage({ page: uPage - 1, size: uSize, sort: "id,desc" });
    setUsersData(res.data);
  };

  const loadPosts = async () => {
    const res = await getPostsPage({ page: pPage - 1, size: pSize, sort: "id,desc" });
    setPostsData(res.data);
  };

  useEffect(() => {
    setError("");
    loadUsers().catch((e) => setError(e?.message || "Failed to load users"));
  }, [uPage]);

  useEffect(() => {
    setError("");
    loadPosts().catch((e) => setError(e?.message || "Failed to load posts"));
  }, [pPage]);

  const handleDeleteUser = async (id) => {
    setError("");
    try {
      await deleteUserById(id);
      await loadUsers();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to delete user"
      );
    }
  };

  const handleDeletePost = async (id) => {
    setError("");
    try {
      await deletePostById(id);
      await loadPosts();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to delete post"
      );
    }
  };

  const users = usersData?.content ?? [];
  const usersTotalPages = usersData?.totalPages ?? 1;

  const posts = postsData?.content ?? [];
  const postsTotalPages = postsData?.totalPages ?? 1;

  return (
    <AdminRoute>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
          Admin Dashboard
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper variant="outlined" sx={{ mb: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Users" />
            <Tab label="Posts" />
          </Tabs>
        </Paper>

        {tab === 0 && (
          <>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>First name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.firstname}</TableCell>
                      <TableCell>{u.lastname}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell align="right">
                        <IconButton color="error" onClick={() => handleDeleteUser(u.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>No users.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination count={usersTotalPages} page={uPage} onChange={(_, v) => setUPage(v)} />
            </Box>
          </>
        )}

        {tab === 1 && (
          <>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.id}</TableCell>
                      <TableCell>{p.title}</TableCell>
                      <TableCell>{p.slug}</TableCell>
                      <TableCell align="right">
                        <IconButton color="error" onClick={() => handleDeletePost(p.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {posts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>No posts.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination count={postsTotalPages} page={pPage} onChange={(_, v) => setPPage(v)} />
            </Box>
          </>
        )}
      </Container>
    </AdminRoute>
  );
}