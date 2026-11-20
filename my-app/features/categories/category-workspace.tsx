"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { categoryService } from "./category-service";
import type { CategoryDto } from "./types";
import { CategoryDialog, DeleteCategoryDialog } from "./category-dialog";
import { errorMessage } from "@/lib/http";
import { Icon } from "@/components/ui/icon";
import { SessionGate } from "@/components/ui/session-gate";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

const pageSize = 10;
function dateLabel(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function CategoriesContent() {
  const { user } = useAuth();
  const canRead = !!user?.permissions.includes("categories.read");
  const canManage = !!user?.permissions.includes("categories.manage");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState<{ category: CategoryDto | null } | null>(null);
  const [deleting, setDeleting] = useState<CategoryDto | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!canRead) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    categoryService.list(page, pageSize, controller.signal).then(setCategories).catch((failure) => {
      if (!axios.isCancel(failure)) setError(errorMessage(failure));
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, revision, canRead]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  function saved() {
    setToast(editor?.category ? "Đã cập nhật danh mục." : "Đã tạo danh mục mới.");
    setEditor(null);
    setRevision((value) => value + 1);
  }

  function deleted() {
    setDeleting(null);
    setToast("Đã xóa danh mục.");
    if (categories.length === 1 && page > 1) setPage((value) => value - 1);
    else setRevision((value) => value + 1);
  }

  if (!canRead) return <section className="content"><div className="empty-state"><Icon name="shield" size={38} /><h1>Bạn chưa có quyền truy cập</h1><p>Liên hệ quản trị viên để được cấp quyền xem danh mục.</p></div></section>;

  return <section className="content">
    <div className="page-heading"><div><span className="label-kicker">SẮP XẾP & QUẢN LÝ</span><h1>Danh mục<span className="title-dot">.</span></h1><p className="muted">Một nơi cho mọi danh mục trong không gian của bạn.</p></div>{canManage && <button className="button primary" onClick={() => setEditor({ category: null })}><Icon name="plus" size={18} />Thêm danh mục</button>}</div>
    <div className="overview-strip"><div className="overview-item"><span className="overview-icon"><Icon name="folder" size={22} /></span><div><span>Danh mục trên trang</span><strong>{loading || error ? "—" : categories.length.toString().padStart(2, "0")}<small> / {pageSize} mục</small></strong></div></div><div className="overview-item"><span className="overview-icon subtle"><Icon name={canManage ? "shield" : "eye"} size={22} /></span><div><span>Quyền của bạn</span><strong className="overview-text">{canManage ? "Quản lý danh mục" : "Chỉ xem danh mục"}</strong></div></div><div className="overview-item page-overview"><span className="overview-icon subtle"><Icon name="grid" size={22} /></span><div><span>Đang xem</span><strong className="overview-text">Trang {page}</strong></div></div></div>
    {!canManage && <div className="notice read-notice"><Icon name="info" size={19} /><span>Bạn có thể xem danh mục. Chức năng tạo, sửa và xóa dành cho tài khoản có quyền quản lý.</span></div>}
    <div className="category-panel"><div className="panel-heading"><div><h2>Tất cả danh mục</h2><span className="muted">Danh sách được sắp xếp theo tên</span></div><button className="button secondary compact" disabled={loading} onClick={() => setRevision((value) => value + 1)}><Icon name="refresh" size={16} className={loading ? "spin" : ""} />Tải lại</button></div>
      {error ? <div className="empty-state"><span className="danger-mark"><Icon name="info" size={26} /></span><h3>Chưa tải được danh mục</h3><p role="alert">{error}</p><button className="button secondary" onClick={() => setRevision((value) => value + 1)}>Thử lại</button></div>
        : loading ? <div className="table-loading" role="status" aria-label="Đang tải danh mục">{[1, 2, 3, 4, 5].map((item) => <div className="skeleton-row" key={item}><span /><span /><span /></div>)}<span className="sr-only">Đang tải danh mục…</span></div>
        : !categories.length ? <div className="empty-state"><span className="empty-folder"><Icon name="folder" size={32} /></span><h3>{page === 1 ? "Một khởi đầu gọn gàng" : "Không còn danh mục ở trang này"}</h3><p>{page === 1 ? "Chưa có danh mục nào. Tạo danh mục đầu tiên để bắt đầu sắp xếp dữ liệu." : "Quay lại trang trước để xem các danh mục khác."}</p>{canManage && page === 1 && <button className="button primary" onClick={() => setEditor({ category: null })}><Icon name="plus" size={18} />Tạo danh mục đầu tiên</button>}</div>
        : <div className="table-scroll"><table className="category-table"><thead><tr><th scope="col" className="id-cell">Mã</th><th scope="col">Tên danh mục</th><th scope="col" className="description-cell">Mô tả</th><th scope="col">Ngày tạo</th><th scope="col">Cập nhật</th>{canManage && <th scope="col" className="actions-cell"><span className="sr-only">Thao tác</span></th>}</tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td className="id-cell"><span className="id-tag">#{category.id}</span></td><td><div className="category-name"><span className="table-folder"><Icon name="folder" size={18} /></span><strong>{category.name}</strong></div></td><td className="description-cell"><p className="description-text" title={category.description || undefined}>{category.description || <span className="no-description">Chưa có mô tả</span>}</p></td><td className="date-cell">{dateLabel(category.createdAtUtc)}</td><td className="date-cell">{category.updatedAtUtc ? dateLabel(category.updatedAtUtc) : <span className="muted">—</span>}</td>{canManage && <td className="actions-cell"><div className="row-actions"><button className="icon-button" aria-label={`Sửa ${category.name}`} title="Chỉnh sửa" onClick={() => setEditor({ category })}><Icon name="edit" size={17} /></button><button className="icon-button delete-action" aria-label={`Xóa ${category.name}`} title="Xóa danh mục" onClick={() => setDeleting(category)}><Icon name="trash" size={17} /></button></div></td>}</tr>)}</tbody></table></div>}
      <div className="pagination"><span className="muted">{loading ? "Đang tải…" : error ? "Chưa có dữ liệu" : `${categories.length} danh mục trên trang ${page}`}</span><div><button className="page-button" aria-label="Trang trước" disabled={page === 1 || loading} onClick={() => setPage((value) => value - 1)}><Icon name="chevron" size={15} style={{ transform: "rotate(180deg)" }} /></button><span className="page-number" aria-label={`Trang ${page}`}>{page}</span><button className="page-button" aria-label="Trang tiếp" disabled={!!error || loading || categories.length < pageSize || page >= 1_000_000} onClick={() => setPage((value) => value + 1)}><Icon name="chevron" size={15} /></button></div></div>
    </div>
    <p className="bottom-hint"><Icon name="shield" size={15} />Dữ liệu được lưu sau mỗi thay đổi thành công.</p>
    {editor && <CategoryDialog category={editor.category} onClose={() => setEditor(null)} onSaved={saved} />}
    {deleting && <DeleteCategoryDialog category={deleting} onClose={() => setDeleting(null)} onDeleted={deleted} />}
    {toast && <div className="toast" role="status"><span><Icon name="check" size={17} /></span>{toast}<button className="icon-button" aria-label="Đóng thông báo" onClick={() => setToast("")}><Icon name="close" size={16} /></button></div>}
  </section>;
}

export function CategoryWorkspace() {
  return <SessionGate><WorkspaceShell><CategoriesContent /></WorkspaceShell></SessionGate>;
}
