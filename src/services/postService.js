import api from "@/lib/api";

export const getPostsPage = ({ page = 0, size = 6, sort = "id,desc" } = {}) =>
  api.get("/blogPost", { params: { page, size, sort } });

export const searchPostsPage = ({ keyword = "", page = 0, size = 6, sort = "id,desc" } = {}) =>
  api.get("/blogPost/search", { params: { keyword, page, size, sort } });

export const getPostById = (id) => api.get(`/blogPost/${id}`);

export const createPost = (payload) =>
  api.post("/blogPost", payload);

export const getMyPostsPage = ({ page = 0, size = 10, sort = "id,desc" } = {}) =>
  api.get("/blogPost/mine", { params: { page, size, sort } });

export const deletePostById = (id) => api.delete(`/blogPost/${id}`);

export const updatePost = ({ id, title, content }) =>
  api.put("/blogPost", { id, title, content });