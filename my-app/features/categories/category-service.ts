import { http } from "@/lib/http";
import type { CategoryDto, SaveCategoryDto } from "./types";

export const categoryService = {
  async list(page: number, pageSize: number, signal?: AbortSignal) {
    return (await http.get<CategoryDto[]>("/categories", { params: { page, pageSize }, signal })).data;
  },
  async create(dto: SaveCategoryDto) {
    return (await http.post<CategoryDto>("/categories", dto)).data;
  },
  async update(id: number, dto: SaveCategoryDto) {
    return (await http.put<CategoryDto>(`/categories/${id}`, dto)).data;
  },
  async remove(id: number) {
    await http.delete(`/categories/${id}`);
  },
};
