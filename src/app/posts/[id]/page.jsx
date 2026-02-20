"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Pagination,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { getPostById } from "@/services/postService";
import { createComment, getCommentsByBlog , deleteCommentById } from "@/services/commentService";
import { useAuth } from "@/context/AuthContext";

export default function PostDetailsPage() {
  const { id } = useParams(); 
  const { isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState("");

  const [cPage, setCPage] = useState(1); 
  const cSize = 5;
  const [commentsData, setCommentsData] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [content, setContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const loadPost = async () => {
    setPostLoading(true);
    setPostError("");
    try {
      const res = await getPostById(id);
      setPost(res.data);
    } catch (err) {
      setPostError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load post"
      );
    } finally {
      setPostLoading(false);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    setCommentsError("");
    try {
      const res = await getCommentsByBlog({
        blogId: id,
        page: cPage - 1,
        size: cSize,
        sort: "createdAt,desc",
      });
      setCommentsData(res.data);
    } catch (err) {
      setCommentsError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load comments"
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
  setCommentsError("");
  setDeletingId(commentId);

  try {
    await deleteCommentById(commentId);
    await loadComments();
  } catch (err) {
    setCommentsError(
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.message ||
      "Failed to delete comment"
    );
  } finally {
    setDeletingId(null);
  }
};

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    loadComments();
  }, [id, cPage]);

  const handleCreateComment = async (e) => {
    e.preventDefault();
    setCreateError("");

    const trimmed = content.trim();
    if (trimmed.length < 3) {
      setCreateError("Comment must be at least 3 characters.");
      return;
    }

    setCreating(true);
    try {
      await createComment({ blogId: Number(id), content: trimmed });
      setContent("");

      setCPage(1);
      await loadComments();
    } catch (err) {
      setCreateError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Failed to create comment"
      );
    } finally {
      setCreating(false);
    }
  };

  const comments = commentsData?.content ?? [];
  const totalCommentPages = commentsData?.totalPages ?? 1;

  return (
    <Container sx={{ py: 4 }}>
      {/* POST */}
      {postError && <Alert severity="error" sx={{ mb: 2 }}>{postError}</Alert>}

      {postLoading ? (
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
        </Box>
      ) : post ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            slug: {post.slug}
          </Typography>
          <Typography sx={{ mt: 3, whiteSpace: "pre-line" }}>
            {post.content}
          </Typography> 
        </Box>
      ) : null}

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Comments
      </Typography>

      {commentsError && <Alert severity="error" sx={{ mb: 2 }}>{commentsError}</Alert>}

      {isAuthenticated ? (
        <Box component="form" onSubmit={handleCreateComment} sx={{ mb: 3, display: "grid", gap: 1 }}>
          {createError && <Alert severity="error">{createError}</Alert>}

          <TextField
            label="Write a comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            minRows={3}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" disabled={creating}>
              {creating ? "Posting..." : "Post comment"}
            </Button>
          </Box>
        </Box>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Login to add a comment.
        </Alert>
      )}

      {commentsLoading ? (
        <Box sx={{ display: "grid", gap: 2 }}>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <>
          <Box sx={{ display: "grid", gap: 2 }}>
            {comments.map((c) => (
              <Card key={c.id}>
                <CardContent>
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
    <Box>
      <Typography sx={{ fontWeight: 700 }}>
        {c.authorName || "Anonymous"}
      </Typography>

      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
      </Typography>
    </Box>

    {isAuthenticated && (
      <Button
        size="small"
        color="error"
        variant="outlined"
        onClick={() => handleDeleteComment(c.id)}
        disabled={deletingId === c.id}
      >
        {deletingId === c.id ? "Deleting..." : "Delete"}
      </Button>
    )}
  </Box>

  <Typography sx={{ mt: 1, whiteSpace: "pre-line" }}>
    {c.content}
  </Typography>
</CardContent>
              </Card>
            ))}

            {comments.length === 0 && (
              <Typography sx={{ opacity: 0.7 }}>
                No comments yet.
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalCommentPages}
              page={cPage}
              onChange={(_, v) => setCPage(v)}
            />
          </Box>
        </>
      )}
    </Container>
  );
}