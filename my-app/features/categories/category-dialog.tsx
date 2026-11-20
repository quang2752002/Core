"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { categoryService } from "./category-service";
import type { CategoryDto } from "./types";
import { errorMessage } from "@/lib/http";
import { Icon } from "@/components/ui/icon";

function Dialog({ titleId, busy, onClose, children }: { titleId: string; busy: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    dialog?.querySelector<HTMLElement>("input, .modal-actions button")?.focus();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className="modal" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>{children}</dialog>;
}

export function CategoryDialog({ category, onClose, onSaved }: { category: CategoryDto | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (!name.trim()) { setError("Vui lòng nhập tên danh mục."); return; }
    setSaving(true);
    setError("");
    try {
      const dto = { name: name.trim(), description: description.trim() || null };
      if (category) await categoryService.update(category.id, dto);
      else await categoryService.create(dto);
      onSaved();
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setSaving(false); }
  }
  return <Dialog titleId="category-dialog-title" busy={saving} onClose={onClose}><div className="modal-heading"><span className="folder-mark"><Icon name="folder" size={24} /></span><button className="icon-button" disabled={saving} aria-label="Đóng form danh mục" onClick={onClose}><Icon name="close" /></button></div><h2 id="category-dialog-title">{category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h2><p className="muted">{category ? `Cập nhật thông tin danh mục #${category.id}.` : "Tạo một không gian mới để sắp xếp dữ liệu."}</p><form onSubmit={submit} className="category-form"><label htmlFor="category-name">Tên danh mục <span className="required">*</span></label><input id="category-name" name="name" placeholder="Ví dụ: Thiết bị công nghệ" maxLength={200} required autoFocus value={name} onChange={(e) => setName(e.target.value)} disabled={saving} /><div className="field-caption">Tên dễ nhớ, tối đa 200 ký tự.</div><label htmlFor="category-description">Mô tả <span className="optional">(không bắt buộc)</span></label><textarea id="category-description" name="description" rows={4} maxLength={2000} placeholder="Một vài thông tin về danh mục này…" value={description} onChange={(e) => setDescription(e.target.value)} disabled={saving} /><div className="character-count">{description.length}/2000</div>{error && <div className="alert" role="alert">{error}</div>}<div className="modal-actions"><button type="button" className="button secondary" onClick={onClose} disabled={saving}>Hủy</button><button className="button primary" type="submit" disabled={saving}>{saving ? "Đang lưu…" : category ? "Lưu thay đổi" : "Tạo danh mục"}</button></div></form></Dialog>;
}

export function DeleteCategoryDialog({ category, onClose, onDeleted }: { category: CategoryDto; onClose: () => void; onDeleted: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    if (saving) return;
    setSaving(true);
    try { await categoryService.remove(category.id); onDeleted(); }
    catch (failure) { setError(errorMessage(failure)); setSaving(false); }
  }
  return <Dialog titleId="delete-title" busy={saving} onClose={onClose}><div className="modal-heading"><span className="danger-mark"><Icon name="trash" size={24} /></span><button className="icon-button" aria-label="Đóng xác nhận xóa" disabled={saving} onClick={onClose}><Icon name="close" /></button></div><h2 id="delete-title">Xóa danh mục này?</h2><p className="muted">Danh mục <strong className="break-word">{category.name}</strong> sẽ bị xóa vĩnh viễn. Bạn không thể hoàn tác thao tác này.</p>{error && <div className="alert" role="alert">{error}</div>}<div className="modal-actions"><button className="button secondary" autoFocus onClick={onClose} disabled={saving}>Giữ lại</button><button className="button danger" onClick={remove} disabled={saving}>{saving ? "Đang xóa…" : "Xóa danh mục"}</button></div></Dialog>;
}
