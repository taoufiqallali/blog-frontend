"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import AuthRedirect from "@/components/AuthRedirect";
import { registerRequest } from "@/services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerRequest({ firstname, lastname, email, password });
      setSuccess("Account created successfully. You can login now.");
      setTimeout(() => router.push("/login"), 700);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRedirect>
      <Container maxWidth="sm">
        <Box sx={{ py: 6 }}>
          <Typography variant="h4" gutterBottom>Register</Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField label="First name" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
            <TextField label="Last name" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            <TextField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"/>

            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </Button>

            <Button variant="text" onClick={() => router.push("/login")}>
              Already have an account? Login
            </Button>
          </Box>
        </Box>
      </Container>
    </AuthRedirect>
  );
}