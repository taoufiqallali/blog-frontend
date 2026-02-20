"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createPost } from "@/services/postService";

export default function CreatePostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await createPost({
        title: title.trim(),
        content: content.trim(),
      });

      const created = res.data;

      router.push(`/posts/${created.id}`);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to create post";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
            Create Post
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              label="Title"
              required 
              lotProps={{ input: { minLength: 3 , maxLength: 255} }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              
            />

            <TextField
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              minRows={8}
              required
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Publishing..." : "Publish"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ProtectedRoute>
  );
}