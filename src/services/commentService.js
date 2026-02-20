import api from "@/lib/api";

export const getCommentsByBlog = ({ blogId, page = 0, size = 10, sort = "createdAt,desc" }) =>
  api.get(`/comment/${blogId}`, { params: { page, size, sort } });

export const createComment = ({ blogId, content }) =>
  api.post("/comment", { blogId, content });

export const deleteCommentById = (id) =>
  api.delete(`/comment/${id}`);