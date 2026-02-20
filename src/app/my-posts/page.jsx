"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import { deletePostById, getMyPostsPage } from "@/services/postService";

export default function MyPostsPage() {
  const [page, setPage] = useState(1);
  const size = 10;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getMyPostsPage({ page: page - 1, size, sort: "id,desc" });
      setData(res.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load your posts";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const posts = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openDelete = (id) => setDeleteId(id);
  const closeDelete = () => setDeleteId(null);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      await deletePostById(deleteId);
      closeDelete();

      const isLastItemOnPage = posts.length === 1;
      const willHavePrevPage = page > 1;

      if (isLastItemOnPage && willHavePrevPage) {
        setPage((p) => p - 1);
      } else {
        await load();
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to delete post";
      setError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            My Posts
          </Typography>

          <Button variant="contained" component={Link} href="/create">
            Create new
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No posts yet.</TableCell>
                </TableRow>
              ) : (
                posts.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      <Typography
                        component={Link}
                        href={`/posts/${p.id}`}
                        sx={{ textDecoration: "none", color: "inherit" }}
                      >
                        {p.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Typography
                          component={Link}
                          href={`/posts/${p.id}`}
                          sx={{
                            fontWeight: 700,
                            textDecoration: "none",
                            color: "inherit",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {p.title}
                        </Typography>

                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {(p.content || "").slice(0, 80)}
                          {(p.content || "").length > 80 ? "..." : ""}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Button
                          size="small"
                          variant="outlined"
                          component={Link}
                          href={`/my-posts/${p.id}/edit`}
                        >
                          Update
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => openDelete(p.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
        </Box>

        <Dialog open={!!deleteId} onClose={closeDelete}>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogContent>
            <DialogContentText>This action cannot be undone.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDelete} disabled={deleting}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ProtectedRoute>
  );
}