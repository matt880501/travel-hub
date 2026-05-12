"use client";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Item = { time: string; text: string; note?: string; mapUrl?: string; };
type Day = { day: string; date: string; location: string; items: Item[]; };

const ACCENT = "#3d7a7a";
const BG = "#f0f2f0";
const TEXT = "#1e2a2a";
const MUTED = "#7a9090";

const ITINERARY: Day[] = [
  {
    day: "DAY 1", date: "Jul 23, Thu", location: "Singapore",
    items: [
      { time: "08:05", text: "Depart Taipei — CI 0753" },
      { time: "12:35", text: "Arrive Singapore" },
      { time: "15:00", text: "Check-in · Mercure ICON Singapore City Centre" },
      { time: "16:00", text: "Merlion Park", mapUrl: "https://maps.google.com/?q=Merlion+Park+Singapore" },
      { time: "17:30", text: "Marina Bay Sands", mapUrl: "https://maps.google.com/?q=Marina+Bay+Sands+Singapore" },
      { time: "19:00", text: "Bak Kut Teh dinner" },
      { time: "20:30", text: "Gardens by the Bay — OCBC Skyway", mapUrl: "https://maps.google.com/?q=Gardens+by+the+Bay+Singapore" },
    ]
  },
  {
    day: "DAY 2", date: "Jul 24, Fri", location: "Singapore → Bintan",
    items: [
      { time: "11:00", text: "Check-out · Mercure ICON" },
      { time: "12:00", text: "Jewel Changi Airport", mapUrl: "https://www.jewelchangiairport.com/en/attractions/rain-vortex.html" },
      { time: "14:00", text: "Ferry · Singapore → Bintan (Business Class)", mapUrl: "https://maps.google.com/?q=Tanah+Merah+Ferry+Terminal+Singapore" },
      { time: "16:00", text: "Check-in · Club Med Bintan Island", mapUrl: "https://www.clubmed.com.tw/r/印尼民丹島/y?departure_city=TPE" },
    ]
  },
  {
    day: "DAY 3–6", date: "Jul 25–27", location: "Bintan Island",
    items: [
      { time: "—", text: "Club Med all-inclusive — beach, pool, activities", mapUrl: "https://www.clubmed.com.tw/r/印尼民丹島/y?departure_city=TPE" },
    ]
  },
  {
    day: "DAY 6", date: "Jul 28, Tue", location: "Bintan → Taipei",
    items: [
      { time: "08:35", text: "Ferry · Bintan → Singapore (Business Class)" },
      { time: "13:45", text: "Depart Singapore — CI 0754" },
      { time: "18:35", text: "Arrive Taipei" },
    ]
  },
];

const METADATA = [
  { label: "Temperature", value: "28°C — 33°C" },
  { label: "Currency", value: "SGD / IDR" },
  { label: "Mood", value: "Urban / Coastal / Easy" },
  { label: "Season", value: "Summer, Rainy Season" },
];

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
        style={{ display: "flex", gap: 28, padding: "14px 0", borderBottom: `0.5px solid rgba(30,42,42,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "flex-start" }}
      >
        <span style={{ fontSize: 11, color: MUTED, letterSpacing: "0.08em", minWidth: 40, paddingTop: 1, fontVariantNumeric: "tabular-nums" }}>{item.time}</span>
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
            <div style={{ paddingLeft: 68, paddingBottom: 14, paddingTop: 4 }}>
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

export default function SingaporeBintan() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "-apple-system, 'Helvetica Neue', sans-serif", color: TEXT }}>

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", background: "rgba(240,242,240,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(30,42,42,0.08)` }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
          <a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a>
          <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
          <a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a>
          <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
          <span style={{ color: TEXT }}>SINGAPORE & BINTAN</span>
        </div>
        <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>JUL 23 – 28, 2026</div>
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <motion.div
          style={{ position: "absolute", inset: "-10% 0", backgroundImage: "url(https://res.cloudinary.com/dydhvvubl/image/upload/v1778602513/Bin1_pjzspe.jpg)", backgroundSize: "cover", backgroundPosition: "center 40%", y: heroY }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.8) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />

        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 60px", opacity: heroOpacity, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.3em", marginBottom: 20 }}
            >
              UPCOMING JOURNEY
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ fontSize: "clamp(48px, 8vw, 100px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 24 }}
            >
              Singapore<br />&amp; Bintan
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: 24 }}
            >
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Summer 2026</span>
              <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>6 Days</span>
              <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Singapore · Indonesia</span>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Countdown targetDate={new Date("2026-07-23")} />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: "absolute", right: 40, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", writingMode: "vertical-rl" }}>SCROLL</div>
          <div style={{ width: 0.5, height: 40, background: "rgba(255,255,255,0.2)" }} />
        </motion.div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "80px 40px" }}>

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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "28°C — 33°C", sub: "Hot and humid" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label: "CURRENCY", value: "SGD / IDR", sub: "Singapore · Indonesia" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Urban / Coastal / Easy", sub: "City meets island" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "Summer", sub: "Rainy Season" },
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
