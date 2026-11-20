"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { errorMessage } from "@/lib/http";
import { Brand, Icon } from "@/components/ui/icon";

export function LoginForm() {
  const { login, user, loading, error: sessionError, expired, retry } = useAuth();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { if (user) router.replace("/categories"); }, [user, router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try { await login({ userName: userName.trim(), password }); router.replace("/categories"); }
    catch (failure) { setError(errorMessage(failure)); }
    finally { setSaving(false); }
  }

  return <main className="login-page">
    <section className="login-story">
      <Brand light />
      <div className="story-content"><span className="eyebrow">KHÔNG GIAN QUẢN TRỊ</span><h1>Mọi danh mục.<br />Một nơi quản lý<span>.</span></h1><p>Sắp xếp dữ liệu gọn gàng, cộng tác đúng vai trò và tập trung vào công việc của bạn.</p>
        <div className="category-art" aria-hidden="true"><div className="art-header"><span className="art-dot" /><span>Danh mục của bạn</span><Icon name="grid" size={16} /></div>{["Thiết bị & Công nghệ", "Không gian sống", "Phong cách hàng ngày"].map((item, index) => <div className="art-row" key={item}><span className={`art-folder art-${index}`}><Icon name="folder" /></span><span>{item}<small>Được sắp xếp. Luôn trong tầm tay.</small></span><Icon name="check" size={17} /></div>)}</div>
      </div>
      <div className="story-footer"><Icon name="shield" size={18} /><span>Quyền truy cập phù hợp với từng vai trò</span></div>
    </section>
    <section className="login-main"><div className="login-box"><div className="mobile-brand"><Brand /></div><span className="label-kicker">CHÀO MỪNG TRỞ LẠI</span><h2>Đăng nhập vào Core</h2><p className="muted">Tiếp tục công việc trong không gian của bạn.</p>
      {expired && <div className="notice" role="status">Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.</div>}
      {sessionError && <div className="alert" role="alert">{sessionError} <button className="text-button" onClick={retry}>Thử lại</button></div>}
      <form onSubmit={submit} className="login-form">
        <label htmlFor="username">Tên đăng nhập</label><input id="username" name="username" autoComplete="username" placeholder="Nhập tên đăng nhập" required value={userName} onChange={(e) => setUserName(e.target.value)} disabled={saving} />
        <label htmlFor="password">Mật khẩu</label><div className="password-field"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Nhập mật khẩu" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={saving} /><button type="button" className="icon-button" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}><Icon name="eye" size={19} /></button></div>
        {error && <div className="alert" role="alert">{error}</div>}
        <button type="submit" className="button primary login-submit" disabled={saving || loading || !!user}>{saving ? "Đang đăng nhập…" : loading ? "Đang kiểm tra phiên…" : "Đăng nhập"}</button>
      </form>
      <div className="login-help"><Icon name="lock" size={16} /><p>Tài khoản được cấp bởi quản trị viên.<br />Liên hệ quản trị viên nếu bạn cần quyền truy cập.</p></div>
    </div><p className="login-copyright">Core Workspace · Gọn gàng hơn mỗi ngày</p></section>
  </main>;
}
