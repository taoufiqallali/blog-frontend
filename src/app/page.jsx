"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Pagination,
  Skeleton,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";
import { getPostsPage, searchPostsPage } from "@/services/postService";

export default function HomePage() {
  const [page, setPage] = useState(1); 
  const size = 6;

  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const res = keyword.trim()
        ? await searchPostsPage({ keyword, page: page - 1, size })
        : await getPostsPage({ page: page - 1, size });

      setData(res.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to load posts";
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
        Blog Posts
      </Typography>

      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 3, display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Search posts..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button type="submit" variant="contained">Search</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {posts.map((p) => (
              <Card key={p.id} sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
                    {p.title}
                  </Typography>

                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {(p.content || "").slice(0, 160)}
                    {(p.content || "").length > 160 ? "..." : ""}
                  </Typography>

                  <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.7 }}>
                    slug: {p.slug}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button component={Link} href={`/posts/${p.id}`} size="small">
                    Read more
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Box>
        </>
      )}
    </Container>
  );
}