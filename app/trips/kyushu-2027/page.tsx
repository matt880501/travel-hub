"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { shareOrCopyLink } from "../../shareCard";

type Category = "food" | "transit" | "flight" | "stay" | "sight" | "shop" | "onsen" | "cafe";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: string; date: string; location: string; items: Item[]; };

const ACCENT = "#8a9076";
const BG = "#f0efe8";
const TEXT = "#2b2e26";
const MUTED = "#9c9c85";

const ITINERARY: Day[] = [
  {
    day: "DAY 1", date: "Feb 3, Wed", location: "熊本 → 阿蘇",
    items: [
      { time: "07:30", text: "Depart Taipei — JX846", cat: "flight" },
      { time: "10:35", text: "Arrive Kumamoto — KMJ", cat: "flight" },
      { time: "11:00", text: "熊本機場取車", mapUrl: "https://www.google.com/maps/search/Kumamoto+Airport", cat: "transit" },
      { time: "12:00", text: "熊本城", mapUrl: "https://www.google.com/maps/search/Kumamoto+Castle", cat: "sight" },
      { time: "13:30", text: "熊本午餐", mapUrl: "https://www.google.com/maps/search/熊本市+午餐", cat: "food" },
      { time: "15:00", text: "前往阿蘇", mapUrl: "https://www.google.com/maps/search/阿蘇", cat: "transit" },
      { time: "16:30", text: "阿蘇神社／門前町", mapUrl: "https://www.google.com/maps/search/阿蘇神社", note: "視時間彈性安排", cat: "sight" },
      { time: "17:30", text: "Check-in · Origami Experience", mapUrl: "https://origami-experience.com/", note: "已訂，阿蘇三晚", cat: "stay" },
    ]
  },
  {
    day: "DAY 2", date: "Feb 4, Thu", location: "高千穗一日遊",
    items: [
      { time: "09:00", text: "阿蘇 → 高千穗", mapUrl: "https://www.google.com/maps/search/高千穗", cat: "transit" },
      { time: "10:30", text: "高千穗峽", mapUrl: "https://www.google.com/maps/search/Takachiho+Gorge", cat: "sight" },
      { time: "11:30", text: "真名井瀑布", mapUrl: "https://www.google.com/maps/search/真名井の滝", cat: "sight" },
      { time: "13:00", text: "高千穗神社", mapUrl: "https://www.google.com/maps/search/高千穗神社", cat: "sight" },
      { time: "14:00", text: "高千穗峽划船", mapUrl: "https://www.google.com/maps/search/高千穗峽+貸しボート", note: "視當日開放狀況", cat: "sight" },
      { time: "16:00", text: "返回阿蘇", cat: "transit" },
    ]
  },
  {
    day: "DAY 3", date: "Feb 5, Fri", location: "阿蘇一日遊",
    items: [
      { time: "09:00", text: "草千里", mapUrl: "https://www.google.com/maps/search/草千里ヶ浜", cat: "sight" },
      { time: "10:30", text: "阿蘇火山口", mapUrl: "https://www.google.com/maps/search/阿蘇山火口", note: "視當日管制開放", cat: "sight" },
      { time: "12:00", text: "大觀峰", mapUrl: "https://www.google.com/maps/search/大觀峰", cat: "sight" },
      { time: "13:30", text: "Milk Road", mapUrl: "https://www.google.com/maps/search/ミルクロード+阿蘇", cat: "sight" },
      { time: "14:30", text: "阿蘇赤牛 午餐", mapUrl: "https://www.google.com/maps/search/阿蘇赤牛", cat: "food" },
      { time: "18:00", text: "晚上回住宿休息，泡湯", cat: "onsen" },
    ]
  },
  {
    day: "DAY 4", date: "Feb 6, Sat", location: "阿蘇 → 黑川溫泉",
    items: [
      { time: "09:30", text: "上午阿蘇最後景點", note: "睡晚一點，彈性安排", cat: "sight" },
      { time: "11:30", text: "前往黑川溫泉", mapUrl: "https://www.google.com/maps/search/黑川溫泉", cat: "transit" },
      { time: "13:00", text: "湯巡り", note: "溫泉手形，三間選三泡", cat: "onsen" },
      { time: "15:00", text: "黑川溫泉街散步", mapUrl: "https://www.google.com/maps/search/黑川溫泉街", cat: "sight" },
      { time: "18:00", text: "溫泉旅館晚餐", note: "除夕", cat: "food" },
      { time: "20:00", text: "泡湯", cat: "onsen" },
      { time: "—", text: "Check-in · 黑川溫泉旅館", note: "住宿尚未預訂", cat: "stay" },
    ]
  },
  {
    day: "DAY 5", date: "Feb 7, Sun", location: "黑川 → 由布院 → 福岡",
    items: [
      { time: "08:00", text: "早餐＋早上泡湯", cat: "onsen" },
      { time: "10:00", text: "黑川 → 由布院", mapUrl: "https://www.google.com/maps/search/由布院", cat: "transit" },
      { time: "11:30", text: "湯之坪街道", mapUrl: "https://www.google.com/maps/search/湯の坪街道", cat: "shop" },
      { time: "12:30", text: "Floral Village", mapUrl: "https://www.google.com/maps/search/由布院+フローラルビレッジ", cat: "sight" },
      { time: "13:30", text: "金鱗湖", mapUrl: "https://www.google.com/maps/search/金鱗湖", cat: "sight" },
      { time: "14:00", text: "由布院午餐", mapUrl: "https://www.google.com/maps/search/由布院+午餐", cat: "food" },
      { time: "15:30", text: "由布院還車", cat: "transit" },
      { time: "16:00", text: "「由布院之森」→ 博多", mapUrl: "https://www.google.com/maps/search/由布院駅", note: "JR 特急，實際發車時間依訂票為準", cat: "transit" },
      { time: "18:00", text: "Check-in · 福岡住宿", note: "住宿尚未預訂，三晚", cat: "stay" },
    ]
  },
  {
    day: "DAY 6", date: "Feb 8, Mon", location: "福岡市區",
    items: [
      { time: "09:00", text: "大濠公園", mapUrl: "https://www.google.com/maps/search/大濠公園", cat: "sight" },
      { time: "10:30", text: "福岡城跡", mapUrl: "https://www.google.com/maps/search/福岡城跡", cat: "sight" },
      { time: "12:00", text: "櫛田神社", mapUrl: "https://www.google.com/maps/search/櫛田神社", cat: "sight" },
      { time: "13:30", text: "天神／博多購物", mapUrl: "https://www.google.com/maps/search/天神+博多", cat: "shop" },
      { time: "18:00", text: "福岡美食 晚餐", mapUrl: "https://www.google.com/maps/search/福岡+美食", cat: "food" },
    ]
  },
  {
    day: "DAY 7", date: "Feb 9, Tue", location: "福岡／糸島",
    items: [
      { time: "09:00", text: "視天氣：糸島一日遊", note: "晴天：二見ヶ浦・海邊咖啡廳・糸島海岸｜雨天備案：太宰府天滿宮＋天神/博多購物", cat: "sight" },
      { time: "10:00", text: "二見ヶ浦", mapUrl: "https://www.google.com/maps/search/二見ヶ浦+糸島", cat: "sight" },
      { time: "11:30", text: "海邊咖啡廳", mapUrl: "https://www.google.com/maps/search/糸島+カフェ", cat: "cafe" },
      { time: "13:00", text: "糸島海岸", mapUrl: "https://www.google.com/maps/search/糸島+海岸", cat: "sight" },
      { time: "18:00", text: "福岡晚餐", cat: "food" },
    ]
  },
  {
    day: "DAY 8", date: "Feb 10, Wed", location: "福岡 → 台灣",
    items: [
      { time: "08:00", text: "早餐", cat: "food" },
      { time: "10:00", text: "最後採買／伴手禮", mapUrl: "https://www.google.com/maps/search/天神+博多", cat: "shop" },
      { time: "19:10", text: "福岡機場 → 台灣 — JX841", cat: "flight" },
      { time: "20:50", text: "Arrive Taipei — TPE", cat: "flight" },
    ]
  },
];

type Extra = { text: string; note: string; links?: { label: string; url: string }[] };

const EXTRAS: Extra[] = [
  { text: "簽證", note: "日本對台灣免簽，出發前線上填 Visit Japan Web 入境表" },
  { text: "住宿", note: "阿蘇三晚：Origami Experience（已訂）\n黑川溫泉一晚：尚未預訂\n福岡三晚：尚未預訂" },
  { text: "已預約", note: "STARLUX 來回機票（JX846 / JX841，訂位代號 DSPKZF）\nOrigami Experience（阿蘇三晚）" },
  { text: "待預約", note: "租車（熊本機場取車 → 由布院還車）\n黑川溫泉住宿\n福岡住宿\n「由布院之森」指定席車票" },
  { text: "租車", note: "公司／車款尚未決定\n2/3 熊本機場取車 → 2/7 由布院還車" },
  {
    text: "常用連結", note: "",
    links: [
      { label: "Origami Experience（阿蘇住宿）", url: "https://origami-experience.com/" },
    ]
  },
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
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(43,46,38,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
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

function ExtraItem({ e }: { e: Extra }) {
  return (
    <div style={{ padding: "14px 0", borderBottom: `0.5px solid rgba(43,46,38,0.1)` }}>
      <div style={{ fontSize: 14, color: TEXT }}>{e.text}</div>
      {e.note && (
        <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, margin: "8px 0 0", fontStyle: "italic", whiteSpace: "pre-line" }}>{e.note}</p>
      )}
      {e.links && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
          {e.links.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: MUTED, textDecoration: "none" }}
              onMouseEnter={ev => (ev.currentTarget.style.color = ACCENT)}
              onMouseLeave={ev => (ev.currentTarget.style.color = MUTED)}
            >
              {l.label}
              <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.5 }}>↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function Countdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState<{ days: number; hrs: number; min: number } | null>(null);
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTime(null); return; }
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
  if (!time) return null;
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

const HERO_URL = "https://res.cloudinary.com/dydhvvubl/image/upload/v1791687372/DSC09767_bayxwo.jpg";

export default function Kyushu() {
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

  async function handleShare() {
    await shareOrCopyLink({
      title: "Kyushu — Matt Travels",
      text: "Winter 2027, Feb 3–10",
      url: window.location.href,
      fileBlob: null,
      filename: "kyushu.jpg",
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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "16px 20px" : "18px 40px", background: "rgba(240,239,232,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(43,46,38,0.08)` }}>
        {isMobile ? (
          <a href="/" style={{ fontSize: 10, letterSpacing: "0.15em", color: MUTED, textDecoration: "none" }}>← KYUSHU</a>
        ) : (
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
            <span style={{ color: TEXT }}>KYUSHU</span>
          </div>
        )}
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>FEB 3 – 10, 2027</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", overflow: "hidden", backgroundColor: "#15170f" }}>
        <motion.div style={{ y: heroY }}>
          <img
            src={HERO_URL}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
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
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 16px 28px" : "0 32px 40px 32px", paddingRight: isMobile ? "16px" : "64px", opacity: heroOpacity, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ fontSize: isMobile ? "clamp(34px, 10vw, 60px)" : "clamp(46px, 7vw, 90px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 24 }}
            >
              Kyushu
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 24, flexWrap: "wrap" }}
            >
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Winter 2027</span>
              <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>8 Days</span>
              <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Aso · Kurokawa · Fukuoka</span>
            </motion.div>
          </div>
          {!isMobile && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Countdown targetDate={new Date("2027-02-03")} />
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(138,144,118,0.2)` }} />
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

        {/* Travel info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>TRAVEL INFO</span>
            <div style={{ flex: 1, height: 0.5, background: `rgba(138,144,118,0.2)` }} />
          </div>
          {EXTRAS.map((e, i) => <ExtraItem key={i} e={e} />)}
        </motion.div>

        {/* Metadata footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ borderTop: `0.5px solid rgba(43,46,38,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "-5°C — 10°C", sub: "阿蘇高山酷寒，福岡較溫和" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Rustic / Volcanic / Serene", sub: "枯草與溫泉的季節" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "Winter", sub: "草千里枯黃季" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "WITH", value: "Family", sub: "家族溫泉小旅行" },
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
