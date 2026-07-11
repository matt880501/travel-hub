"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMG = "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg";

const GALLERY: { url: string; caption: string }[] = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1783683328/%E5%98%89%E6%98%8E%E6%B9%961_bkpcs0.jpg", caption: "嘉明湖" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693005/%E4%B8%89%E5%8F%89%E5%B1%B1_uhyola.jpg", caption: "三叉山彩霞" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693001/%E5%98%89%E6%98%8E%E6%B9%96%E7%95%94_wlkcv1.jpg", caption: "嘉明湖畔" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693000/%E5%98%89%E6%98%8E%E6%B9%96%E5%A4%A7%E6%99%AF_bu9ntf.jpg", caption: "嘉明湖全景" },
];

const ROUTE = [
  { day: "DAY 1", text: "林道登山口 → 向陽山屋 → 向陽山 → 三叉路 → 嘉明湖避難山屋" },
  { day: "DAY 2", text: "山屋出發 → 三叉山 → 嘉明湖叉路 → 嘉明湖 → 避難山屋 → 向陽山屋 → 登山口" },
];

const STATS = [
  { label: "Total Distance", value: "31.42 km" },
  { label: "Total Elevation Gain", value: "2,162 m" },
  { label: "Highest Point", value: "3,603 m" },
  { label: "Moving Time", value: "10–12 hr" },
];

function GalleryPhoto({ photo, isMobile, isTouch }: { photo: { url: string; caption: string }; isMobile: boolean; isTouch: boolean }) {
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseEnter={() => { if (!isTouch) setActive(true); }}
      onMouseLeave={() => { if (!isTouch) setActive(false); }}
      onClick={() => { if (isTouch) setActive(o => !o); }}
      style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: isMobile ? 10 : 12, overflow: "hidden", cursor: isTouch ? "pointer" : "default" }}
    >
      <img src={photo.url} alt={photo.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: (!isTouch && active) ? "scale(1.06)" : "scale(1)" }} />
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 45%)", display: "flex", alignItems: "flex-end", padding: isMobile ? 10 : 14 }}
          >
            <div style={{ fontSize: isMobile ? 10 : 12, color: "#f0ece4", fontFamily: "Georgia, serif", fontStyle: "italic" }}>{photo.caption}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JiamingLakePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setIsTouch(navigator.maxTouchPoints > 0);
  }, []);

  const sectionLabel: React.CSSProperties = { fontSize: 11, color: "#c4a882", letterSpacing: "0.18em", fontWeight: 600, marginBottom: 14 };

  return (
    <>
      {/* Back link */}
      <div style={{ padding: isMobile ? "14px 16px 0" : "20px 20px 0" }}>
        <a href="/mountains" style={{ fontSize: 12, color: "#777", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
          ← Back to Peaks
        </a>
      </div>

      {/* Hero */}
      <div style={{ position: "relative", height: isMobile ? 320 : 420, overflow: "hidden", margin: isMobile ? "12px 16px 0" : "16px 20px 0", borderRadius: 16 }}>
        <img src={HERO_IMG} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 55%)" }} />
        <div style={{ position: "absolute", bottom: isMobile ? 20 : 28, left: isMobile ? 18 : 28 }}>
          <div style={{ fontSize: isMobile ? 30 : 44, fontWeight: 400, color: "#f0ece4", lineHeight: 1.05, fontFamily: "Georgia, serif" }}>嘉明湖</div>
          <div style={{ fontSize: isMobile ? 13 : 15, color: "rgba(240,236,228,0.7)", marginTop: 6 }}>Jiaming Lake</div>
        </div>
      </div>

      {/* Stat row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 20 : 36, padding: isMobile ? "18px 16px" : "24px 20px" }}>
        {[
          { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><path d="M3 20L9 8l4 6 3-4 5 10H3z" /></svg>, value: "3,603 m", label: "Elevation" },
          { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>, value: "2 Days", label: "Duration" },
          { icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 9h18" /></svg>, value: "2023.6", label: "Date" },
        ].map(({ icon, value, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {icon}
            <div>
              <div style={{ fontSize: isMobile ? 15 : 17, color: "#f0ece4", fontFamily: "Georgia, serif" }}>{value}</div>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.08em" }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div style={{ padding: isMobile ? "8px 16px 24px" : "8px 20px 32px" }}>
        <div style={sectionLabel}>OVERVIEW</div>
        <p style={{ fontSize: isMobile ? 14 : 15, color: "rgba(232,228,220,0.85)", lineHeight: 1.8, maxWidth: 680 }}>
          嘉明湖，天使的眼淚。但我更喜歡月亮的鏡子這名字。
          <br /><br />
          何等運氣遇上日出大景，我在湖邊一坐就是兩小時，捨不得走。
        </p>
      </div>

      {/* Route / Itinerary */}
      <div style={{ padding: isMobile ? "0 16px 24px" : "0 20px 32px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 260px", gap: isMobile ? 20 : 32 }}>
        <div>
          <div style={sectionLabel}>ROUTE / ITINERARY</div>
          <div style={{ position: "relative", paddingLeft: 20 }}>
            <div style={{ position: "absolute", left: 3, top: 6, bottom: 6, width: 1, background: "rgba(196,168,130,0.25)" }} />
            {ROUTE.map(r => (
              <div key={r.day} style={{ position: "relative", marginBottom: 20 }}>
                <div style={{ position: "absolute", left: -20, top: 4, width: 7, height: 7, borderRadius: "50%", background: "#c4a882" }} />
                <div style={{ fontSize: 10, color: "#c4a882", letterSpacing: "0.12em", marginBottom: 6 }}>{r.day}</div>
                <div style={{ fontSize: isMobile ? 13 : 14, color: "rgba(232,228,220,0.85)", lineHeight: 1.6 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#1c1c1c", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", padding: isMobile ? "16px 18px" : "18px 20px", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: isMobile ? 16 : 18, alignContent: "flex-start" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ minWidth: isMobile ? "40%" : "100%" }}>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.05em", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: isMobile ? 15 : 18, color: "#f0ece4", fontFamily: "Georgia, serif" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div style={{ padding: isMobile ? "0 16px 32px" : "0 20px 40px" }}>
        <div style={sectionLabel}>GALLERY</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 8 : 10 }}>
          {GALLERY.map((p, i) => (
            <GalleryPhoto key={i} photo={p} isMobile={isMobile} isTouch={isTouch} />
          ))}
        </div>
      </div>
    </>
  );
}
