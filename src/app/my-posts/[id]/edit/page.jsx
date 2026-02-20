"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Container,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getPostById, updatePost } from "@/services/postService";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPostById(id);
        setTitle(res.data?.title || "");
        setContent(res.data?.content || "");
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load post";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const t = title.trim();
  const c = content.trim();

  if (t.length < 3) {
    setError("Title must be at least 3 characters.");
    return;
  }
  if (!c) {
    setError("Content is required.");
    return;
  }

  setSaving(true);

  try {
    await updatePost({
      id: Number(id),
      title: t,
      content: c,
    });

    setSuccess("Post updated successfully.");
    router.push(`/posts/${id}`);
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.message ||
      "Failed to update post";
    setError(msg);
  } finally {
    setSaving(false);
  }
};

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
          Edit Post
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <Box>
            <Skeleton variant="text" height={40} />
            <Skeleton variant="rectangular" height={240} sx={{ mt: 2 }} />
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              minRows={10}
              required
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button variant="text" onClick={() => router.back()} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </ProtectedRoute>
  );
}