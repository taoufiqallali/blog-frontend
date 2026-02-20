import api from "@/lib/api";

export const loginRequest = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerRequest = (payload) =>
  api.post("/auth", payload);

export const changePasswordRequest = (payload) =>
  api.post("/auth/change-password", payload);
