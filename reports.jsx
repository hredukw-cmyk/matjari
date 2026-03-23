import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────
const ORDERS_DATA = [
  { id: 1, date: "2026-03-01", area: "الجهراء", items: [{ name: "فطور كويتي", qty: 2, price: 5.5 }, { name: "مطبق", qty: 1, price: 2.5 }], payment: "cash", status: "done" },
  { id: 2, date: "2026-03-01", area: "السالمية", items: [{ name: "مجبوس دجاج", qty: 1, price: 6.0 }], payment: "transfer", status: "done" },
  { id: 3, date: "2026-03-02", area: "الجهراء", items: [{ name: "فطور كويتي", qty: 3, price: 5.5 }], payment: "cash", status: "done" },
  { id: 4, date: "2026-03-03", area: "حولي", items: [{ name: "هريس لحم", qty: 2, price: 3.5 }], payment: "cash", status: "done" },
  { id: 5, date: "2026-03-04", area: "الجهراء", items: [{ name: "فطور كويتي", qty: 1, price: 5.5 }, { name: "هريس لحم", qty: 1, price: 3.5 }], payment: "transfer", status: "done" },
  { id: 6, date: "2026-03-05", area: "السالمية", items: [{ name: "مجبوس دجاج", qty: 2, price: 6.0 }, { name: "مطبق", qty: 2, price: 2.5 }], payment: "cash", status: "done" },
  { id: 7, date: "2026-03-06", area: "الفروانية", items: [{ name: "فطور كويتي", qty: 4, price: 5.5 }], payment: "cash", status: "done" },
  { id: 8, date: "2026-03-07", area: "حولي", items: [{ name: "مجبوس دجاج", qty: 1, price: 6.0 }], payment: "transfer", status: "done" },
  { id: 9, date: "2026-03-08", area: "الجهراء", items: [{ name: "فطور كويتي", qty: 2, price: 5.5 }], payment: "cash", status: "done" },
  { id: 10, date: "2026-03-09", area: "السالمية", items: [{ name: "هريس لحم", qty: 3, price: 3.5 }, { name: "مطبق", qty: 1, price: 2.5 }], payment: "cash", status: "done" },
  { id: 11, date: "2026-03-10", area: "الجهراء", items: [{ name: "مجبوس دجاج", qty: 2, price: 6.0 }], payment: "transfer", status: "done" },
  { id: 12, date: "2026-03-11", area: "الفروانية", items: [{ name: "فطور كويتي", qty: 2, price: 5.5 }], payment: "cash", status: "done" },
  { id: 13, date: "2026-03-12", area: "حولي", items: [{ name: "مطبق", qty: 3, price: 2.5 }, { name: "هريس لحم", qty: 1, price: 3.5 }], payment: "cash", status: "done" },
  { id: 14, date: "2026-03-13", area: "الجهراء", items: [{ name: "فطور كويتي", qty: 3, price: 5.5 }], payment: "cash", status: "done" },
  { id: 15, date: "2026-03-14", area: "السالمية", items: [{ name: "مجبوس دجاج", qty: 1, price: 6.0 }, { name: "فطور كويتي", qty: 1, price: 5.5 }], payment: "transfer", status: "done" },
  { id: 16, date: "2026-03-15", area: "الفروانية", items: [{ name: "هريس لحم", qty: 2, price: 3.5 }], payment: "cash", status: "done" },
  { id: 17, date: "2026-03-16", area: "الجهراء", items: [{ name: "فطور كويتي", qty: 2, price: 5.5 }, { name: "مطبق", qty: 2, price: 2.5 }], payment: "cash", status: "done" },
  { id: 18, date: "2026-03-17", area: "حولي", items: [{ name: "مجبوس دجاج", qty: 3, price: 6.0 }], payment: "transfer", status: "done" },
  { id: 19, date: "2026-03-18", area: "الجهراء", items: [{ name: "فطور كويتي", qty: 4, price: 5.5 }], payment: "cash", status: "done" },
  { id: 20, date: "2026-03-18", area: "السالمية", items: [{ name: "هريس لحم", qty: 2, price: 3.5 }], payment: "cash", status: "done" },
];

const orderTotal = (items) => items.reduce((s, i) => s + i.price * i.qty, 0);

// ─── Mini Bar Chart ───────────────────────────────────────────
function BarChart({ data, color, height = 120 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 9, color: "#444", fontWeight: 600 }}>
            {d.value > 0 ? d.value.toFixed(d.value < 10 ? 1 : 0) : ""}
          </div>
          <div
            title={`${d.label}: ${d.value}`}
            style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              background: `linear-gradient(180deg, ${color}cc, ${color}66)`,
              height: `${(d.value / max) * (height - 24)}px`,
              minHeight: d.value > 0 ? 4 : 0,
              transition: "height 0.5s ease",
            }}
          />
          <div style={{ fontSize: 9, color: "#444", fontWeight: 600, textAlign: "center" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────
export default function ReportsPage() {
  const [period, setPeriod] = useState("month");

  const now = new Date("2026-03-18");
  const filtered = ORDERS_DATA.filter(o => {
    const d = new Date(o.date);
    if (period === "week") {
      const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
      return d >= weekAgo;
    }
    return d.getMonth() === now.getMonth();
  });

  // ─ KPIs
  const totalRevenue = filtered.reduce((s, o) => s + orderTotal(o.items), 0);
  const totalOrders = filtered.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const cashRevenue = filtered.filter(o => o.payment === "cash").reduce((s, o) => s + orderTotal(o.items), 0);
  const transferRevenue = totalRevenue - cashRevenue;

  // ─ Daily revenue chart
  const days = period === "week" ? 7 : 18;
  const dailyData = Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayOrders = filtered.filter(o => o.date === dateStr);
    return {
      label: d.getDate().toString(),
      value: dayOrders.reduce((s, o) => s + orderTotal(o.items), 0),
    };
  });

  // ─ Top products
  const productStats = {};
  filtered.forEach(o => {
    o.items.forEach(item => {
      if (!productStats[item.name]) productStats[item.name] = { qty: 0, revenue: 0 };
      productStats[item.name].qty += item.qty;
      productStats[item.name].revenue += item.price * item.qty;
    });
  });
  const topProducts = Object.entries(productStats)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 5);

  // ─ Area breakdown
  const areaStats = {};
  filtered.forEach(o => {
    if (!areaStats[o.area]) areaStats[o.area] = { orders: 0, revenue: 0 };
    areaStats[o.area].orders++;
    areaStats[o.area].revenue += orderTotal(o.items);
  });
  const topAreas = Object.entries(areaStats).sort((a, b) => b[1].orders - a[1].orders);
  const maxAreaOrders = Math.max(...topAreas.map(a => a[1].orders), 1);

  // ─ Product chart data
  const productChartData = topProducts.map(([name, s]) => ({
    label: name.split(" ")[0],
    value: s.qty,
  }));

  return (
    <div dir="rtl" style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "'Noto Kufi Arabic','Cairo',sans-serif",
      padding: "28px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .period-btn { transition: all 0.2s; }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h1 style={{ color: "white", fontWeight: 900, fontSize: 20 }}>📊 التقارير</h1>
            <p style={{ color: "#444", fontSize: 12, marginTop: 4 }}>مطبخ أم نورة</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ k: "week", l: "أسبوع" }, { k: "month", l: "الشهر" }].map(p => (
              <button key={p.k} className="period-btn" onClick={() => setPeriod(p.k)} style={{
                padding: "8px 16px", borderRadius: 50, border: "1px solid",
                borderColor: period === p.k ? "#e8a04a" : "#1f1f1f",
                background: period === p.k ? "#e8a04a15" : "transparent",
                color: period === p.k ? "#e8a04a" : "#555",
                fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}>{p.l}</button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="fade" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { label: "إجمالي الإيراد", value: `${totalRevenue.toFixed(3)}`, sub: "KWD", icon: "💰", color: "#e8a04a" },
            { label: "عدد الطلبات", value: totalOrders, sub: "طلب", icon: "📦", color: "#3b82f6" },
            { label: "متوسط الطلب", value: `${avgOrder.toFixed(3)}`, sub: "KWD", icon: "📈", color: "#a855f7" },
            { label: "كاش / تحويل", value: `${((cashRevenue / totalRevenue) * 100 || 0).toFixed(0)}%`, sub: "كاش", icon: "💵", color: "#22c55e" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#141414", border: "1px solid #1f1f1f",
              borderRadius: 16, padding: "18px 16px",
            }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{s.sub}</div>
              <div style={{ fontSize: 11, color: "#333", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="fade" style={{
          background: "#141414", border: "1px solid #1f1f1f",
          borderRadius: 20, padding: "20px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>📈 الإيراد اليومي</div>
            <div style={{ color: "#e8a04a", fontWeight: 700, fontSize: 12 }}>{totalRevenue.toFixed(3)} KWD</div>
          </div>
          <BarChart data={dailyData} color="#e8a04a" height={130} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Top Products */}
          <div className="fade" style={{
            background: "#141414", border: "1px solid #1f1f1f",
            borderRadius: 20, padding: "20px",
          }}>
            <div style={{ color: "white", fontWeight: 800, fontSize: 14, marginBottom: 4 }}>🍽️ أكثر المنتجات طلباً</div>
            <div style={{ color: "#444", fontSize: 11, marginBottom: 16 }}>بالكمية</div>
            <BarChart data={productChartData} color="#3b82f6" height={100} />
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {topProducts.map(([name, s], i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#333", fontSize: 12, fontWeight: 800, minWidth: 16 }}>{i + 1}</span>
                  <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600, flex: 1 }}>{name}</span>
                  <span style={{ color: "#3b82f6", fontWeight: 800, fontSize: 13 }}>{s.qty}×</span>
                  <span style={{ color: "#444", fontSize: 11 }}>{s.revenue.toFixed(3)} KWD</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas */}
          <div className="fade" style={{
            background: "#141414", border: "1px solid #1f1f1f",
            borderRadius: 20, padding: "20px",
          }}>
            <div style={{ color: "white", fontWeight: 800, fontSize: 14, marginBottom: 4 }}>📍 الطلبات بالمنطقة</div>
            <div style={{ color: "#444", fontSize: 11, marginBottom: 16 }}>توزيع الزبائن</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topAreas.map(([area, s]) => (
                <div key={area}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>📍 {area}</span>
                    <span style={{ color: "#e8a04a", fontSize: 12, fontWeight: 800 }}>{s.orders} طلب</span>
                  </div>
                  <div style={{ background: "#1f1f1f", borderRadius: 50, height: 6, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 50,
                      background: "linear-gradient(90deg, #e8a04a, #c0622a)",
                      width: `${(s.orders / maxAreaOrders) * 100}%`,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                  <div style={{ color: "#333", fontSize: 10, marginTop: 3 }}>{s.revenue.toFixed(3)} KWD</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment split */}
        <div className="fade" style={{
          background: "#141414", border: "1px solid #1f1f1f",
          borderRadius: 20, padding: "20px",
        }}>
          <div style={{ color: "white", fontWeight: 800, fontSize: 14, marginBottom: 20 }}>💳 طرق الدفع</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "كاش", value: cashRevenue, count: filtered.filter(o => o.payment === "cash").length, color: "#f59e0b", icon: "💵" },
              { label: "تحويل", value: transferRevenue, count: filtered.filter(o => o.payment === "transfer").length, color: "#22c55e", icon: "🏦" },
            ].map(p => (
              <div key={p.label} style={{
                background: "#0f0f0f", border: "1px solid #1a1a1a",
                borderRadius: 14, padding: "16px",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${p.color}15`, border: `1px solid ${p.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>{p.icon}</div>
                <div>
                  <div style={{ color: p.color, fontWeight: 900, fontSize: 18 }}>{p.value.toFixed(3)} KWD</div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{p.label} — {p.count} طلب</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bar */}
          <div style={{ marginTop: 16, background: "#1f1f1f", borderRadius: 50, height: 8, overflow: "hidden", display: "flex" }}>
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
              width: `${(cashRevenue / totalRevenue) * 100 || 0}%`,
              transition: "width 0.6s ease",
            }} />
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, #16a34a, #22c55e)",
              flex: 1,
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 700 }}>💵 {((cashRevenue / totalRevenue) * 100 || 0).toFixed(0)}%</span>
            <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700 }}>🏦 {((transferRevenue / totalRevenue) * 100 || 0).toFixed(0)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
