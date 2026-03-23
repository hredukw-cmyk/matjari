import { useState } from "react";

const THEMES = {
  restaurant: {
    label: "مطعم / مطبخ", emoji: "🍽️",
    primary: "#8b4513", secondary: "#5c2e1a", accent: "#e8a04a",
    bg: "#fdf8f3", cardBg: "#fff", textPrimary: "#2c1810", textSub: "#9a7a65",
    font: "'Noto Kufi Arabic', serif",
    headerBg: "linear-gradient(135deg, #2c1810 0%, #5c2e1a 50%, #8b4513 100%)",
    tag: "طازج يومياً 🌿",
  },
  fashion: {
    label: "ملابس / عبايات", emoji: "👗",
    primary: "#1a1a2e", secondary: "#16213e", accent: "#c9a84c",
    bg: "#f8f7f4", cardBg: "#fff", textPrimary: "#1a1a2e", textSub: "#8a8070",
    font: "'Noto Kufi Arabic', sans-serif",
    headerBg: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #2d2d4e 100%)",
    tag: "كولكشن جديد ✨",
  },
  sweets: {
    label: "حلويات / كيك", emoji: "🧁",
    primary: "#c0507a", secondary: "#a03060",
    accent: "#f7c5d5",
    bg: "#fff5f8", cardBg: "#fff", textPrimary: "#6b1f3a", textSub: "#b07090",
    font: "'Noto Kufi Arabic', sans-serif",
    headerBg: "linear-gradient(135deg, #8b2252 0%, #c0507a 50%, #e8829a 100%)",
    tag: "محضّر بالحب 💕",
  },
  beauty: {
    label: "عطور / مكياج", emoji: "💄",
    primary: "#6b4f8e", secondary: "#4a3070",
    accent: "#d4b8f0",
    bg: "#faf7ff", cardBg: "#fff", textPrimary: "#2d1a4a", textSub: "#9a80b0",
    font: "'Noto Kufi Arabic', sans-serif",
    headerBg: "linear-gradient(135deg, #2d1a4a 0%, #6b4f8e 50%, #9b7fc0 100%)",
    tag: "فاخر وأصيل 💜",
  },
  organic: {
    label: "عضوي / صحي", emoji: "🌿",
    primary: "#2d6a4f", secondary: "#1b4332",
    accent: "#95d5b2",
    bg: "#f4faf6", cardBg: "#fff", textPrimary: "#1b4332", textSub: "#6a9e80",
    font: "'Noto Kufi Arabic', sans-serif",
    headerBg: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)",
    tag: "طبيعي 100% 🌱",
  },
  general: {
    label: "منتجات متنوعة", emoji: "📦",
    primary: "#1e5f8e", secondary: "#14406a",
    accent: "#64b5d9",
    bg: "#f4f8fc", cardBg: "#fff", textPrimary: "#0f2d4a", textSub: "#6a8fa8",
    font: "'Noto Kufi Arabic', sans-serif",
    headerBg: "linear-gradient(135deg, #0f2d4a 0%, #1e5f8e 50%, #3a8fc0 100%)",
    tag: "شحن سريع 🚀",
  },
};

const STORE_DATA = {
  restaurant: {
    name: "مطبخ أم نورة", desc: "أشهى الأكلات الكويتية المنزلية — طازجة يومياً",
    products: [
      { id: 1, name: "مجبوس دجاج", price: 4.5, emoji: "🍗", desc: "أرز بسمتي مع دجاج متبل" },
      { id: 2, name: "هريس لحم", price: 3.5, emoji: "🥘", desc: "هريس منزلي طازج" },
      { id: 3, name: "جريش", price: 3.0, emoji: "🍲", desc: "جريش بالسمن البلدي" },
      { id: 4, name: "مطبق", price: 2.5, emoji: "🥟", desc: "مطبق دجاج وخضار" },
    ],
  },
  fashion: {
    name: "ستايل العبايات", desc: "أرقى العبايات والملابس النسائية — كولكشن 2026",
    products: [
      { id: 1, name: "عباية كلاسيك", price: 25.0, emoji: "👘", desc: "عباية سوداء بتطريز ذهبي" },
      { id: 2, name: "عباية كازوال", price: 18.0, emoji: "🧥", desc: "كازوال يومي خفيف" },
      { id: 3, name: "شيلة فاخرة", price: 8.5, emoji: "🧣", desc: "شيفون ناعم ألوان متعددة" },
      { id: 4, name: "طقم رياضي", price: 15.0, emoji: "👚", desc: "كوتون مريح للبيت" },
    ],
  },
  sweets: {
    name: "حلويات لولو", desc: "كيك وحلويات محضّرة بالحب — طلبات مسبقة",
    products: [
      { id: 1, name: "كيكة الشوكولاتة", price: 12.0, emoji: "🍰", desc: "طبقات شوكولاتة بلجيكية" },
      { id: 2, name: "كب كيك (12 حبة)", price: 8.0, emoji: "🧁", desc: "بكريم وتزيين مخصص" },
      { id: 3, name: "لقيمات", price: 3.5, emoji: "🍡", desc: "لقيمات بالديبس كويتي أصيل" },
      { id: 4, name: "تشيز كيك", price: 10.0, emoji: "🍮", desc: "نيويورك ستايل بالتوت" },
    ],
  },
  beauty: {
    name: "عطور الأميرة", desc: "عطور فاخرة وإكسسوارات عربية أصيلة",
    products: [
      { id: 1, name: "عود ملكي", price: 35.0, emoji: "🪔", desc: "عود طبيعي برائحة مميزة" },
      { id: 2, name: "دهن عود", price: 20.0, emoji: "✨", desc: "دهن مركّز 12ml" },
      { id: 3, name: "بخور فاخر", price: 8.0, emoji: "💜", desc: "مزيج عربي أصيل" },
      { id: 4, name: "كريم الجسم", price: 15.0, emoji: "💎", desc: "ترطيب فاخر برائحة الورد" },
    ],
  },
  organic: {
    name: "أرض الطبيعة", desc: "منتجات عضوية طبيعية — صحتك أولويتنا",
    products: [
      { id: 1, name: "عسل سدر", price: 18.0, emoji: "🍯", desc: "عسل طبيعي 100% من اليمن" },
      { id: 2, name: "زيت حبة البركة", price: 7.5, emoji: "🌱", desc: "بارد العصر مضمون" },
      { id: 3, name: "تمر السكري", price: 6.0, emoji: "🌴", desc: "أجود أنواع التمر السعودي" },
      { id: 4, name: "خلطة أعشاب", price: 5.0, emoji: "🍃", desc: "خلطة تنحيف طبيعية" },
    ],
  },
  general: {
    name: "متجر الكويت", desc: "كل ما تحتاجه في مكان واحد — توصيل سريع",
    products: [
      { id: 1, name: "سماعات لاسلكية", price: 22.0, emoji: "🎧", desc: "بلوتوث 5.0 صوت نقي" },
      { id: 2, name: "كيس لاب توب", price: 9.5, emoji: "💼", desc: "ووتربروف 15.6 بوصة" },
      { id: 3, name: "شاحن سريع", price: 6.0, emoji: "⚡", desc: "65W USB-C متوافق" },
      { id: 4, name: "ساعة ذكية", price: 28.0, emoji: "⌚", desc: "متابعة الصحة واللياقة" },
    ],
  },
};

export default function ThemeShowcase() {
  const [activeCategory, setActiveCategory] = useState("restaurant");
  const [cart, setCart] = useState({});
  const [previewMode, setPreviewMode] = useState(false);

  const theme = THEMES[activeCategory];
  const store = STORE_DATA[activeCategory];

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = store.products.find(p => p.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const add = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) => setCart(c => {
    const n = { ...c };
    if (n[id] > 1) n[id]--;
    else delete n[id];
    return n;
  });

  const switchCategory = (cat) => {
    setActiveCategory(cat);
    setCart({});
  };

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "#f0f0f0",
      fontFamily: "'Noto Kufi Arabic', 'Cairo', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cat-btn { transition: all 0.2s; }
        .cat-btn:hover { transform: translateY(-2px); }
        .product-card { transition: all 0.25s; }
        .product-card:hover { transform: translateY(-3px); }
        .fade { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .qty-btn:hover { opacity: 0.85; }
      `}</style>

      {/* Top bar — category selector */}
      {!previewMode && (
        <div style={{
          background: "white", padding: "16px 20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 10, fontWeight: 600 }}>
            اختر الفئة — شوف كيف يتغير تصميم المتجر تلقائياً 👇
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(THEMES).map(([key, t]) => (
              <button key={key} className="cat-btn" onClick={() => switchCategory(key)} style={{
                padding: "8px 14px", borderRadius: 50,
                border: "2px solid",
                borderColor: activeCategory === key ? t.primary : "#e0e0e0",
                background: activeCategory === key ? t.primary : "white",
                color: activeCategory === key ? "white" : "#555",
                fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                cursor: "pointer",
              }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Store Page Preview */}
      <div className="fade" key={activeCategory} style={{
        maxWidth: previewMode ? "100%" : 480,
        margin: "0 auto",
        minHeight: "calc(100vh - 80px)",
        background: theme.bg,
        fontFamily: theme.font,
      }}>

        {/* Store Header */}
        <div style={{
          background: theme.headerBg,
          color: "white",
          padding: "40px 24px 32px",
          position: "relative", overflow: "hidden",
          textAlign: "center",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 54, marginBottom: 10 }}>{theme.emoji}</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>{store.name}</h1>
            <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 14 }}>{store.desc}</p>
            <span style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: 50, padding: "5px 14px",
              fontSize: 12, fontWeight: 700,
            }}>{theme.tag}</span>

            {totalItems > 0 && (
              <div style={{ marginTop: 16 }}>
                <button style={{
                  background: theme.accent, color: theme.textPrimary,
                  border: "none", borderRadius: 50, padding: "10px 24px",
                  fontFamily: "inherit", fontWeight: 800, fontSize: 14,
                  cursor: "pointer",
                }}>
                  🛒 السلة ({totalItems}) — {totalPrice.toFixed(3)} KWD
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div style={{ padding: "24px 16px" }}>
          <p style={{ fontSize: 12, color: theme.textSub, marginBottom: 16, fontWeight: 700 }}>
            📦 {store.products.length} منتجات متاحة
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {store.products.map(p => (
              <div key={p.id} className="product-card" style={{
                background: theme.cardBg,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
              }}>
                {/* Product color block */}
                <div style={{
                  height: 90,
                  background: `linear-gradient(135deg, ${theme.primary}22, ${theme.accent}44)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 42, position: "relative",
                }}>
                  {p.emoji}
                  {cart[p.id] && (
                    <div style={{
                      position: "absolute", top: 8, left: 8,
                      background: theme.primary, color: "white",
                      borderRadius: 50, width: 24, height: 24,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 12,
                    }}>{cart[p.id]}</div>
                  )}
                </div>

                <div style={{ padding: "12px 12px 14px" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: theme.textPrimary, marginBottom: 3 }}>
                    {p.name}
                  </h3>
                  <p style={{ fontSize: 11, color: theme.textSub, marginBottom: 10, lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 900, color: theme.primary, fontSize: 14 }}>
                      {p.price.toFixed(3)} KWD
                    </span>
                    {!cart[p.id] ? (
                      <button onClick={() => add(p.id)} style={{
                        background: theme.primary, color: "white",
                        border: "none", borderRadius: 50,
                        width: 30, height: 30, fontSize: 20,
                        cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>+</button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button className="qty-btn" onClick={() => remove(p.id)} style={{
                          background: `${theme.accent}88`, color: theme.textPrimary,
                          border: "none", borderRadius: 50,
                          width: 26, height: 26, fontSize: 16,
                          cursor: "pointer", transition: "all 0.2s",
                        }}>−</button>
                        <span style={{ fontWeight: 800, color: theme.textPrimary, minWidth: 18, textAlign: "center", fontSize: 14 }}>
                          {cart[p.id]}
                        </span>
                        <button onClick={() => add(p.id)} style={{
                          background: theme.primary, color: "white",
                          border: "none", borderRadius: 50,
                          width: 26, height: 26, fontSize: 16,
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

        {/* Footer */}
        <div style={{
          textAlign: "center", padding: "20px 16px 32px",
          color: theme.textSub, fontSize: 12,
        }}>
          powered by <strong style={{ color: theme.primary }}>متجري</strong> 🛍️
        </div>
      </div>
    </div>
  );
}
