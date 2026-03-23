import { useState } from "react";

// ============================================================
// Firebase config — استبدل بالقيم الخاصة بمشروعك
// ============================================================
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

// ============================================================
// Mock auth — يتحول لـ Firebase لما تحط الكونفيج
// ============================================================
const mockUsers = {};

const firebaseAuth = {
  register: async (email, password, storeName, slug) => {
    await new Promise(r => setTimeout(r, 1000));
    if (mockUsers[email]) throw new Error("البريد مسجّل مسبقاً");
    if (Object.values(mockUsers).find(u => u.slug === slug)) throw new Error("اسم المتجر محجوز");
    mockUsers[email] = { email, password, storeName, slug };
    return { email, storeName, slug };
  },
  login: async (email, password) => {
    await new Promise(r => setTimeout(r, 900));
    const user = mockUsers[email];
    if (!user || user.password !== password) throw new Error("البريد أو كلمة المرور غير صحيحة");
    return { email: user.email, storeName: user.storeName, slug: user.slug };
  },
};

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    email: "", password: "", storeName: "", slug: "",
  });

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setError("");
    if (k === "storeName") {
      const autoSlug = v.trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      setForm(f => ({ ...f, storeName: v, slug: autoSlug }));
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("الرجاء تعبئة جميع الحقول");
    if (mode === "register" && (!form.storeName || !form.slug)) return setError("الرجاء تعبئة جميع الحقول");

    setLoading(true);
    try {
      let user;
      if (mode === "register") {
        user = await firebaseAuth.register(form.email, form.password, form.storeName, form.slug);
        setSuccess(`تم إنشاء متجرك! رابطك: yourapp.com/store/${user.slug}`);
        setTimeout(() => onAuth?.(user), 2000);
      } else {
        user = await firebaseAuth.login(form.email, form.password);
        onAuth?.(user);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #2c1810 0%, #5c2e1a 60%, #8b4513 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Kufi Arabic', 'Cairo', sans-serif",
      padding: 20,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .input-field:focus { border-color: #c0622a !important; outline: none; box-shadow: 0 0 0 3px rgba(192,98,42,0.15); }
        .input-field { transition: all 0.2s; }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .tab { transition: all 0.2s; }
        .submit-btn { transition: all 0.2s; }
        .submit-btn:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
      `}</style>

      {/* Background pattern */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(232,160,74,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)",
        pointerEvents: "none",
      }} />

      <div className="fade-in" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🛍️</div>
          <h1 style={{ color: "white", fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px" }}>
            متجري
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 }}>
            ابدأ بيعك في دقائق
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: 24,
          padding: "32px 28px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        }}>

          {/* Tabs */}
          <div style={{
            display: "flex", background: "#f5ede6",
            borderRadius: 12, padding: 4, marginBottom: 28,
          }}>
            {[{ k: "login", l: "تسجيل الدخول" }, { k: "register", l: "متجر جديد" }].map(t => (
              <button key={t.k} className="tab" onClick={() => { setMode(t.k); setError(""); setSuccess(""); }} style={{
                flex: 1, padding: "10px",
                border: "none", borderRadius: 10,
                fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
                background: mode === t.k ? "white" : "transparent",
                color: mode === t.k ? "#c0622a" : "#9a7a65",
                boxShadow: mode === t.k ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              }}>{t.l}</button>
            ))}
          </div>

          {/* Register extra fields */}
          {mode === "register" && (
            <>
              <Field label="اسم المتجر" icon="🏪">
                <input className="input-field" placeholder="مثال: مطبخ أم نورة"
                  value={form.storeName} onChange={e => set("storeName", e.target.value)}
                  style={inputStyle} />
              </Field>

              <Field label="رابط المتجر" icon="🔗">
                <div style={{ position: "relative" }}>
                  <input className="input-field" placeholder="om-noura"
                    value={form.slug} onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^\w-]/g, ""))}
                    style={{ ...inputStyle, paddingLeft: 120 }} dir="ltr" />
                  <span style={{
                    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                    fontSize: 11, color: "#c0a090", fontWeight: 600,
                  }}>yourapp.com/store/</span>
                </div>
                {form.slug && (
                  <div style={{ fontSize: 11, color: "#22c55e", marginTop: 4, fontWeight: 600 }}>
                    ✓ yourapp.com/store/{form.slug}
                  </div>
                )}
              </Field>
            </>
          )}

          <Field label="البريد الإلكتروني" icon="📧">
            <input className="input-field" type="email" placeholder="example@email.com"
              value={form.email} onChange={e => set("email", e.target.value)}
              style={{ ...inputStyle }} dir="ltr" />
          </Field>

          <Field label="كلمة المرور" icon="🔒">
            <input className="input-field" type="password" placeholder="••••••••"
              value={form.password} onChange={e => set("password", e.target.value)}
              style={inputStyle} dir="ltr"
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </Field>

          {error && (
            <div style={{
              background: "#fff0f0", border: "1px solid #fcc",
              borderRadius: 10, padding: "10px 14px",
              color: "#c0392b", fontSize: 13, fontWeight: 600, marginBottom: 16,
            }}>⚠️ {error}</div>
          )}

          {success && (
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: "10px 14px",
              color: "#166534", fontSize: 13, fontWeight: 600, marginBottom: 16,
            }}>🎉 {success}</div>
          )}

          <button className="submit-btn" onClick={handleSubmit} disabled={loading} style={{
            width: "100%",
            background: loading ? "#d4b8a8" : "linear-gradient(135deg, #c0622a, #8b4513)",
            color: "white", border: "none", borderRadius: 14,
            padding: "15px", fontSize: 16, fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}>
            {loading ? "⏳ جاري التحميل..." : mode === "login" ? "دخول إلى داشبورد ←" : "إنشاء متجري الآن ←"}
          </button>

          {mode === "login" && (
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#9a7a65" }}>
              ما عندك حساب؟{" "}
              <span onClick={() => setMode("register")} style={{ color: "#c0622a", fontWeight: 700, cursor: "pointer" }}>
                أنشئ متجرك مجاناً
              </span>
            </p>
          )}
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 20 }}>
          بالمتابعة توافق على شروط الخدمة وسياسة الخصوصية
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#5c3a28", marginBottom: 7 }}>
        <span>{icon}</span>{label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px",
  borderRadius: 12, border: "1.5px solid #e8d5c4",
  fontSize: 14, fontFamily: "'Noto Kufi Arabic', 'Cairo', sans-serif",
  color: "#2c1810", background: "#fdf8f3",
  direction: "rtl",
};
