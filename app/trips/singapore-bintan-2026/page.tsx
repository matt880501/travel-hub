"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { shareOrCopyLink } from "../../shareCard";

type Category = "food" | "transit" | "flight" | "stay" | "sight" | "shop" | "onsen" | "cafe";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: string; date: string; location: string; items: Item[]; };

const ACCENT = "#3d7a7a";
const BG = "#f0f2f0";
const TEXT = "#1e2a2a";
const MUTED = "#7a9090";

const ITINERARY: Day[] = [
  {
    day: "DAY 1", date: "Jul 23, Thu", location: "Singapore",
    items: [
      { time: "08:05", text: "Depart Taipei — CI 0753", cat: "flight" },
      { time: "12:35", text: "Arrive Singapore", cat: "flight" },
      { time: "15:00", text: "Check-in · Mercure ICON Singapore City Centre", cat: "stay" },
      { time: "16:00", text: "魚尾獅公園", mapUrl: "https://maps.google.com/?q=Merlion+Park+Singapore", note: "肯定要來當觀光客。", cat: "sight" },
      { time: "17:30", text: "Marina Bay Sands", mapUrl: "https://maps.google.com/?q=Marina+Bay+Sands+Singapore", cat: "sight" },
      { time: "19:00", text: "Song Fa Bak Kut Teh", mapUrl: "https://www.google.com/maps/place/Song+Fa+Bak+Kut+Teh+(11+New+Bridge+Road)/@1.2890153,103.845118,17z/data=!3m2!4b1!5s0x31da190aaf3074cf:0x9b21d7b61861b222!4m6!3m5!1s0x31da190a80c3583f:0xc7bd17dac49c70f5!8m2!3d1.2890099!4d103.8476983!16s%2Fg%2F1tf5mr7_?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D", note: "肉骨茶", cat: "food" },
      { time: "20:30", text: "濱海灣花園 — OCBC Skyway", mapUrl: "https://maps.google.com/?q=Gardens+by+the+Bay+Singapore", cat: "sight" },
    ]
  },
  {
    day: "DAY 2", date: "Jul 24, Fri", location: "Singapore → Bintan",
    items: [
      { time: "11:00", text: "Check-out · Mercure ICON", cat: "stay" },
      { time: "12:00", text: "星耀樟宜", mapUrl: "https://www.jewelchangiairport.com/en/attractions/rain-vortex.html", cat: "sight" },
      { time: "14:00", text: "Ferry · Singapore → Bintan (Business Class)", mapUrl: "https://maps.google.com/?q=Tanah+Merah+Ferry+Terminal+Singapore", note: "新加坡88，一天剛剛好", cat: "transit" },
      { time: "16:00", text: "Check-in · Club Med Bintan Island", mapUrl: "https://www.clubmed.com.tw/r/印尼民丹島/y?departure_city=TPE", cat: "stay" },
    ]
  },
  {
    day: "DAY 3–6", date: "Jul 25–27", location: "Bintan Island",
    items: [
      { time: "—", text: "Club Med all-inclusive — beach, pool, activities", mapUrl: "https://www.clubmed.com.tw/r/印尼民丹島/y?departure_city=TPE", note: "爽玩", cat: "sight" },
    ]
  },
  {
    day: "DAY 6", date: "Jul 28, Tue", location: "Bintan → Taipei",
    items: [
      { time: "08:35", text: "Ferry · Bintan → Singapore (Business Class)", note: "Bintan掰掰", cat: "transit" },
      { time: "13:45", text: "Depart Singapore — CI 0754", cat: "flight" },
      { time: "18:35", text: "Arrive Taipei", cat: "flight" },
    ]
  },
];

const METADATA = [
  { label: "Temperature", value: "28°C — 33°C" },
  { label: "Currency", value: "SGD / IDR" },
  { label: "Mood", value: "Urban / Coastal / Easy" },
  { label: "Season", value: "Summer, Rainy Season" },
];

function CatIcon({ cat }: { cat?: Category }) {
  const p = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none" as const, stroke: MUTED, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: { flexShrink: 0, opacity: 0.7 } };
  if (!cat) return <span style={{ width: 13 }} />;
  if (cat === "food") return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="21" y1="15" x2="21" y2="22"/><path d="M21 2a5 5 0 0 1 0 10V2z"/></svg>;
  if (cat === "transit") return <svg {...p}><rect x="4" y="3" width="16" height="15" rx="3"/><line x1="4" y1="11" x2="20" y2="11"/><line x1="12" y1="3" x2="12" y2="11"/><path d="M8 19l-1 3M16 19l1 3"/></svg>;
  if (cat === "flight") return <svg {...p}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
  if (cat === "stay") return <svg {...p}><path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
  if (cat === "sight") return <svg {...p}><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
  if (cat === "shop") return <svg {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
  if (cat === "onsen") return <svg {...p}><path d="M8 14s1.5-2 4-2 4 2 4 2"/><path d="M12 2v4M9.5 4.5C9.5 6.5 12 7 12 9M14.5 4.5C14.5 6.5 12 7 12 9"/><path d="M5 18s1.5-2 7-2 7 2 7 2"/><path d="M4 22s2-2 8-2 8 2 8 2"/></svg>;
  if (cat === "cafe") return <svg {...p}><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/></svg>;
  return <span style={{ width: 13 }} />;
}

function TimelineItem({ item, index }: { item: Item; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <div
        onClick={() => item.note && setOpen(o => !o)}
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(30,42,42,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
      >
        <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.08em", minWidth: 40, fontVariantNumeric: "tabular-nums" }}>{item.time}</span>
        <CatIcon cat={item.cat} />
        <div style={{ flex: 1 }}>
          {item.mapUrl ? (
            <a href={item.mapUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontSize: 14, color: TEXT, textDecoration: "none", letterSpacing: "0.01em" }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = TEXT)}
            >
              {item.text}
              <span style={{ fontSize: 10, color: MUTED, marginLeft: 4, opacity: 0.5 }}>↗</span>
            </a>
          ) : (
            <span style={{ fontSize: 14, color: TEXT, letterSpacing: "0.01em" }}>{item.text}</span>
          )}
        </div>
        {item.note && (
          <span style={{ fontSize: 10, color: MUTED, opacity: 0.5, paddingTop: 2 }}>{open ? "−" : "+"}</span>
        )}
      </div>
      <AnimatePresence>
        {open && item.note && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingLeft: 85, paddingBottom: 14, paddingTop: 4 }}>
              <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{item.note}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Countdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState({ days: 0, hrs: 0, min: 0 });
  useState(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff % 86400000) / 3600000),
        min: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  });
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
      {([["days", time.days], ["hrs", time.hrs], ["min", time.min]] as [string, number][]).map(([label, val]) => (
        <div key={label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, fontWeight: 300, color: "#fff", lineHeight: 1, fontFamily: "Georgia, serif" }}>
            {String(val).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginTop: 4 }}>{label.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}

const HERO_URL = "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778602513/Bin1_pjzspe.jpg";

export default function SingaporeBintan() {
  const [isMobile, setIsMobile] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // No gallery yet (trip hasn't happened), so just share the hero photo directly.
  async function handleShare() {
    await shareOrCopyLink({
      title: "Singapore & Bintan — Matt Travels",
      text: "Summer 2026, Jul 23–28",
      url: window.location.href,
      fileBlob: null,
      filename: "singapore-bintan.jpg",
      fallbackImgUrl: HERO_URL,
      onFallbackMessage: msg => { setShareMsg(msg); setTimeout(() => setShareMsg(null), 2000); },
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "-apple-system, 'Helvetica Neue', sans-serif", color: TEXT }}>
      {shareMsg && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(20,20,20,0.92)", color: "#f0ece4", padding: "8px 16px", borderRadius: 20, fontSize: 12, zIndex: 999, border: "1px solid rgba(255,255,255,0.1)" }}>
          {shareMsg}
        </div>
      )}

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "16px 20px" : "18px 40px", background: "rgba(240,242,240,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(30,42,42,0.08)` }}>
        {isMobile ? (
          <a href="/" style={{ fontSize: 10, letterSpacing: "0.15em", color: MUTED, textDecoration: "none" }}>← SG & BINTAN</a>
        ) : (
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
            <span style={{ color: TEXT }}>SINGAPORE & BINTAN</span>
          </div>
        )}
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>JUL 23 – 28, 2026</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", height: isMobile ? "auto" : "100vh", overflow: "hidden", background: "#0d1e1e" }}>
        <motion.div style={isMobile ? { y: 0 } : { position: "absolute", top: "-10%", left: 0, right: 0, height: "120%", y: heroY }}>
          <img
            src={HERO_URL}
            style={{ width: "100%", height: isMobile ? "auto" : "100%", objectFit: isMobile ? undefined : "cover", objectPosition: "center 40%", display: "block" }}
          />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.8) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />
        <button
          onClick={handleShare}
          aria-label="Share"
          style={{ position: "absolute", top: isMobile ? 52 : 60, right: isMobile ? 10 : 40, zIndex: 2, width: isMobile ? 26 : 34, height: isMobile ? 26 : 34, borderRadius: "50%", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width={isMobile ? 12 : 15} height={isMobile ? 12 : 15} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="15" rx="4" /><circle cx="12" cy="13.5" r="4.2" /><path d="M8 6l1.5-2.5h5L16 6" /><circle cx="17.5" cy="9.5" r="0.8" fill="#fff" stroke="none" />
          </svg>
        </button>

        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 20px 48px" : "0 40px 60px 40px", paddingRight: isMobile ? "20px" : "80px", opacity: heroOpacity, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", gap: isMobile ? 20 : 0 }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ fontSize: isMobile ? "clamp(40px, 12vw, 64px)" : "clamp(48px, 8vw, 100px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 20 }}
            >
              Singapore<br />&amp; Bintan
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 24, flexWrap: "wrap" }}
            >
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Summer 2026</span>
              <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>6 Days</span>
              {!isMobile && <><span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} /><span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Singapore · Indonesia</span></>}
            </motion.div>
          </div>
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Countdown targetDate={new Date("2026-07-23")} />
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: "absolute", right: 24, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", writingMode: "vertical-rl" }}>SCROLL</div>
            <div style={{ width: 0.5, height: 40, background: "rgba(255,255,255,0.2)" }} />
          </motion.div>
        )}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "60px 20px" : "80px 40px" }}>

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>ITINERARY</span>
            <div style={{ flex: 1, height: 0.5, background: `rgba(61,122,122,0.2)` }} />
          </div>

          {ITINERARY.map((day, di) => (
            <motion.div
              key={di}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: di * 0.05 }}
              style={{ marginBottom: 52 }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.2em" }}>{day.day}</span>
                <span style={{ fontSize: 18, color: TEXT, fontFamily: "Georgia, serif", fontWeight: 300 }}>{day.date}</span>
              </div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.1em", marginBottom: 16 }}>{day.location}</div>
              <div>
                {day.items.map((item, ii) => (
                  <TimelineItem key={ii} item={item} index={ii} />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Metadata footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ borderTop: `0.5px solid rgba(30,42,42,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: "#7a9090", letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "28°C — 33°C", sub: "Hot and humid" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Urban / Coastal / Easy", sub: "City meets island" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "Summer", sub: "Rainy Season" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "WITH", value: "Middle School Friends", sub: "" },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ color: "#7a9090", marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontSize: 9, color: "#7a9090", letterSpacing: "0.2em", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 14, color: "#1e2a2a", marginBottom: 3 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "#7a9090" }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
