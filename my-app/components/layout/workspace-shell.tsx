"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-provider";
import { errorMessage } from "@/lib/http";
import { Brand, Icon } from "@/components/ui/icon";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    setLoggingOut(true);
    setError("");
    try { await logout(); router.replace("/login"); }
    catch (failure) { setError(errorMessage(failure)); setLoggingOut(false); }
  }
  return <div className="workspace">
    <aside className="sidebar"><Link href="/categories" aria-label="Core Workspace"><Brand /></Link><div className="workspace-name"><span className="workspace-symbol">C</span><div>Core Workspace<small>Không gian làm việc</small></div><span className="plan-badge">CORE</span></div>
      <p className="nav-caption">QUẢN LÝ</p><nav aria-label="Điều hướng chính"><Link href="/categories" className="nav-item active" aria-current="page"><Icon name="folder" /><span>Danh mục</span><span className="nav-indicator" /></Link><button aria-label="Quyền truy cập" className={`nav-item ${permissionsOpen ? "selected" : ""}`} onClick={() => setPermissionsOpen(!permissionsOpen)} aria-expanded={permissionsOpen}><Icon name="shield" /><span>Quyền truy cập</span></button></nav>
      <div className="sidebar-note"><span className="note-icon"><Icon name="grid" /></span><strong>Ngăn nắp từ những điều nhỏ</strong><p>Một cấu trúc rõ ràng cho mọi danh mục của bạn.</p></div>
      <div className="sidebar-account"><span className="avatar">{user?.userName.slice(0, 1).toUpperCase()}</span><div><strong>{user?.userName}</strong><small>{user?.roles.join(", ")}</small></div><button className="icon-button" aria-label="Đăng xuất" onClick={signOut} disabled={loggingOut}><Icon name="logout" size={19} /></button></div>
    </aside>
    <div className="workspace-main"><header className="topbar"><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>Danh mục</strong></div><div className="topbar-right"><span className="role-pill"><Icon name="shield" size={15} />{user?.roles.join(", ")}</span><span className="avatar small">{user?.userName.slice(0, 1).toUpperCase()}</span></div></header>
      {error && <div className="shell-alert alert" role="alert">{error}</div>}
      {permissionsOpen && <section className="permissions-panel" aria-label="Quyền truy cập của bạn"><div><span className="label-kicker">QUYỀN TRUY CẬP</span><h2>{user?.userName}</h2><p className="muted">Vai trò: {user?.roles.join(", ")}</p></div><div className="permission-tags">{user?.permissions.map((permission) => <span key={permission} className="permission-tag"><Icon name="check" size={14} />{permission}</span>)}</div><button className="icon-button" aria-label="Đóng quyền truy cập" onClick={() => setPermissionsOpen(false)}><Icon name="close" /></button></section>}
      {children}
      <footer className="workspace-footer"><span>Core Workspace</span><span>Dữ liệu rõ ràng. Công việc nhẹ nhàng.</span></footer>
    </div>
  </div>;
}
