import api from "@/lib/api";

export const getMe = () => api.get("/users/me");

export const updateMe = (payload) => api.patch("/users/me", payload);

export const getUsersPage = ({ page = 0, size = 10, sort = "id,desc" } = {}) =>
  api.get("/users", { params: { page, size, sort } });

export const deleteUserById = (id) => api.delete(`/users/${id}`);