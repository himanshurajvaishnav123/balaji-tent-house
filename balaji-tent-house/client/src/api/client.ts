import axios from "axios";
import type {
  AdminUser,
  Enquiry,
  EnquiryFormData,
  GalleryItem,
  SiteSettings,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://balaji-tent-house-backend.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send/receive the HttpOnly JWT cookie
  headers: { "Content-Type": "application/json" },
});

// Attach a bearer token too, for environments where third-party cookies
// might be blocked (e.g. some mobile webviews).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("btk_admin_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Auth ----------
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: AdminUser }>("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get<AdminUser>("/auth/me"),
  updateProfile: (data: Partial<AdminUser>) => api.put<AdminUser>("/auth/profile", data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
};

// ---------- Gallery ----------
export const galleryApi = {
  getAll: () => api.get<GalleryItem[]>("/gallery"),
  create: (data: Omit<GalleryItem, "_id" | "createdAt" | "updatedAt">) =>
    api.post<GalleryItem>("/gallery", data),
  update: (id: string, data: Partial<GalleryItem>) =>
    api.put<GalleryItem>(`/gallery/${id}`, data),
  remove: (id: string) => api.delete(`/gallery/${id}`),
};

// ---------- Enquiries ----------
export const enquiryApi = {
  submit: (data: EnquiryFormData) => api.post<{ message: string; enquiry: Enquiry }>("/enquiries", data),
  getAll: (status?: string) =>
    api.get<Enquiry[]>("/enquiries", { params: status ? { status } : {} }),
  updateStatus: (id: string, status: string) =>
    api.put<Enquiry>(`/enquiries/${id}/status`, { status }),
  remove: (id: string) => api.delete(`/enquiries/${id}`),
};

// ---------- Uploads ----------
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post<{ url: string }>("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ---------- Site Settings ----------
export const settingsApi = {
  get: () => api.get<SiteSettings>("/settings"),
  update: (data: Partial<SiteSettings>) => api.put<SiteSettings>("/settings", data),
};
