"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Category = "food" | "transit" | "stay" | "sight" | "shop" | "onsen" | "cafe";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: string; date: string; location: string; items: Item[]; };

const ACCENT = "#5c7a5c";
const BG = "#eff1ed";
const TEXT = "#1e2b1e";
const MUTED = "#7d9680";

const ITINERARY: Day[] = [
  {
    day: "DAY 1", date: "Sep 17, Thu", location: "Depart Taipei",
    items: [
      { time: "23:35", text: "Depart Taipei — CI 0032", cat: "transit" },
      { time: "19:20", text: "Arrive Vancouver — YVR", cat: "transit" },
      { time: "22:15", text: "Vancouver → Calgary — CI 9314", cat: "transit" },
    ]
  },
  {
    day: "DAY 2", date: "Sep 18, Fri", location: "Arrive Calgary",
    items: [
      { time: "00:44", text: "Arrive Calgary — YYC", cat: "transit" },
    ]
  },
  {
    day: "DAY 2 – 11", date: "Sep 18 – Sep 27", location: "Canadian Rockies",
    items: [
      { time: "—", text: "行程規劃中", cat: "sight" },
    ]
  },
  {
    day: "DAY 11", date: "Sep 27, Sun", location: "Depart Calgary",
    items: [
      { time: "23:35", text: "Calgary → Vancouver — CI 9323", cat: "transit" },
    ]
  },
  {
    day: "DAY 12", date: "Sep 28, Mon", location: "Vancouver",
    items: [
      { time: "00:15", text: "Arrive Vancouver — YVR", cat: "transit" },
      { time: "02:00", text: "Depart Vancouver — CI 0031", cat: "transit" },
    ]
  },
  {
    day: "DAY 13", date: "Sep 29, Tue", location: "Arrive Taipei",
    items: [
      { time: "05:30", text: "Arrive Taipei", cat: "transit" },
    ]
  },
];

function CatIcon({ cat }: { cat?: Category }) {
  const p = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none" as const, stroke: MUTED, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: { flexShrink: 0, opacity: 0.7 } };
  if (!cat) return <span style={{ width: 13 }} />;
  if (cat === "food") return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="21" y1="15" x2="21" y2="22"/><path d="M21 2a5 5 0 0 1 0 10V2z"/></svg>;
  if (cat === "transit") return <svg {...p}><rect x="4" y="3" width="16" height="15" rx="3"/><line x1="4" y1="11" x2="20" y2="11"/><line x1="12" y1="3" x2="12" y2="11"/><path d="M8 19l-1 3M16 19l1 3"/></svg>;
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
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(30,43,30,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
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
  useEffect(() => {
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
  }, [targetDate]);
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

export default function Canada() {
  const [isMobile, setIsMobile] = useState(false);
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

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "-apple-system, 'Helvetica Neue', sans-serif", color: TEXT }}>

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "16px 20px" : "18px 40px", background: "rgba(239,241,237,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(30,43,30,0.08)` }}>
        {isMobile ? (
          <a href="/" style={{ fontSize: 10, letterSpacing: "0.15em", color: MUTED, textDecoration: "none" }}>← CANADA</a>
        ) : (
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
            <span style={{ color: TEXT }}>CANADA</span>
          </div>
        )}
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>SEP 17 – 29, 2026</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", overflow: "hidden", backgroundColor: "#0a150a" }}>
        <motion.div style={{ y: heroY }}>
          <img
            src="https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778680358/CA1_c2rier.jpg"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />

        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 20px 48px" : "0 40px 60px 40px", paddingRight: isMobile ? "20px" : "80px", opacity: heroOpacity, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ fontSize: isMobile ? "clamp(52px, 14vw, 80px)" : "clamp(64px, 9vw, 120px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 24 }}
            >
              Canada
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 24, flexWrap: "wrap" }}
            >
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Autumn 2026</span>
              <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>13 Days</span>
              {!isMobile && (
                <>
                  <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Rocky Mountains · Vancouver</span>
                </>
              )}
            </motion.div>
          </div>
          {!isMobile && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Countdown targetDate={new Date("2026-09-17")} />
            </motion.div>
          )}
        </motion.div>

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
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>ITINERARY</span>
            <div style={{ flex: 1, height: 0.5, background: `rgba(92,122,92,0.2)` }} />
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
          style={{ borderTop: `0.5px solid rgba(30,43,30,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "5°C — 18°C", sub: "Mountain mornings cold" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label: "CURRENCY", value: "CAD", sub: "Canadian Dollar" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Wild / Vast / Alpine", sub: "Big sky country" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "Early Autumn", sub: "Larch Peak Season" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "WITH", value: "Family", sub: "Road trip across the Rockies" },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ color: MUTED, marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontSize: 9, color: MUTED, letterSpacing: "0.2em", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 14, color: TEXT, marginBottom: 3 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
