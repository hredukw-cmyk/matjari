import { useState } from "react";

// ─── قوالب الرسائل ─────────────────────────────────────────
const TEMPLATES = {
  preparing: {
    label: "جاري التحضير",
    icon: "👩‍🍳",
    color: "#3b82f6",
    bg: "#0a0f1f",
    border: "#3b82f630",
    build: (o) =>
      `👩‍🍳 *طلبك الآن في المطبخ!*\n\nأهلاً ${o.customer}،\nطلبك بدأ يتحضر الآن 🔥\n\n⏰ موعد التسليم: ${o.deliveryTime}\n📍 العنوان: ${o.area}\n\nنتواصل معك قريباً عند الخروج للتوصيل.`,
  },
  onway: {
    label: "المندوب في الطريق",
    icon: "🚗",
    color: "#f59e0b",
    bg: "#1a1200",
    border: "#f59e0b30",
    build: (o) =>
      `🚗 *المندوب في الطريق إليك!*\n\nأهلاً ${o.customer}،\nطلبك خرج للتوصيل الآن 📦\n\n📞 للتواصل مع المندوب: ${o.driverPhone || "سيتواصل معك"}\n${o.payment !== "transfer" ? `\n💵 *يرجى تجهيز مبلغ ${orderTotal(o.items).toFixed(3)} KWD كاش*` : "\n✅ الدفع مسبق بالتحويل"}\n\nشكراً لصبرك! 🙏`,
  },
};

const MOCK_ORDERS = [
  { id: "ORD-001", customer: "أم خالد", phone: "55123456", area: "السالمية", payment: "cash", items: [{ name: "فطور كويتي", qty: 2, price: 5.5 }], status: "new", deliveryDate: "اليوم", deliveryTime: "07:00", driverPhone: "99001122" },
  { id: "ORD-002", customer: "نورة العنزي", phone: "99887766", area: "حولي", payment: "transfer", items: [{ name: "فطور صحي", qty: 1, price: 4.5 }, { name: "هريس لحم", qty: 1, price: 5.0 }], status: "preparing", deliveryDate: "اليوم", deliveryTime: "08:00", driverPhone: "99001122" },
  { id: "ORD-003", customer: "فاطمة الرشيدي", phone: "66554433", area: "الجهراء", payment: "cash", items: [{ name: "مجبوس دجاج", qty: 1, price: 6.0 }], status: "onway", deliveryDate: "اليوم", deliveryTime: "12:00", driverPhone: "99001122" },
];

const orderTotal = (items) => items.reduce((s, i) => s + i.price * i.qty, 0);

const STATUS_FLOW = {
  new:       { template: "preparing" },
  preparing: { template: "onway" },
  onway:     { template: "onway" },
  done:      { template: null },
};

export default function NotificationsPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selected, setSelected] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState("confirm");
  const [customMsg, setCustomMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [sent, setSent] = useState({});

  const markSent = (orderId, templateKey) => {
    setSent(s => ({ ...s, [`${orderId}_${templateKey}`]: true }));
  };

  const isSent = (orderId, templateKey) => sent[`${orderId}_${templateKey}`];

  const sendWhatsApp = (phone, msg, orderId, templateKey) => {
    window.open(`https://wa.me/965${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    markSent(orderId, templateKey);
  };

  return (
    <div dir="rtl" style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "'Noto Kufi Arabic','Cairo',sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .card:hover { border-color: #2a2a2a !important; }
        .card { transition: border-color 0.2s; cursor: pointer; }
        .send-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .send-btn { transition: all 0.2s; }
        .tmpl-tab:hover { background: rgba(255,255,255,0.05) !important; }
        .tmpl-tab { transition: all 0.2s; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* ─── RIGHT: الطلبات ─── */}
        <div>
          <h2 style={{ color: "white", fontWeight: 900, fontSize: 17, marginBottom: 6 }}>📦 الطلبات</h2>
          <p style={{ color: "#444", fontSize: 12, marginBottom: 20 }}>اختار طلب لترسله إشعار</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {orders.map(order => {
              const isSelected = selected?.id === order.id;
              const flow = STATUS_FLOW[order.status];
              const templateKey = flow?.template;
              const alreadySent = isSent(order.id, templateKey);
              const msg = templateKey ? TEMPLATES[templateKey].build(order) : "";
              const t = templateKey ? TEMPLATES[templateKey] : null;

              return (
                <div key={order.id} className="card"
                  onClick={() => { setSelected(order); setActiveTemplate(templateKey || "confirm"); setEditMode(false); setCustomMsg(""); }}
                  style={{
                    background: isSelected ? "#141414" : "#0f0f0f",
                    border: `1px solid ${isSelected ? (t?.border || "#333") : "#1a1a1a"}`,
                    borderRadius: 16, padding: "16px 18px",
                  }}>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>{order.customer}</div>
                      <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>📞 {order.phone} · 📍 {order.area}</div>
                    </div>
                    {t && (
                      <span style={{
                        background: t.bg, color: t.color,
                        border: `1px solid ${t.border}`,
                        padding: "3px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700,
                      }}>{t.icon} {t.label}</span>
                    )}
                  </div>

                  <div style={{ color: "#555", fontSize: 12, marginBottom: 12 }}>
                    {order.items.map(i => `${i.name} ×${i.qty}`).join("، ")} · {orderTotal(order.items).toFixed(3)} KWD
                  </div>

                  {/* Quick send button */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {t && (
                      <button className="send-btn"
                        onClick={e => { e.stopPropagation(); sendWhatsApp(order.phone, msg, order.id, templateKey); }}
                        style={{
                          flex: 1,
                          background: alreadySent ? "#1a1a1a" : "#25D36615",
                          color: alreadySent ? "#333" : "#25D366",
                          border: `1px solid ${alreadySent ? "#1f1f1f" : "#25D36640"}`,
                          borderRadius: 10, padding: "8px 12px",
                          fontFamily: "inherit", fontWeight: 700, fontSize: 12,
                          cursor: "pointer",
                        }}>
                        {alreadySent ? "✓ أُرسل" : `📤 ${t.label}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── LEFT: معاينة الرسالة ─── */}
        <div>
          <h2 style={{ color: "white", fontWeight: 900, fontSize: 17, marginBottom: 6 }}>💬 معاينة الرسالة</h2>
          <p style={{ color: "#444", fontSize: 12, marginBottom: 20 }}>
            {selected ? `إلى: ${selected.customer} (${selected.phone})` : "اختار طلب من اليسار"}
          </p>

          {!selected ? (
            <div style={{
              background: "#0f0f0f", border: "1px solid #1a1a1a",
              borderRadius: 20, padding: 40, textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
              <div style={{ color: "#333", fontSize: 14 }}>اختار طلب لتشوف الرسالة</div>
            </div>
          ) : (
            <div className="fade">
              {/* Template tabs */}
              <div style={{
                display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16,
              }}>
                {Object.entries(TEMPLATES).map(([key, t]) => (
                  <button key={key} className="tmpl-tab"
                    onClick={() => { setActiveTemplate(key); setEditMode(false); setCustomMsg(""); }}
                    style={{
                      padding: "6px 12px", borderRadius: 50, border: "1px solid",
                      borderColor: activeTemplate === key ? t.color : "#1f1f1f",
                      background: activeTemplate === key ? t.bg : "transparent",
                      color: activeTemplate === key ? t.color : "#444",
                      fontFamily: "inherit", fontWeight: 700, fontSize: 11, cursor: "pointer",
                    }}>{t.icon} {t.label}</button>
                ))}
              </div>

              {/* Message preview */}
              <div style={{
                background: "#0f0f0f", border: "1px solid #1a1a1a",
                borderRadius: 20, overflow: "hidden", marginBottom: 14,
              }}>
                {/* WhatsApp header */}
                <div style={{
                  background: "#128C7E", padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 50,
                    background: "#075E54", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                  }}>👤</div>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{selected.customer}</div>
                    <div style={{ color: "#b2dfdb", fontSize: 11 }}>+965 {selected.phone}</div>
                  </div>
                </div>

                {/* Chat bubble */}
                <div style={{ background: "#111b21", padding: 16, minHeight: 160 }}>
                  <div style={{
                    background: "#005c4b", borderRadius: "12px 12px 4px 12px",
                    padding: "12px 14px", maxWidth: "85%", marginRight: "auto",
                    display: "inline-block",
                  }}>
                    {!editMode ? (
                      <pre style={{
                        color: "#e9edef", fontSize: 12, lineHeight: 1.7,
                        whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0,
                      }}>
                        {TEMPLATES[activeTemplate].build(selected)}
                      </pre>
                    ) : (
                      <textarea
                        value={customMsg}
                        onChange={e => setCustomMsg(e.target.value)}
                        style={{
                          background: "transparent", border: "none", outline: "none",
                          color: "#e9edef", fontSize: 12, lineHeight: 1.7,
                          fontFamily: "inherit", width: "100%", minHeight: 120, resize: "vertical",
                        }}
                      />
                    )}
                    <div style={{ color: "#8696a0", fontSize: 10, textAlign: "left", marginTop: 6 }}>
                      {new Date().toLocaleTimeString("ar-KW", { hour: "2-digit", minute: "2-digit" })} ✓✓
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button className="send-btn"
                  onClick={() => {
                    const msg = editMode && customMsg
                      ? customMsg
                      : TEMPLATES[activeTemplate].build(selected);
                    sendWhatsApp(selected.phone, msg, selected.id, activeTemplate);
                  }}
                  style={{
                    flex: 1,
                    background: isSent(selected.id, activeTemplate)
                      ? "#1a2a1a" : "linear-gradient(90deg, #128C7E, #25D366)",
                    color: isSent(selected.id, activeTemplate) ? "#25D366" : "white",
                    border: "none", borderRadius: 12, padding: "13px",
                    fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
                  }}>
                  {isSent(selected.id, activeTemplate) ? "✓ تم الإرسال" : "📤 إرسال على واتساب"}
                </button>

                <button onClick={() => { setEditMode(!editMode); if (!editMode) setCustomMsg(TEMPLATES[activeTemplate].build(selected)); }} style={{
                  background: editMode ? "#1a1a3a" : "#141414",
                  color: editMode ? "#60a5fa" : "#555",
                  border: `1px solid ${editMode ? "#3b82f640" : "#1f1f1f"}`,
                  borderRadius: 12, padding: "13px 16px",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>✏️</button>
              </div>

              {isSent(selected.id, activeTemplate) && (
                <div style={{
                  marginTop: 12, background: "#0a1f0a", border: "1px solid #22c55e30",
                  borderRadius: 10, padding: "10px 14px",
                  color: "#22c55e", fontSize: 12, fontWeight: 600, textAlign: "center",
                }}>
                  ✅ تم فتح واتساب — تأكد من إرسال الرسالة
                </div>
              )}
            </div>
          )}

          {/* Templates settings hint */}
          <div style={{
            marginTop: 20, background: "#0f0f0f", border: "1px solid #1a1a1a",
            borderRadius: 14, padding: 16,
          }}>
            <div style={{ color: "#555", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>💡 القوالب المتاحة</div>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #141414" }}>
                <span style={{ fontSize: 14 }}>{t.icon}</span>
                <span style={{ color: t.color, fontSize: 12, fontWeight: 700, flex: 1 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
