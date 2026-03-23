import { useState } from "react";

const ORDERS = [
  { id: "ORD-001", customer: "أم خالد", phone: "55123456", address: "السالمية، ش 5، م 12", items: [{ name: "مجبوس دجاج", qty: 2, price: 4.5 }, { name: "مطبق", qty: 3, price: 2.5 }], status: "new", time: "10:24 ص", notes: "" },
  { id: "ORD-002", customer: "نورة العنزي", phone: "99887766", address: "حولي، ش 8، م 4", items: [{ name: "هريس لحم", qty: 1, price: 3.5 }, { name: "جريش", qty: 2, price: 3.0 }], status: "preparing", time: "10:05 ص", notes: "بدون فلفل حار" },
  { id: "ORD-003", customer: "فاطمة الرشيدي", phone: "66554433", address: "الفروانية، ش 2، م 7", items: [{ name: "كبسة لحم", qty: 1, price: 5.0 }], status: "done", time: "09:40 ص", notes: "" },
  { id: "ORD-004", customer: "مريم الكندري", phone: "55667788", address: "الجهراء، ش 10، م 3", items: [{ name: "محاشي", qty: 2, price: 4.0 }, { name: "مجبوس دجاج", qty: 1, price: 4.5 }], status: "new", time: "10:31 ص", notes: "توصيل بعد الظهر" },
  { id: "ORD-005", customer: "شيخة المطيري", phone: "50123987", address: "مبارك الكبير، ش 3، م 9", items: [{ name: "مطبق", qty: 4, price: 2.5 }], status: "done", time: "09:15 ص", notes: "" },
];

const STATUS = {
  new:       { label: "جديد",        color: "#e8a04a", bg: "#fff8ee", icon: "🔔" },
  preparing: { label: "قيد التحضير", color: "#3b82f6", bg: "#eff6ff", icon: "👩‍🍳" },
  done:      { label: "مكتمل",       color: "#22c55e", bg: "#f0fdf4", icon: "✅" },
};

const orderTotal = (items) => items.reduce((s, i) => s + i.price * i.qty, 0);

export default function Dashboard() {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const setStatus = (id, status) => {
    setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const counts = {
    all: orders.length,
    new: orders.filter(o => o.status === "new").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    done: orders.filter(o => o.status === "done").length,
  };

  const todayRevenue = orders.filter(o => o.status === "done").reduce((s, o) => s + orderTotal(o.items), 0);

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "#f8f4f0",
      fontFamily: "'Noto Kufi Arabic', 'Cairo', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .order-row:hover { background: #fff8f4 !important; }
        .order-row { transition: background 0.15s; cursor: pointer; }
        .tab-btn { transition: all 0.2s; }
        .action-btn { transition: all 0.2s; }
        .action-btn:hover { filter: brightness(1.08); transform: scale(1.03); }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Sidebar */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 220,
        background: "linear-gradient(180deg, #2c1810 0%, #4a2218 100%)",
        color: "white", padding: "28px 0",
        display: "flex", flexDirection: "column",
        zIndex: 100,
      }}>
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🍽️</div>
          <div style={{ fontWeight: 900, fontSize: 15 }}>مطبخ أم نورة</div>
          <div style={{ fontSize: 11, opacity: 0.6, marginTop: 3 }}>لوحة التحكم</div>
        </div>

        {[
          { icon: "📦", label: "الطلبات", active: true },
          { icon: "🛒", label: "المنتجات", active: false },
          { icon: "📊", label: "التقارير", active: false },
          { icon: "⚙️", label: "الإعدادات", active: false },
        ].map(item => (
          <div key={item.label} style={{
            padding: "14px 20px",
            display: "flex", alignItems: "center", gap: 12,
            background: item.active ? "rgba(255,255,255,0.12)" : "transparent",
            borderRight: item.active ? "3px solid #e8a04a" : "3px solid transparent",
            cursor: "pointer", fontSize: 14, fontWeight: item.active ? 700 : 400,
            opacity: item.active ? 1 : 0.65,
          }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        <div style={{ marginTop: "auto", padding: "20px" }}>
          <a href="#" style={{
            display: "block", textAlign: "center",
            background: "#e8a04a", color: "white",
            padding: "10px", borderRadius: 10,
            fontSize: 12, fontWeight: 700, textDecoration: "none",
          }}>
            🔗 رابط المتجر
          </a>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginRight: 220, padding: "28px 28px 28px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#2c1810" }}>الطلبات اليوم</h1>
          <p style={{ color: "#9a7a65", fontSize: 13, marginTop: 4 }}>الأربعاء، 18 مارس 2026</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "طلبات جديدة",    value: counts.new,           icon: "🔔", color: "#e8a04a" },
            { label: "قيد التحضير",    value: counts.preparing,     icon: "👩‍🍳", color: "#3b82f6" },
            { label: "مكتملة",         value: counts.done,          icon: "✅", color: "#22c55e" },
            { label: "إيراد اليوم",    value: `${todayRevenue.toFixed(3)} KWD`, icon: "💰", color: "#c0622a" },
          ].map(s => (
            <div key={s.label} style={{
              background: "white", borderRadius: 16, padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#9a7a65", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[
            { key: "all", label: `الكل (${counts.all})` },
            { key: "new", label: `جديد (${counts.new})` },
            { key: "preparing", label: `قيد التحضير (${counts.preparing})` },
            { key: "done", label: `مكتمل (${counts.done})` },
          ].map(t => (
            <button key={t.key} className="tab-btn" onClick={() => setFilter(t.key)} style={{
              padding: "8px 16px", borderRadius: 50,
              border: "none", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              cursor: "pointer",
              background: filter === t.key ? "#c0622a" : "white",
              color: filter === t.key ? "white" : "#5c3a28",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Orders Table */}
        <div style={{
          background: "white", borderRadius: 20,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fdf8f3" }}>
                {["رقم الطلب", "الزبون", "المنتجات", "الإجمالي", "الوقت", "الحالة", "إجراء"].map(h => (
                  <th key={h} style={{
                    padding: "14px 16px", textAlign: "right",
                    fontSize: 12, fontWeight: 700, color: "#9a7a65",
                    borderBottom: "1px solid #f0e6dc",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const st = STATUS[order.status];
                return (
                  <tr key={order.id} className="order-row"
                    onClick={() => setSelected(order)}
                    style={{ borderBottom: "1px solid #f8f0ea" }}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#c0622a" }}>{order.id}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2c1810" }}>{order.customer}</div>
                      <div style={{ fontSize: 12, color: "#9a7a65" }}>{order.phone}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#5c3a28" }}>
                      {order.items.map(i => `${i.name} ×${i.qty}`).join("، ")}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 800, color: "#c0622a" }}>
                      {orderTotal(order.items).toFixed(3)} KWD
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#9a7a65" }}>{order.time}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        background: st.bg, color: st.color,
                        padding: "4px 12px", borderRadius: 50,
                        fontSize: 12, fontWeight: 700,
                      }}>{st.icon} {st.label}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {order.status === "new" && (
                        <button className="action-btn" onClick={e => { e.stopPropagation(); setStatus(order.id, "preparing"); }} style={{
                          background: "#3b82f6", color: "white",
                          border: "none", borderRadius: 8,
                          padding: "6px 12px", fontSize: 12, fontWeight: 700,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>ابدأ التحضير</button>
                      )}
                      {order.status === "preparing" && (
                        <button className="action-btn" onClick={e => { e.stopPropagation(); setStatus(order.id, "done"); }} style={{
                          background: "#22c55e", color: "white",
                          border: "none", borderRadius: 8,
                          padding: "6px 12px", fontSize: 12, fontWeight: 700,
                          cursor: "pointer", fontFamily: "inherit",
                        }}>تم التسليم</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#c0a090", fontSize: 14 }}>
              لا توجد طلبات
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 24,
        }}>
          <div onClick={e => e.stopPropagation()} className="fade-in" style={{
            background: "white", borderRadius: 24,
            padding: 28, width: "100%", maxWidth: 420,
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: "#2c1810" }}>{selected.id}</h2>
              <button onClick={() => setSelected(null)} style={{
                background: "#f0e6dc", border: "none", borderRadius: 50,
                width: 32, height: 32, cursor: "pointer", fontSize: 16,
              }}>✕</button>
            </div>

            <div style={{ background: "#fdf8f3", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#9a7a65", marginBottom: 4 }}>👤 الزبون</div>
              <div style={{ fontWeight: 700, color: "#2c1810" }}>{selected.customer}</div>
              <div style={{ fontSize: 13, color: "#5c3a28", marginTop: 4 }}>📞 {selected.phone}</div>
              <div style={{ fontSize: 13, color: "#5c3a28", marginTop: 4 }}>📍 {selected.address}</div>
              {selected.notes && <div style={{ fontSize: 13, color: "#c0622a", marginTop: 6 }}>📝 {selected.notes}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              {selected.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: "1px solid #f5ede6",
                  fontSize: 14,
                }}>
                  <span style={{ color: "#2c1810", fontWeight: 600 }}>{item.name} × {item.qty}</span>
                  <span style={{ color: "#c0622a", fontWeight: 700 }}>{(item.price * item.qty).toFixed(3)} KWD</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 900 }}>
                <span style={{ color: "#2c1810", fontSize: 16 }}>الإجمالي</span>
                <span style={{ color: "#c0622a", fontSize: 18 }}>{orderTotal(selected.items).toFixed(3)} KWD</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://wa.me/${selected.phone}`} target="_blank" rel="noopener noreferrer" style={{
                flex: 1, background: "#25D366", color: "white",
                padding: "12px", borderRadius: 12, textAlign: "center",
                fontWeight: 700, fontSize: 14, textDecoration: "none", fontFamily: "inherit",
              }}>💬 واتساب</a>

              {selected.status === "new" && (
                <button className="action-btn" onClick={() => setStatus(selected.id, "preparing")} style={{
                  flex: 1, background: "#3b82f6", color: "white",
                  border: "none", borderRadius: 12, padding: "12px",
                  fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                }}>👩‍🍳 ابدأ التحضير</button>
              )}
              {selected.status === "preparing" && (
                <button className="action-btn" onClick={() => setStatus(selected.id, "done")} style={{
                  flex: 1, background: "#22c55e", color: "white",
                  border: "none", borderRadius: 12, padding: "12px",
                  fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                }}>✅ تم التسليم</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
