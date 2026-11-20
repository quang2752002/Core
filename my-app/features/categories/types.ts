export interface CategoryDto {
  id: number;
  name: string;
  description: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface SaveCategoryDto {
  name: string;
  description: string | null;
}
