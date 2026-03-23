import { useState } from "react";

// ─── CONFIG (صاحب المتجر يضبطها من الإعدادات) ────────────────
const STORE_SETTINGS = {
  name: "مطبخ أم نورة",
  slots: ["07:00", "08:00", "09:00", "12:00", "13:00", "18:00", "19:00"],
  maxPerSlot: 5,
  minHoursAhead: 3,
};

const PRODUCTS = [
  { id: 1, name: "فطور كويتي", price: 5.5, emoji: "🍳", desc: "بيض + جبن + خبز + شاي" },
  { id: 2, name: "فطور صحي", price: 4.5, emoji: "🥗", desc: "سلطة + عصير + خبز أسمر" },
  { id: 3, name: "مجبوس دجاج", price: 6.0, emoji: "🍗", desc: "وجبة غداء كاملة" },
  { id: 4, name: "هريس لحم", price: 5.0, emoji: "🥘", desc: "وجبة تقيلة دافية" },
];

// ─── MOCK: الطلبات المحجوزة مسبقاً (لحساب الـ capacity) ─────
const BOOKED = {
  "2026-03-19_07:00": 3,
  "2026-03-19_08:00": 5, // ممتلئ
  "2026-03-19_12:00": 2,
  "2026-03-20_07:00": 1,
};

// ─── MOCK ORDERS للداشبورد ───────────────────────────────────
const MOCK_ORDERS = [
  { id: "ORD-001", customer: "أم خالد", phone: "55123456", address: "السالمية", area: "السالمية", lat: 29.3628, lng: 48.0838, payment: "cash", items: [{ name: "فطور كويتي", qty: 2, price: 5.5 }], status: "new", deliveryDate: "2026-03-19", deliveryTime: "07:00", orderedAt: "10:24 ص" },
  { id: "ORD-002", customer: "نورة العنزي", phone: "99887766", address: "حولي", area: "حولي", lat: 29.3348, lng: 48.0130, payment: "transfer", items: [{ name: "فطور صحي", qty: 1, price: 4.5 }, { name: "هريس لحم", qty: 1, price: 5.0 }], status: "preparing", deliveryDate: "2026-03-19", deliveryTime: "08:00", orderedAt: "09:05 ص" },
  { id: "ORD-003", customer: "فاطمة", phone: "66554433", address: "الجهراء", area: "الجهراء", lat: 29.3375, lng: 47.6581, payment: "cash", items: [{ name: "مجبوس دجاج", qty: 1, price: 6.0 }], status: "done", deliveryDate: "2026-03-19", deliveryTime: "12:00", orderedAt: "08:40 ص" },
  { id: "ORD-004", customer: "مريم الكندري", phone: "55667788", address: "الجهراء", area: "الجهراء", lat: 29.3400, lng: 47.6600, payment: "cash", items: [{ name: "فطور كويتي", qty: 3, price: 5.5 }], status: "new", deliveryDate: "2026-03-20", deliveryTime: "07:00", orderedAt: "10:31 ص" },
  { id: "ORD-005", customer: "شيخة المطيري", phone: "50123987", address: "الجهراء", area: "الجهراء", lat: 29.3420, lng: 47.6550, payment: "transfer", items: [{ name: "فطور صحي", qty: 2, price: 4.5 }], status: "new", deliveryDate: "2026-03-20", deliveryTime: "07:00", orderedAt: "10:50 ص" },
  { id: "ORD-006", customer: "دانة السبيعي", phone: "55998877", address: "السالمية", area: "السالمية", lat: 29.3640, lng: 48.0850, payment: "cash", items: [{ name: "مجبوس دجاج", qty: 2, price: 6.0 }], status: "new", deliveryDate: "2026-03-20", deliveryTime: "07:00", orderedAt: "11:00 ص" },
];

const STATUS_MAP = {
  new:       { label: "جديد",        color: "#f59e0b", bg: "#fef3c720", icon: "🔔" },
  preparing: { label: "قيد التحضير", color: "#3b82f6", bg: "#eff6ff20", icon: "👩‍🍳" },
  done:      { label: "مكتمل",       color: "#22c55e", bg: "#f0fdf420", icon: "✅" },
};

const orderTotal = (items) => items.reduce((s, i) => s + i.price * i.qty, 0);

// ─── HELPERS ─────────────────────────────────────────────────
const getDaysAhead = (n) => {
  const days = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const label = i === 0 ? "اليوم" : i === 1 ? "غداً" : d.toLocaleDateString("ar-KW", { weekday: "long", day: "numeric", month: "short" });
    days.push({ value: `${yyyy}-${mm}-${dd}`, label });
  }
  return days;
};

const isSlotAvailable = (date, slot) => {
  const key = `${date}_${slot}`;
  const booked = BOOKED[key] || 0;
  if (booked >= STORE_SETTINGS.maxPerSlot) return false;
  if (date === getDaysAhead(1)[0].value) {
    const [h, m] = slot.split(":").map(Number);
    const now = new Date();
    const slotTime = new Date();
    slotTime.setHours(h, m, 0);
    slotTime.setHours(slotTime.getHours() - STORE_SETTINGS.minHoursAhead);
    if (now > slotTime) return false;
  }
  return true;
};

const getSlotCapacity = (date, slot) => {
  const key = `${date}_${slot}`;
  return STORE_SETTINGS.maxPerSlot - (BOOKED[key] || 0);
};

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("store");
  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0f0f0f", fontFamily: "'Noto Kufi Arabic','Cairo',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .slot-btn { transition: all 0.2s; }
        .slot-btn:hover:not(:disabled) { transform: scale(1.04); }
        .product-card { transition: all 0.25s; }
        .product-card:hover { transform: translateY(-3px); }
        .order-row:hover { background: rgba(255,255,255,0.03) !important; }
        .order-row { cursor: pointer; transition: background 0.15s; }
      `}</style>

      {/* Nav */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 8, padding: "16px 20px",
        borderBottom: "1px solid #1a1a1a",
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        {[{ k: "store", l: "🛍️ صفحة الزبون" }, { k: "dashboard", l: "📦 داشبورد التاجر" }, { k: "settings", l: "⚙️ إعدادات الأوقات" }].map(t => (
          <button key={t.k} onClick={() => setView(t.k)} style={{
            padding: "9px 18px", borderRadius: 50, border: "1px solid",
            borderColor: view === t.k ? "#e8a04a" : "#1f1f1f",
            background: view === t.k ? "#e8a04a" : "transparent",
            color: view === t.k ? "#0f0f0f" : "#555",
            fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer",
            transition: "all 0.2s",
          }}>{t.l}</button>
        ))}
      </div>

      <div className="fade" key={view}>
        {view === "store" && <StorePage />}
        {view === "dashboard" && <DashboardPage />}
        {view === "settings" && <SettingsPage />}
      </div>
    </div>
  );
}

// ─── STORE PAGE (الزبون) ──────────────────────────────────────
function StorePage() {
  const [cart, setCart] = useState({});
  const [step, setStep] = useState("browse");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState(null); // { lat, lng, area }
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  const getLocation = async () => {
    setLocLoading(true);
    setLocError("");
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 10000 })
      );
      const { latitude: lat, longitude: lng } = pos.coords;
      // Reverse geocode via Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`
      );
      const data = await res.json();
      const area = data.address?.suburb || data.address?.city_district || data.address?.county || data.address?.city || "موقعك الحالي";
      setLocation({ lat, lng, area });
      setForm(f => ({ ...f, address: area }));
    } catch (e) {
      setLocError("تعذّر الحصول على الموقع — اكتبه يدوياً");
    } finally {
      setLocLoading(false);
    }
  };

  const days = getDaysAhead(5);
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === Number(id));
    return s + (p ? p.price * qty : 0);
  }, 0);

  const add = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) => setCart(c => { const n = { ...c }; if (n[id] > 1) n[id]--; else delete n[id]; return n; });

  const canConfirm = form.name && form.phone && (location || form.address) && selectedDate && selectedSlot && paymentMethod;

  if (success) return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
      <h2 style={{ color: "white", fontWeight: 900, fontSize: 24, marginBottom: 12 }}>تم تأكيد طلبك!</h2>
      <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 16, padding: 20, marginBottom: 24 }}>
        <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 16, marginBottom: 4 }}>موعد التسليم</div>
        <div style={{ color: "white", fontWeight: 900, fontSize: 22, marginBottom: 12 }}>
          {days.find(d => d.value === selectedDate)?.label} — الساعة {selectedSlot}
        </div>
        <div style={{ borderTop: "1px solid #1f1f1f", paddingTop: 12 }}>
          <div style={{ color: "#555", fontSize: 12, marginBottom: 4 }}>طريقة الدفع</div>
          <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>
            {paymentMethod === "cash" ? "💵 كاش عند التسليم" : "🏦 تحويل بنكي"}
          </div>
          {paymentMethod === "transfer" && (
            <div style={{ color: "#f59e0b", fontSize: 12, marginTop: 6, fontWeight: 600 }}>
              ⚠️ لا تنسى ترسل إيصال التحويل على الواتساب
            </div>
          )}
        </div>
      </div>
      <p style={{ color: "#555", fontSize: 13, marginBottom: 24 }}>سيتواصل معك المطبخ للتأكيد</p>
      <button onClick={() => { setSuccess(false); setCart({}); setStep("browse"); setSelectedDate(""); setSelectedSlot(""); setForm({ name: "", phone: "", address: "", notes: "" }); setPaymentMethod(""); setLocation(null); }} style={{
        background: "#e8a04a", color: "#0f0f0f", border: "none", borderRadius: 12,
        padding: "12px 28px", fontFamily: "inherit", fontWeight: 800, fontSize: 14, cursor: "pointer",
      }}>طلب جديد</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #2c1810, #8b4513)",
        borderRadius: 20, padding: "28px 24px", textAlign: "center", marginBottom: 24,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(232,160,74,0.15), transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 42, marginBottom: 8 }}>🍽️</div>
          <h1 style={{ color: "white", fontWeight: 900, fontSize: 22, marginBottom: 4 }}>{STORE_SETTINGS.name}</h1>
          <div style={{ color: "#e8a04a", fontSize: 12, fontWeight: 700 }}>📅 طلبات مسبقة — اختار يومك ووقتك</div>
        </div>
      </div>

      {step === "browse" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            {PRODUCTS.map(p => (
              <div key={p.id} className="product-card" style={{
                background: "#141414", border: "1px solid #1f1f1f",
                borderRadius: 18, overflow: "hidden",
              }}>
                <div style={{
                  height: 80, background: "linear-gradient(135deg, #2c181020, #8b451320)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 40, position: "relative",
                }}>
                  {p.emoji}
                  {cart[p.id] && (
                    <div style={{
                      position: "absolute", top: 8, left: 8,
                      background: "#e8a04a", color: "#0f0f0f",
                      borderRadius: 50, width: 22, height: 22,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 900, fontSize: 11,
                    }}>{cart[p.id]}</div>
                  )}
                </div>
                <div style={{ padding: "12px" }}>
                  <div style={{ color: "white", fontWeight: 800, fontSize: 13, marginBottom: 3 }}>{p.name}</div>
                  <div style={{ color: "#555", fontSize: 11, marginBottom: 10 }}>{p.desc}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#e8a04a", fontWeight: 900, fontSize: 13 }}>{p.price.toFixed(3)} KWD</span>
                    {!cart[p.id] ? (
                      <button onClick={() => add(p.id)} style={{
                        background: "#e8a04a", color: "#0f0f0f", border: "none", borderRadius: 50,
                        width: 28, height: 28, fontSize: 18, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>+</button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => remove(p.id)} style={{ background: "#1f1f1f", color: "#ccc", border: "none", borderRadius: 50, width: 26, height: 26, fontSize: 16, cursor: "pointer" }}>−</button>
                        <span style={{ color: "white", fontWeight: 800, fontSize: 14, minWidth: 16, textAlign: "center" }}>{cart[p.id]}</span>
                        <button onClick={() => add(p.id)} style={{ background: "#e8a04a", color: "#0f0f0f", border: "none", borderRadius: 50, width: 26, height: 26, fontSize: 16, cursor: "pointer" }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalItems > 0 && (
            <button onClick={() => setStep("schedule")} style={{
              width: "100%", background: "linear-gradient(90deg, #c0622a, #e8a04a)",
              border: "none", borderRadius: 14, padding: "15px",
              color: "white", fontFamily: "inherit", fontWeight: 800, fontSize: 15, cursor: "pointer",
            }}>
              📅 اختار موعد التسليم — {totalItems} منتج ({totalPrice.toFixed(3)} KWD)
            </button>
          )}
        </>
      )}

      {step === "schedule" && (
        <div>
          <button onClick={() => setStep("browse")} style={{ background: "none", border: "none", color: "#e8a04a", fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 20 }}>← رجوع</button>

          {/* Date Selection */}
          <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 18, padding: 20, marginBottom: 16 }}>
            <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 14, marginBottom: 14 }}>📅 اختار اليوم</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {days.map(d => (
                <button key={d.value} className="slot-btn" onClick={() => { setSelectedDate(d.value); setSelectedSlot(""); }} style={{
                  padding: "10px 16px", borderRadius: 12, border: "1px solid",
                  borderColor: selectedDate === d.value ? "#e8a04a" : "#1f1f1f",
                  background: selectedDate === d.value ? "#e8a04a15" : "transparent",
                  color: selectedDate === d.value ? "#e8a04a" : "#666",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer",
                }}>{d.label}</button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 18, padding: 20, marginBottom: 16 }}>
              <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 14, marginBottom: 14 }}>⏰ اختار الوقت</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {STORE_SETTINGS.slots.map(slot => {
                  const available = isSlotAvailable(selectedDate, slot);
                  const remaining = getSlotCapacity(selectedDate, slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button key={slot} className="slot-btn"
                      disabled={!available}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: "12px 8px", borderRadius: 14, border: "1px solid",
                        borderColor: isSelected ? "#e8a04a" : !available ? "#1a1a1a" : "#1f1f1f",
                        background: isSelected ? "#e8a04a15" : !available ? "#0f0f0f" : "transparent",
                        cursor: available ? "pointer" : "not-allowed",
                        opacity: available ? 1 : 0.4,
                        fontFamily: "inherit",
                      }}>
                      <div style={{ color: isSelected ? "#e8a04a" : available ? "white" : "#333", fontWeight: 800, fontSize: 15 }}>{slot}</div>
                      <div style={{ fontSize: 10, marginTop: 3, color: !available ? "#333" : remaining <= 2 ? "#f87171" : "#555", fontWeight: 600 }}>
                        {!available ? "ممتلئ" : remaining <= 2 ? `${remaining} متبقي` : "متاح"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Info */}
          {selectedDate && selectedSlot && (
            <div style={{ background: "#0a1f0a", border: "1px solid #22c55e30", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 13 }}>
                ✅ موعد التسليم: {days.find(d => d.value === selectedDate)?.label} — الساعة {selectedSlot}
              </div>
            </div>
          )}

          <button onClick={() => setStep("checkout")} disabled={!selectedDate || !selectedSlot} style={{
            width: "100%",
            background: selectedDate && selectedSlot ? "linear-gradient(90deg, #c0622a, #e8a04a)" : "#1a1a1a",
            color: selectedDate && selectedSlot ? "white" : "#333",
            border: "none", borderRadius: 14, padding: "15px",
            fontFamily: "inherit", fontWeight: 800, fontSize: 15,
            cursor: selectedDate && selectedSlot ? "pointer" : "not-allowed",
          }}>
            التالي ← بيانات التوصيل
          </button>
        </div>
      )}

      {step === "checkout" && (
        <div>
          <button onClick={() => setStep("schedule")} style={{ background: "none", border: "none", color: "#e8a04a", fontFamily: "inherit", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 20 }}>← تغيير الموعد</button>

          {/* Delivery badge */}
          <div style={{ background: "#e8a04a15", border: "1px solid #e8a04a30", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>📅</span>
            <div>
              <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 13 }}>{days.find(d => d.value === selectedDate)?.label} — الساعة {selectedSlot}</div>
              <div style={{ color: "#555", fontSize: 11 }}>موعد التسليم المختار</div>
            </div>
            <button onClick={() => setStep("schedule")} style={{ marginRight: "auto", background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>تغيير</button>
          </div>

          {/* Order Summary */}
          <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 18, padding: 18, marginBottom: 16 }}>
            <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>🧾 ملخص الطلب</div>
            {Object.entries(cart).map(([id, qty]) => {
              const p = PRODUCTS.find(p => p.id === Number(id));
              return p ? (
                <div key={id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a", fontSize: 13 }}>
                  <span style={{ color: "#ccc" }}>{p.name} × {qty}</span>
                  <span style={{ color: "#e8a04a", fontWeight: 700 }}>{(p.price * qty).toFixed(3)} KWD</span>
                </div>
              ) : null;
            })}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #1f1f1f" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 15 }}>الإجمالي</span>
              <span style={{ color: "#e8a04a", fontWeight: 900, fontSize: 17 }}>{totalPrice.toFixed(3)} KWD</span>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 18, padding: 18, marginBottom: 16 }}>
            <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>📍 بيانات التوصيل</div>
            {[
              { k: "name", l: "الاسم", p: "اسمك الكريم" },
              { k: "phone", l: "رقم الهاتف", p: "05XXXXXXXX" },
              { k: "notes", l: "ملاحظات (اختياري)", p: "أي تعليمات خاصة..." },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", color: "#555", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{f.l}</label>
                <input placeholder={f.p} value={form[f.k]} onChange={e => setForm(prev => ({ ...prev, [f.k]: e.target.value }))}
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: 10,
                    border: "1px solid #1f1f1f", background: "#0f0f0f",
                    color: "white", fontFamily: "inherit", fontSize: 13, outline: "none",
                  }} />
              </div>
            ))}

            {/* Location Picker */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "#555", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📍 موقع التوصيل</label>

              {/* GPS Button */}
              {!location && (
                <button onClick={getLocation} disabled={locLoading} style={{
                  width: "100%", padding: "13px",
                  background: locLoading ? "#0f0f0f" : "#1a3a1a",
                  border: "1px solid",
                  borderColor: locLoading ? "#1f1f1f" : "#22c55e40",
                  borderRadius: 12, color: locLoading ? "#444" : "#22c55e",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                  cursor: locLoading ? "not-allowed" : "pointer",
                  marginBottom: 8,
                }}>
                  {locLoading ? "⏳ جاري تحديد موقعك..." : "📡 اضغط لتحديد موقعك تلقائياً"}
                </button>
              )}

              {/* Location confirmed */}
              {location && (
                <div style={{
                  background: "#0a1f0a", border: "1px solid #22c55e40",
                  borderRadius: 12, padding: "12px 14px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ fontSize: 20 }}>📍</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 14 }}>{location.area}</div>
                    <div style={{ color: "#444", fontSize: 11, marginTop: 2 }} dir="ltr">
                      {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </div>
                  </div>
                  <button onClick={() => { setLocation(null); setForm(f => ({ ...f, address: "" })); }} style={{
                    background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16,
                  }}>✕</button>
                </div>
              )}

              {locError && <div style={{ color: "#f87171", fontSize: 12, marginBottom: 8 }}>⚠️ {locError}</div>}

              {/* Manual fallback */}
              <input
                placeholder="أو اكتب العنوان يدوياً..."
                value={location ? "" : form.address}
                disabled={!!location}
                onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: "1px solid #1f1f1f", background: location ? "#0a0a0a" : "#0f0f0f",
                  color: location ? "#333" : "white",
                  fontFamily: "inherit", fontSize: 13, outline: "none",
                  cursor: location ? "not-allowed" : "text",
                }} />
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 18, padding: 18, marginBottom: 16 }}>
            <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>💳 طريقة الدفع</div>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { k: "cash", icon: "💵", label: "كاش عند التسليم" },
                { k: "transfer", icon: "🏦", label: "تحويل بنكي" },
              ].map(p => (
                <button key={p.k} onClick={() => setPaymentMethod(p.k)} style={{
                  flex: 1, padding: "14px 10px", borderRadius: 14, border: "1px solid",
                  borderColor: paymentMethod === p.k ? "#e8a04a" : "#1f1f1f",
                  background: paymentMethod === p.k ? "#e8a04a15" : "transparent",
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ color: paymentMethod === p.k ? "#e8a04a" : "#555", fontWeight: 700, fontSize: 12 }}>{p.label}</div>
                </button>
              ))}
            </div>
            {paymentMethod === "transfer" && (
              <div style={{ marginTop: 14, background: "#0a1a0a", border: "1px solid #22c55e30", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ color: "#22c55e", fontWeight: 800, fontSize: 13, marginBottom: 8 }}>📋 بيانات التحويل</div>
                <div style={{ color: "#888", fontSize: 13, lineHeight: 2 }}>
                  <div>البنك: <span style={{ color: "white", fontWeight: 700 }}>بنك الكويت الوطني</span></div>
                  <div>اسم الحساب: <span style={{ color: "white", fontWeight: 700 }}>نورة الرشيدي</span></div>
                  <div>رقم IBAN: <span style={{ color: "white", fontWeight: 700 }} dir="ltr">KW91NBOK0000000000001234567890</span></div>
                </div>
                <div style={{ marginTop: 10, color: "#f59e0b", fontSize: 12, fontWeight: 600 }}>
                  ⚠️ أرسل إيصال التحويل على الواتساب بعد الطلب
                </div>
              </div>
            )}
          </div>

          <button disabled={!canConfirm} onClick={() => setSuccess(true)} style={{
            width: "100%",
            background: canConfirm ? "linear-gradient(90deg, #c0622a, #e8a04a)" : "#1a1a1a",
            color: canConfirm ? "white" : "#333",
            border: "none", borderRadius: 14, padding: "15px",
            fontFamily: "inherit", fontWeight: 800, fontSize: 15,
            cursor: canConfirm ? "pointer" : "not-allowed",
          }}>✅ تأكيد الطلب</button>
        </div>
      )}
    </div>
  );
}

// ─── DASHBOARD PAGE (التاجر) ──────────────────────────────────
function DashboardPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selected, setSelected] = useState(null);
  const [filterDate, setFilterDate] = useState("all");

  const days = getDaysAhead(5);
  const allDates = [...new Set(orders.map(o => o.deliveryDate))].sort();

  const filtered = filterDate === "all" ? orders : orders.filter(o => o.deliveryDate === filterDate);

  // Group by delivery time
  const grouped = {};
  filtered.forEach(o => {
    const key = `${o.deliveryDate}_${o.deliveryTime}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(o);
  });
  const sortedKeys = Object.keys(grouped).sort();

  // Group by area per time slot
  const areaSummary = {};
  filtered.forEach(o => {
    const key = `${o.deliveryDate}_${o.deliveryTime}`;
    if (!areaSummary[key]) areaSummary[key] = {};
    areaSummary[key][o.area] = (areaSummary[key][o.area] || 0) + 1;
  });

  const setStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const buildWhatsAppMsg = (date, time, slotOrders) => {
    const dateLabel = getDaysAhead(5).find(d => d.value === date)?.label || date;

    // ترتيب بالمنطقة عشان المندوب يخلص منطقة كاملة قبل ما ينتقل
    const sorted = [...slotOrders].sort((a, b) => a.area.localeCompare(b.area, "ar"));

    let msg = `🚚 *طلبات المندوب*\n`;
    msg += `📅 ${dateLabel} — ⏰ ${time}\n`;
    msg += `━━━━━━━━━━━━━━━\n\n`;

    let currentArea = "";
    sorted.forEach((o, i) => {
      // هيدر المنطقة لما تتغير
      if (o.area !== currentArea) {
        currentArea = o.area;
        msg += `📍 *${currentArea}*\n`;
        msg += `─────────────\n`;
      }

      msg += `*${i + 1}.* ${o.customer}\n`;
      msg += `📞 ${o.phone}\n`;
      msg += `🛍️ ${o.items.map(it => `${it.name} ×${it.qty}`).join(" | ")}\n`;
      msg += `💰 ${orderTotal(o.items).toFixed(3)} KWD`;
      msg += o.payment === "transfer" ? " — 🏦 تحويل ✅" : " — 💵 كاش";
      if (o.lat && o.lng) msg += `\n🗺️ https://maps.google.com/?q=${o.lat},${o.lng}`;
      msg += `\n\n`;
    });

    const totalCash = sorted.filter(o => o.payment !== "transfer").reduce((s, o) => s + orderTotal(o.items), 0);
    msg += `━━━━━━━━━━━━━━━\n`;
    msg += `📦 إجمالي: ${sorted.length} طلبات\n`;
    if (totalCash > 0) msg += `💵 كاش تحصّله: ${totalCash.toFixed(3)} KWD`;

    return encodeURIComponent(msg);
  };

  const formatDate = (dateStr) => {
    const d = days.find(d => d.value === dateStr);
    return d ? d.label : dateStr;
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 16px" }}>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "جديد", value: orders.filter(o => o.status === "new").length, color: "#f59e0b" },
          { label: "قيد التحضير", value: orders.filter(o => o.status === "preparing").length, color: "#3b82f6" },
          { label: "مكتمل", value: orders.filter(o => o.status === "done").length, color: "#22c55e" },
          { label: "إجمالي اليوم", value: `${orders.reduce((s, o) => s + orderTotal(o.items), 0).toFixed(1)} KWD`, color: "#e8a04a" },
        ].map(s => (
          <div key={s.label} style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 14, padding: "16px" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Date Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => setFilterDate("all")} style={{
          padding: "8px 14px", borderRadius: 50, border: "1px solid",
          borderColor: filterDate === "all" ? "#e8a04a" : "#1f1f1f",
          background: filterDate === "all" ? "#e8a04a15" : "transparent",
          color: filterDate === "all" ? "#e8a04a" : "#555",
          fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer",
        }}>كل الأيام</button>
        {allDates.map(d => (
          <button key={d} onClick={() => setFilterDate(d)} style={{
            padding: "8px 14px", borderRadius: 50, border: "1px solid",
            borderColor: filterDate === d ? "#e8a04a" : "#1f1f1f",
            background: filterDate === d ? "#e8a04a15" : "transparent",
            color: filterDate === d ? "#e8a04a" : "#555",
            fontFamily: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>{formatDate(d)}</button>
        ))}
      </div>

      {/* Grouped by time */}
      {sortedKeys.map(key => {
        const [date, time] = key.split("_");
        const groupOrders = grouped[key];
        return (
          <div key={key} style={{ marginBottom: 24 }}>
            {/* Time header */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{
                  background: "#e8a04a20", border: "1px solid #e8a04a40",
                  borderRadius: 10, padding: "6px 14px",
                  color: "#e8a04a", fontWeight: 800, fontSize: 14,
                }}>
                  📅 {formatDate(date)} — ⏰ {time}
                </div>
                <div style={{ color: "#333", fontSize: 12 }}>{groupOrders.length} طلبات</div>
                <div style={{ flex: 1, height: 1, background: "#1a1a1a" }} />
                <a
                  href={`https://wa.me/?text=${buildWhatsAppMsg(date, time, groupOrders)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "#25D36615", border: "1px solid #25D36640",
                    borderRadius: 10, padding: "7px 14px",
                    color: "#25D366", fontWeight: 700, fontSize: 12,
                    textDecoration: "none", flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                >
                  <span>📤</span> إرسال للمندوب
                </a>
              </div>

              {/* Area summary chips */}
              {areaSummary[key] && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                  {Object.entries(areaSummary[key]).map(([area, count]) => (
                    <div key={area} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "#1a1a2e", border: "1px solid #3b82f630",
                      borderRadius: 50, padding: "4px 12px",
                    }}>
                      <span style={{ fontSize: 12 }}>📍</span>
                      <span style={{ color: "#60a5fa", fontSize: 12, fontWeight: 700 }}>{area}</span>
                      <span style={{
                        background: "#3b82f6", color: "white",
                        borderRadius: 50, width: 18, height: 18,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 900,
                      }}>{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders in this slot */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {groupOrders.map(order => {
                const st = STATUS_MAP[order.status];
                return (
                  <div key={order.id} className="order-row" onClick={() => setSelected(order)}
                    style={{
                      background: "#141414", border: "1px solid #1f1f1f",
                      borderRadius: 14, padding: "16px 18px",
                      display: "flex", alignItems: "center", gap: 16,
                    }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>{order.customer}</span>
                        <span style={{
                          background: st.bg, color: st.color,
                          padding: "2px 8px", borderRadius: 50, fontSize: 11, fontWeight: 700,
                        }}>{st.icon} {st.label}</span>
                      </div>
                      <div style={{ color: "#444", fontSize: 12, marginBottom: 3 }}>
                        {order.items.map(i => `${i.name} ×${i.qty}`).join("، ")}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11 }}>📍</span>
                        <span style={{ color: "#3b82f6", fontSize: 12, fontWeight: 600 }}>{order.area}</span>
                        <span style={{ marginRight: 6, fontSize: 11 }}>·</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: order.payment === "transfer" ? "#22c55e" : "#f59e0b",
                        }}>
                          {order.payment === "transfer" ? "🏦 تحويل" : "💵 كاش"}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "#e8a04a", fontWeight: 900, fontSize: 15 }}>{orderTotal(order.items).toFixed(3)}</div>
                      <div style={{ color: "#333", fontSize: 10 }}>KWD</div>
                    </div>
                    {order.status === "new" && (
                      <button onClick={e => { e.stopPropagation(); setStatus(order.id, "preparing"); }} style={{
                        background: "#3b82f615", color: "#3b82f6", border: "1px solid #3b82f630",
                        borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                      }}>ابدأ</button>
                    )}
                    {order.status === "preparing" && (
                      <button onClick={e => { e.stopPropagation(); setStatus(order.id, "done"); }} style={{
                        background: "#22c55e15", color: "#22c55e", border: "1px solid #22c55e30",
                        borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                      }}>تم ✓</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SETTINGS PAGE (إعدادات الأوقات) ─────────────────────────
function SettingsPage() {
  const [slots, setSlots] = useState(STORE_SETTINGS.slots);
  const [maxPerSlot, setMaxPerSlot] = useState(STORE_SETTINGS.maxPerSlot);
  const [minHours, setMinHours] = useState(STORE_SETTINGS.minHoursAhead);
  const [newSlot, setNewSlot] = useState("");
  const [saved, setSaved] = useState(false);

  const addSlot = () => {
    if (newSlot && !slots.includes(newSlot)) {
      setSlots(prev => [...prev, newSlot].sort());
      setNewSlot("");
    }
  };

  const removeSlot = (s) => setSlots(prev => prev.filter(x => x !== s));

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px" }}>
      <h2 style={{ color: "white", fontWeight: 900, fontSize: 18, marginBottom: 24 }}>⚙️ إعدادات أوقات التسليم</h2>

      {/* Slots */}
      <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 18, padding: 20, marginBottom: 16 }}>
        <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>⏰ الأوقات المتاحة</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {slots.map(s => (
            <div key={s} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#e8a04a15", border: "1px solid #e8a04a30",
              borderRadius: 50, padding: "6px 12px",
            }}>
              <span style={{ color: "#e8a04a", fontWeight: 700, fontSize: 13 }}>{s}</span>
              <button onClick={() => removeSlot(s)} style={{
                background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 14, padding: 0,
              }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="time" value={newSlot} onChange={e => setNewSlot(e.target.value)}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 10,
              border: "1px solid #1f1f1f", background: "#0f0f0f",
              color: "white", fontFamily: "inherit", fontSize: 13, outline: "none",
            }} />
          <button onClick={addSlot} style={{
            background: "#e8a04a", color: "#0f0f0f", border: "none", borderRadius: 10,
            padding: "10px 18px", fontFamily: "inherit", fontWeight: 800, cursor: "pointer",
          }}>+ إضافة</button>
        </div>
      </div>

      {/* Max per slot */}
      <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 18, padding: 20, marginBottom: 16 }}>
        <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>👥 الحد الأقصى لكل وقت</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setMaxPerSlot(m => Math.max(1, m - 1))} style={{ background: "#1f1f1f", color: "white", border: "none", borderRadius: 50, width: 36, height: 36, fontSize: 20, cursor: "pointer" }}>−</button>
          <span style={{ color: "white", fontWeight: 900, fontSize: 24, minWidth: 40, textAlign: "center" }}>{maxPerSlot}</span>
          <button onClick={() => setMaxPerSlot(m => m + 1)} style={{ background: "#e8a04a", color: "#0f0f0f", border: "none", borderRadius: 50, width: 36, height: 36, fontSize: 20, cursor: "pointer" }}>+</button>
          <span style={{ color: "#555", fontSize: 13 }}>طلب لكل وقت</span>
        </div>
      </div>

      {/* Min hours ahead */}
      <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 18, padding: 20, marginBottom: 24 }}>
        <div style={{ color: "#e8a04a", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>⏳ الحجز المسبق الأدنى</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setMinHours(m => Math.max(1, m - 1))} style={{ background: "#1f1f1f", color: "white", border: "none", borderRadius: 50, width: 36, height: 36, fontSize: 20, cursor: "pointer" }}>−</button>
          <span style={{ color: "white", fontWeight: 900, fontSize: 24, minWidth: 40, textAlign: "center" }}>{minHours}</span>
          <button onClick={() => setMinHours(m => m + 1)} style={{ background: "#e8a04a", color: "#0f0f0f", border: "none", borderRadius: 50, width: 36, height: 36, fontSize: 20, cursor: "pointer" }}>+</button>
          <span style={{ color: "#555", fontSize: 13 }}>ساعة على الأقل قبل التسليم</span>
        </div>
      </div>

      <button onClick={save} style={{
        width: "100%",
        background: saved ? "#22c55e" : "linear-gradient(90deg, #c0622a, #e8a04a)",
        color: saved ? "white" : "white",
        border: "none", borderRadius: 14, padding: "15px",
        fontFamily: "inherit", fontWeight: 800, fontSize: 15, cursor: "pointer",
        transition: "all 0.3s",
      }}>
        {saved ? "✅ تم الحفظ!" : "💾 حفظ الإعدادات"}
      </button>
    </div>
  );
}
