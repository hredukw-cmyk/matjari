import { useState } from "react";

const STORES = [
  { id: 1, name: "مطبخ أم نورة", owner: "نورة الرشيدي", plan: "pro", orders: 148, products: 12, joined: "يناير 2026", status: "active", revenue: 72.5, trialDays: null },
  { id: 2, name: "ستايل العبايات", owner: "فاطمة المطيري", plan: "trial", orders: 67, products: 28, joined: "فبراير 2026", status: "active", revenue: 0, trialDays: 7 },
  { id: 3, name: "حلويات لولو", owner: "لولوة الكندري", plan: "trial", orders: 24, products: 5, joined: "مارس 2026", status: "active", revenue: 0, trialDays: 2 },
  { id: 4, name: "عطور الأميرة", owner: "أميرة العنزي", plan: "pro", orders: 203, products: 41, joined: "يناير 2026", status: "active", revenue: 118.8, trialDays: null },
  { id: 5, name: "أرض الطبيعة", owner: "خالد الشمري", plan: "expired", orders: 89, products: 17, joined: "فبراير 2026", status: "suspended", revenue: 0, trialDays: 0 },
  { id: 6, name: "متجر الكويت", owner: "سعد البدر", plan: "trial", orders: 12, products: 4, joined: "مارس 2026", status: "active", revenue: 0, trialDays: 11 },
];

const PLAN_MAP = {
  pro:     { label: "Pro",       color: "#fbbf24", bg: "#fbbf2415", icon: "⭐" },
  trial:   { label: "تجربة",    color: "#3b82f6", bg: "#3b82f615", icon: "🎁" },
  expired: { label: "منتهي",    color: "#ef4444", bg: "#ef444415", icon: "⛔" },
};

export default function AdminPage() {
  const [stores, setStores] = useState(STORES);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = stores.filter(s => {
    const matchSearch = s.name.includes(search) || s.owner.includes(search);
    const matchPlan = filterPlan === "all" || s.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const counts = {
    all: stores.length,
    pro: stores.filter(s => s.plan === "pro").length,
    trial: stores.filter(s => s.plan === "trial").length,
    expired: stores.filter(s => s.plan === "expired").length,
  };

  const totalRevenue = stores.filter(s => s.plan === "pro").length * 4.9;

  const toggleStatus = (id) => {
    setStores(prev => prev.map(s => s.id === id
      ? { ...s, status: s.status === "active" ? "suspended" : "active" }
      : s
    ));
    if (selected?.id === id) setSelected(s => ({ ...s, status: s.status === "active" ? "suspended" : "active" }));
  };

  const changePlan = (id, plan) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, plan, trialDays: plan === "trial" ? 14 : null } : s));
    if (selected?.id === id) setSelected(s => ({ ...s, plan }));
  };

  return (
    <div dir="rtl" style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "'Noto Kufi Arabic','Cairo',sans-serif",
      display: "flex",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .row:hover { background: rgba(255,255,255,0.03) !important; }
        .row { transition: background 0.15s; cursor: pointer; }
        .fade { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: 220, background: "#050505",
        borderLeft: "1px solid #141414",
        padding: "28px 0", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
      }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #141414" }}>
          <div style={{ color: "#fbbf24", fontWeight: 900, fontSize: 16 }}>🛍️ متجري</div>
          <div style={{ color: "#333", fontSize: 11, marginTop: 4 }}>لوحة الأدمن</div>
        </div>

        {[
          { icon: "🏪", label: "المتاجر", active: true },
          { icon: "💳", label: "الاشتراكات", active: false },
          { icon: "📊", label: "التقارير", active: false },
          { icon: "⚙️", label: "الإعدادات", active: false },
        ].map(item => (
          <div key={item.label} style={{
            padding: "13px 20px",
            display: "flex", alignItems: "center", gap: 12,
            background: item.active ? "rgba(251,191,36,0.06)" : "transparent",
            borderRight: item.active ? "2px solid #fbbf24" : "2px solid transparent",
            cursor: "pointer", fontSize: 13,
            color: item.active ? "#fbbf24" : "#333",
            fontWeight: item.active ? 700 : 400,
          }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </div>
        ))}

        {/* Stats in sidebar */}
        <div style={{ margin: "24px 16px 0", padding: 14, background: "#0f0f0f", border: "1px solid #141414", borderRadius: 14 }}>
          <div style={{ color: "#fbbf24", fontWeight: 900, fontSize: 18 }}>{totalRevenue.toFixed(1)} KWD</div>
          <div style={{ color: "#333", fontSize: 11, marginTop: 4 }}>إيراد الشهر الحالي</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "28px", overflow: "auto" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "إجمالي المتاجر", value: counts.all, icon: "🏪", color: "#60a5fa" },
            { label: "مشتركين Pro", value: counts.pro, icon: "⭐", color: "#fbbf24" },
            { label: "في فترة التجربة", value: counts.trial, icon: "🎁", color: "#3b82f6" },
            { label: "منتهية التجربة", value: counts.expired, icon: "⛔", color: "#ef4444" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#0f0f0f", border: "1px solid #141414",
              borderRadius: 16, padding: "18px",
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#333", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          <input
            placeholder="🔍 ابحث عن متجر..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, minWidth: 200, background: "#0f0f0f",
              border: "1px solid #141414", borderRadius: 10,
              padding: "10px 14px", color: "white",
              fontFamily: "inherit", fontSize: 13, outline: "none",
            }}
          />
          {["all", "pro", "trial", "expired"].map(p => (
            <button key={p} onClick={() => setFilterPlan(p)} style={{
              padding: "9px 14px", borderRadius: 50, border: "1px solid",
              borderColor: filterPlan === p ? "#fbbf24" : "#141414",
              background: filterPlan === p ? "#fbbf2410" : "transparent",
              color: filterPlan === p ? "#fbbf24" : "#444",
              fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer",
            }}>
              {p === "all" ? `الكل (${counts.all})` :
               p === "pro" ? `⭐ Pro (${counts.pro})` :
               p === "trial" ? `🎁 تجربة (${counts.trial})` :
               `⛔ منتهي (${counts.expired})`}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#0f0f0f", border: "1px solid #141414", borderRadius: 20, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#050505" }}>
                {["المتجر", "الباقة", "الطلبات", "المنتجات", "انضم", "الحالة", "إجراء"].map(h => (
                  <th key={h} style={{
                    padding: "14px 16px", textAlign: "right",
                    fontSize: 11, fontWeight: 700, color: "#333",
                    borderBottom: "1px solid #141414",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(store => {
                const plan = PLAN_MAP[store.plan];
                return (
                  <tr key={store.id} className="row"
                    onClick={() => setSelected(store)}
                    style={{ borderBottom: "1px solid #141414" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{store.name}</div>
                      <div style={{ color: "#333", fontSize: 12, marginTop: 2 }}>{store.owner}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                          background: plan.bg, color: plan.color,
                          padding: "3px 10px", borderRadius: 50,
                          fontSize: 12, fontWeight: 700,
                        }}>{plan.icon} {plan.label}</span>
                        {store.plan === "trial" && store.trialDays !== null && (
                          <span style={{
                            color: store.trialDays <= 3 ? "#ef4444" : "#555",
                            fontSize: 11, fontWeight: 700,
                          }}>
                            {store.trialDays}y متبقي
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#555", fontSize: 13 }}>{store.orders}</td>
                    <td style={{ padding: "14px 16px", color: "#555", fontSize: 13 }}>{store.products}</td>
                    <td style={{ padding: "14px 16px", color: "#333", fontSize: 12 }}>{store.joined}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: store.status === "active" ? "#22c55e15" : "#ef444415",
                        color: store.status === "active" ? "#22c55e" : "#ef4444",
                        padding: "3px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700,
                      }}>{store.status === "active" ? "نشط" : "موقوف"}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <button onClick={e => { e.stopPropagation(); toggleStatus(store.id); }} style={{
                        background: store.status === "active" ? "#ef444415" : "#22c55e15",
                        color: store.status === "active" ? "#ef4444" : "#22c55e",
                        border: "1px solid", borderColor: store.status === "active" ? "#ef444430" : "#22c55e30",
                        borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                      }}>
                        {store.status === "active" ? "إيقاف" : "تفعيل"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 20,
        }}>
          <div onClick={e => e.stopPropagation()} className="fade" style={{
            background: "#0f0f0f", border: "1px solid #1f1f1f",
            borderRadius: 24, padding: 28, width: "100%", maxWidth: 380,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ color: "white", fontWeight: 900, fontSize: 17 }}>{selected.name}</div>
                <div style={{ color: "#444", fontSize: 12, marginTop: 3 }}>{selected.owner}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: "#141414", border: "none", borderRadius: 50,
                width: 32, height: 32, color: "#555", cursor: "pointer", fontSize: 16,
              }}>✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "الطلبات", value: selected.orders },
                { label: "المنتجات", value: selected.products },
                { label: "انضم", value: selected.joined },
                { label: "الحالة", value: selected.status === "active" ? "نشط ✅" : "موقوف ⛔" },
              ].map(s => (
                <div key={s.label} style={{ background: "#050505", borderRadius: 12, padding: 14 }}>
                  <div style={{ color: "#333", fontSize: 11, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ color: "white", fontWeight: 800 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Change Plan */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#444", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>تغيير الباقة</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["pro", "trial", "expired"].map(p => {
                  const pl = PLAN_MAP[p];
                  return (
                    <button key={p} onClick={() => changePlan(selected.id, p)} style={{
                      flex: 1, padding: "10px 6px", borderRadius: 10,
                      border: "1px solid",
                      borderColor: selected.plan === p ? pl.color : "#141414",
                      background: selected.plan === p ? pl.bg : "transparent",
                      color: selected.plan === p ? pl.color : "#333",
                      fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer",
                    }}>{pl.icon} {pl.label}</button>
                  );
                })}
              </div>
            </div>

            <button onClick={() => toggleStatus(selected.id)} style={{
              width: "100%",
              background: selected.status === "active" ? "#ef444415" : "#22c55e15",
              color: selected.status === "active" ? "#ef4444" : "#22c55e",
              border: "1px solid", borderColor: selected.status === "active" ? "#ef444430" : "#22c55e30",
              borderRadius: 12, padding: "13px",
              fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
            }}>
              {selected.status === "active" ? "🚫 إيقاف المتجر" : "✅ تفعيل المتجر"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
