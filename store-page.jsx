import { useState } from "react";

const STORE = {
  name: "مطبخ أم نورة",
  slug: "om-noura",
  description: "أشهى الأكلات الكويتية المنزلية — طازجة يومياً",
  cover: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
  logo: "🍽️",
  whatsapp: "96512345678",
};

const PRODUCTS = [
  { id: 1, name: "مجبوس دجاج", price: 4.5, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", desc: "أرز بسمتي مع دجاج متبل بالبهارات الكويتية" },
  { id: 2, name: "هريس لحم", price: 3.5, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80", desc: "هريس منزلي طازج بلحم الغنم" },
  { id: 3, name: "جريش", price: 3.0, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80", desc: "جريش كويتي أصيل بالسمن البلدي" },
  { id: 4, name: "مطبق", price: 2.5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", desc: "مطبق دجاج وخضار محمر بالزبدة" },
  { id: 5, name: "كبسة لحم", price: 5.0, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80", desc: "كبسة لحم بالبهارات الخاصة" },
  { id: 6, name: "محاشي", price: 4.0, image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80", desc: "كوسا وورق عنب محشي بالأرز واللحم" },
];

export default function StorePage() {
  const [cart, setCart] = useState({});
  const [step, setStep] = useState("browse"); // browse | checkout | success
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const add = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) => setCart(c => {
    const n = { ...c };
    if (n[id] > 1) n[id]--;
    else delete n[id];
    return n;
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setStep("success");
  };

  const cartItems = Object.entries(cart).map(([id, qty]) => ({
    ...PRODUCTS.find(p => p.id === Number(id)),
    qty
  }));

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "#fdf8f3",
      fontFamily: "'Noto Kufi Arabic', 'Cairo', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { direction: rtl; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(180,100,30,0.15); }
        .product-card { transition: all 0.3s ease; }
        .btn-primary { transition: all 0.2s; }
        .btn-primary:hover { transform: scale(1.03); filter: brightness(1.05); }
        .qty-btn:hover { background: #c0622a !important; }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #2c1810 0%, #5c2e1a 50%, #8b4513 100%)",
        color: "white",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${STORE.cover})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.2,
        }} />
        <div style={{
          position: "relative", zIndex: 1,
          padding: "40px 24px 32px",
          maxWidth: 680, margin: "0 auto",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{STORE.logo}</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8, letterSpacing: "-0.5px" }}>
            {STORE.name}
          </h1>
          <p style={{ fontSize: 15, opacity: 0.85, fontWeight: 400 }}>{STORE.description}</p>

          {totalItems > 0 && step === "browse" && (
            <button
              className="btn-primary"
              onClick={() => setStep("checkout")}
              style={{
                marginTop: 20,
                background: "#e8a04a",
                border: "none",
                borderRadius: 50,
                padding: "12px 28px",
                color: "white",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}>
              🛒 السلة ({totalItems}) — {totalPrice.toFixed(3)} KWD
            </button>
          )}
        </div>
      </div>

      {/* Browse */}
      {step === "browse" && (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px" }} className="fade-in">
          <p style={{ color: "#8b6347", fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
            📦 {PRODUCTS.length} منتج متاح
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PRODUCTS.map(p => (
              <div key={p.id} className="product-card" style={{
                background: "white",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}>
                <div style={{
                  height: 140,
                  backgroundImage: `url(${p.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}>
                  {cart[p.id] && (
                    <div style={{
                      position: "absolute", top: 10, left: 10,
                      background: "#c0622a",
                      color: "white",
                      borderRadius: 50,
                      width: 26, height: 26,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 13,
                    }}>{cart[p.id]}</div>
                  )}
                </div>
                <div style={{ padding: "14px 14px 16px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2c1810", marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ fontSize: 12, color: "#9a7a65", marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 800, color: "#c0622a", fontSize: 15 }}>
                      {p.price.toFixed(3)} KWD
                    </span>
                    {!cart[p.id] ? (
                      <button onClick={() => add(p.id)} style={{
                        background: "#c0622a",
                        color: "white",
                        border: "none",
                        borderRadius: 50,
                        width: 32, height: 32,
                        fontSize: 20,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "inherit",
                      }}>+</button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button className="qty-btn" onClick={() => remove(p.id)} style={{
                          background: "#e0c9b8", color: "#2c1810",
                          border: "none", borderRadius: 50,
                          width: 28, height: 28, fontSize: 16,
                          cursor: "pointer", transition: "all 0.2s",
                        }}>−</button>
                        <span style={{ fontWeight: 700, color: "#2c1810", minWidth: 20, textAlign: "center" }}>
                          {cart[p.id]}
                        </span>
                        <button onClick={() => add(p.id)} style={{
                          background: "#c0622a", color: "white",
                          border: "none", borderRadius: 50,
                          width: 28, height: 28, fontSize: 16,
                          cursor: "pointer",
                        }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout */}
      {step === "checkout" && (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "28px 16px" }} className="fade-in">
          <button onClick={() => setStep("browse")} style={{
            background: "none", border: "none", color: "#c0622a",
            fontSize: 14, fontFamily: "inherit", fontWeight: 600,
            cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 4,
          }}>← رجوع للمنتجات</button>

          {/* Order Summary */}
          <div style={{ background: "white", borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
            <h2 style={{ fontWeight: 800, color: "#2c1810", marginBottom: 16, fontSize: 17 }}>🧾 ملخص الطلب</h2>
            {cartItems.map(item => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: "1px solid #f5ede6",
              }}>
                <span style={{ color: "#5c3a28", fontWeight: 600, fontSize: 14 }}>
                  {item.name} × {item.qty}
                </span>
                <span style={{ fontWeight: 700, color: "#c0622a", fontSize: 14 }}>
                  {(item.price * item.qty).toFixed(3)} KWD
                </span>
              </div>
            ))}
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 14, paddingTop: 14,
              borderTop: "2px solid #f0ddd0",
            }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#2c1810" }}>الإجمالي</span>
              <span style={{ fontWeight: 900, fontSize: 18, color: "#c0622a" }}>{totalPrice.toFixed(3)} KWD</span>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: "white", borderRadius: 20, padding: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
            <h2 style={{ fontWeight: 800, color: "#2c1810", marginBottom: 16, fontSize: 17 }}>📍 بيانات التوصيل</h2>
            {[
              { key: "name", label: "الاسم", placeholder: "اسمك الكريم", type: "text" },
              { key: "phone", label: "رقم الهاتف", placeholder: "05XXXXXXXX", type: "tel" },
              { key: "address", label: "العنوان", placeholder: "المنطقة، الشارع، رقم المنزل", type: "text" },
              { key: "notes", label: "ملاحظات (اختياري)", placeholder: "أي تعليمات خاصة...", type: "text" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#5c3a28", marginBottom: 6 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  style={{
                    width: "100%", padding: "12px 14px",
                    borderRadius: 12, border: "1.5px solid #e8d5c4",
                    fontSize: 14, fontFamily: "inherit",
                    outline: "none", color: "#2c1810",
                    background: "#fdf8f3",
                    direction: "rtl",
                  }}
                />
              </div>
            ))}

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={submitting || !form.name || !form.phone || !form.address}
              style={{
                width: "100%",
                background: (!form.name || !form.phone || !form.address) ? "#d4b8a8" : "#c0622a",
                color: "white", border: "none", borderRadius: 14,
                padding: "16px", fontSize: 16, fontWeight: 800,
                cursor: (!form.name || !form.phone || !form.address) ? "not-allowed" : "pointer",
                fontFamily: "inherit", marginTop: 4,
              }}>
              {submitting ? "جاري إرسال الطلب..." : "✅ تأكيد الطلب"}
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {step === "success" && (
        <div style={{
          maxWidth: 400, margin: "60px auto",
          padding: "40px 24px", textAlign: "center",
        }} className="fade-in">
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#2c1810", marginBottom: 12 }}>
            تم استلام طلبك!
          </h2>
          <p style={{ color: "#8b6347", fontSize: 15, marginBottom: 32, lineHeight: 1.8 }}>
            شكراً {form.name}، سيتواصل معك {STORE.name} قريباً لتأكيد الطلب والوقت المتوقع للتوصيل.
          </p>
          <a
            href={`https://wa.me/${STORE.whatsapp}?text=مرحبا، طلبت من متجركم وأريد التأكيد`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#25D366",
              color: "white", textDecoration: "none",
              borderRadius: 14, padding: "14px 28px",
              fontWeight: 700, fontSize: 15, fontFamily: "inherit",
            }}>
            💬 تواصل عبر واتساب
          </a>
          <button
            onClick={() => { setStep("browse"); setCart({}); setForm({ name: "", phone: "", address: "", notes: "" }); }}
            style={{
              display: "block", margin: "16px auto 0",
              background: "none", border: "none",
              color: "#c0622a", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>
            طلب جديد
          </button>
        </div>
      )}
    </div>
  );
}
