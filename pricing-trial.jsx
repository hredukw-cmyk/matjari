import { useState } from "react";

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");

  const monthlyPrice = 4.9;
  const yearlyPrice = (monthlyPrice * 12 * 0.8).toFixed(1);

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: "'Noto Kufi Arabic','Cairo',sans-serif",
      padding: "60px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@300;400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fade { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .btn-main:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .btn-main { transition: all 0.2s; }
        .feature-row:last-child { border-bottom: none !important; }
      `}</style>

      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }} className="fade">
          <div style={{
            display: "inline-block",
            background: "#fbbf2415", border: "1px solid #fbbf2430",
            borderRadius: 50, padding: "6px 18px",
            color: "#fbbf24", fontSize: 12, fontWeight: 700, marginBottom: 20,
          }}>
            🎁 جرّب مجاناً 14 يوم — بدون بطاقة بنكية
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 900, color: "white", lineHeight: 1.25, marginBottom: 14 }}>
            متجرك الكامل<br />
            <span style={{ color: "#fbbf24" }}>من أول يوم</span>
          </h1>

          <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8 }}>
            جرّب كل شيء 14 يوم بدون قيود —<br />
            بعدها اشترك أو وقّف متى ما تبي
          </p>
        </div>

        {/* Billing Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <div style={{ background: "#141414", border: "1px solid #1f1f1f", borderRadius: 50, padding: 4, display: "flex", gap: 4 }}>
            {[{ k: "monthly", l: "شهري" }, { k: "yearly", l: "سنوي — خصم 20% 🎁" }].map(b => (
              <button key={b.k} onClick={() => setBilling(b.k)} style={{
                padding: "9px 20px", borderRadius: 50,
                border: "none", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                cursor: "pointer",
                background: billing === b.k ? "#fbbf24" : "transparent",
                color: billing === b.k ? "#0a0a0a" : "#555",
                transition: "all 0.2s",
              }}>{b.l}</button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="fade" style={{
          background: "linear-gradient(145deg, #141400, #1f1a00)",
          border: "1px solid #fbbf2430",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(251,191,36,0.12)",
        }}>

          {/* Top */}
          <div style={{
            background: "linear-gradient(135deg, #fbbf2410, #f59e0b08)",
            padding: "32px 32px 28px",
            borderBottom: "1px solid #fbbf2420",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, color: "#fbbf24", fontWeight: 700, marginBottom: 6 }}>باقة PRO</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: "white" }}>
                  {billing === "yearly" ? yearlyPrice : monthlyPrice}
                  <span style={{ fontSize: 16, color: "#555", fontWeight: 600, marginRight: 6 }}>
                    KWD / {billing === "yearly" ? "سنة" : "شهر"}
                  </span>
                </div>
                {billing === "yearly" && (
                  <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, marginTop: 6 }}>
                    ✅ وفّرت {(monthlyPrice * 12 * 0.2).toFixed(1)} KWD سنوياً
                  </div>
                )}
              </div>
              <div style={{
                background: "#fbbf2420", borderRadius: 16, padding: "12px 16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 28 }}>⭐</div>
                <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 800, marginTop: 4 }}>PRO</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div style={{ padding: "8px 32px" }}>
            {[
              { icon: "📦", text: "منتجات وطلبات غير محدودة" },
              { icon: "🗂️", text: "تصنيف المنتجات لأقسام" },
              { icon: "✅", text: "تتبع حالة كل طلب" },
              { icon: "📊", text: "تقارير وإحصائيات" },
              { icon: "🔔", text: "إشعارات تلقائية للزبون" },
              { icon: "🎨", text: "6 ثيمات حسب الفئة" },
              { icon: "🚫", text: "إزالة branding متجري" },
              { icon: "💬", text: "دعم فني أولوية" },
            ].map((f, i) => (
              <div key={i} className="feature-row" style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 0",
                borderBottom: "1px solid #1a1500",
              }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span>
                <span style={{ color: "#ccc", fontSize: 14, fontWeight: 600 }}>{f.text}</span>
                <span style={{ marginRight: "auto", color: "#fbbf24", fontSize: 14 }}>✓</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ padding: "28px 32px" }}>
            <button className="btn-main" style={{
              width: "100%",
              background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
              border: "none", borderRadius: 16,
              padding: "17px", fontSize: 17, fontWeight: 900,
              color: "#0a0a0a", cursor: "pointer", fontFamily: "inherit",
            }}>
              ابدأ تجربتك المجانية 14 يوم ←
            </button>
            <p style={{ textAlign: "center", color: "#444", fontSize: 12, marginTop: 14 }}>
              بدون بطاقة بنكية · ألغِ في أي وقت · لا عمولات على الطلبات
            </p>
          </div>
        </div>

        {/* Trial Timeline */}
        <div style={{
          marginTop: 40,
          background: "#141414", border: "1px solid #1f1f1f",
          borderRadius: 20, padding: "28px",
        }}>
          <h3 style={{ color: "white", fontWeight: 800, fontSize: 15, marginBottom: 24, textAlign: "center" }}>
            📅 إيه اللي يصير بعد التسجيل؟
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { day: "اليوم 1", title: "تسجيل فوري", desc: "متجرك شغّال وكل الـ Pro مفتوح", color: "#22c55e", active: true },
              { day: "يوم 7", title: "تذكير بالمنتصف", desc: "نبعتلك رسالة تذكير بإن التجربة في منتصفها", color: "#fbbf24", active: false },
              { day: "يوم 13", title: "تنبيه أخير", desc: "يوم قبل الانتهاء — اشترك وما تخسر شيء", color: "#f97316", active: false },
              { day: "يوم 14", title: "اشترك أو تقيّد", desc: "إما تدفع وتكمل Pro، أو تتحول للنسخة المحدودة", color: "#ef4444", active: false },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 50,
                    background: `${step.color}20`, border: `2px solid ${step.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: step.color, flexShrink: 0,
                  }}>{i + 1}</div>
                  {i < 3 && <div style={{ width: 2, flex: 1, background: "#1f1f1f", minHeight: 28, margin: "4px 0" }} />}
                </div>
                <div style={{ paddingBottom: i < 3 ? 20 : 0 }}>
                  <div style={{ color: step.color, fontSize: 11, fontWeight: 800, marginBottom: 2 }}>{step.day}</div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{step.title}</div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ color: "#333", fontSize: 13 }}>
            عندك سؤال؟{" "}
            <span style={{ color: "#fbbf24", fontWeight: 700, cursor: "pointer" }}>
              تواصل معنا على واتساب ←
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
