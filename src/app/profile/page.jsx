"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getMe, updateMe } from "@/services/userService";
import { changePasswordRequest } from "@/services/authService";

export default function ProfilePage() {
  const [meLoading, setMeLoading] = useState(true);
  const [meError, setMeError] = useState("");
  const [me, setMe] = useState(null);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const loadMe = async () => {
    setMeLoading(true);
    setMeError("");
    try {
      const res = await getMe();
      setMe(res.data);

      setFirstname(res.data.firstname || "");
      setLastname(res.data.lastname || "");
    } catch (err) {
      setMeError(
        err?.response?.data?.message ||
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load profile"
      );
    } finally {
      setMeLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");

    if (!me?.email) {
      setUpdateError("Could not determine your email. Please reload the page.");
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await updateMe({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: me.email, 
      });

      setMe(res.data);
      setUpdateSuccess("Profile updated successfully.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Failed to update profile";
      setUpdateError(msg);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    const np = newPassword.trim();
    const cnp = confirmNewPassword.trim();

    if (np.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (np !== cnp) {
      setPwError("Confirm password does not match the new password.");
      return;
    }

    setPwLoading(true);
    try {
      await changePasswordRequest({
        currentPassword,
        newPassword: np,
      });

      setPwSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Failed to change password";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }} gutterBottom>
          Profile
        </Typography>

        {meError && <Alert severity="error" sx={{ mb: 2 }}>{meError}</Alert>}

        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
            Your info
          </Typography>

          {meLoading ? (
            <Typography>Loading...</Typography>
          ) : me ? (
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Role: <strong>{me.role}</strong> • User ID: <strong>{me.id}</strong>
            </Typography>
          ) : null}

          <Divider sx={{ mb: 2 }} />

          {updateError && <Alert severity="error" sx={{ mb: 2 }}>{updateError}</Alert>}
          {updateSuccess && <Alert severity="success" sx={{ mb: 2 }}>{updateSuccess}</Alert>}

          <Box component="form" onSubmit={handleUpdateProfile} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="First name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <TextField
              label="Last name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" disabled={updateLoading || meLoading}>
                {updateLoading ? "Saving..." : "Save changes"}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
            Change password
          </Typography>

          {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}
          {pwSuccess && <Alert severity="success" sx={{ mb: 2 }}>{pwSuccess}</Alert>}

          <Box component="form" onSubmit={handleChangePassword} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              required
              helperText="Min 8 chars"
            />

            <TextField
              label="Confirm new password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" disabled={pwLoading}>
                {pwLoading ? "Updating..." : "Update password"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
}