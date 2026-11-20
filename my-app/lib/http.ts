import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  timeout: 20_000,
  headers: { Accept: "application/json" },
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 &&
      error.config?.url !== "/auth/login" && error.config?.url !== "/auth/me" && typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(error);
  },
);

export function errorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return "Có lỗi xảy ra. Vui lòng thử lại.";
  if (!error.response) return "Không thể kết nối máy chủ. Vui lòng thử lại.";
  const { status, data } = error.response;
  if (status === 401) return "Thông tin đăng nhập không đúng hoặc phiên đã hết hạn.";
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status === 404) return "Danh mục không còn tồn tại. Hãy tải lại danh sách.";
  if (status >= 500) return "Máy chủ đang không khả dụng. Vui lòng thử lại sau.";
  if (data?.errors) return Object.values(data.errors).flat().join(" ");
  return data?.detail || data?.message || "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.";
}
