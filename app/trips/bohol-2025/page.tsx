"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { buildPhotoGridShareCard, shareOrCopyLink } from "../../shareCard";

type Category = "food" | "transit" | "flight" | "stay" | "sight" | "cafe" | "dive" | "spa";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: string; date: string; location: string; items: Item[]; };

const ACCENT = "#1b8080";
const BG = "#f2ede3";
const TEXT = "#1c2c2c";
const MUTED = "#7a9898";

const GALLERY: { url: string; caption: string; location: string; }[] = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682135/BOs1_c10ey9.jpg", caption: "Welcome cocktail", location: "Amorita Resort" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682136/BOs2_qlgxli.jpg", caption: "章魚，Day 1 dinner", location: "Amorita" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682136/BOs3_qmavdd.jpg", caption: "Chasing dolphins", location: "Balicasag Island" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682137/BOs4_gz4cd6.jpg", caption: "Our ride for the day", location: "Bohol Sea" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682143/BOs5_scqgut.jpg", caption: "Ubeco pasta & wine", location: "Alona, Panglao" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682136/BOs6_uagkz4.jpg", caption: "Chocolate Hills", location: "Carmen, Bohol" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682136/BOs7_vicepb.jpg", caption: "Goodbye Amorita", location: "Panglao" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682141/BOs8_szrdgw.jpg", caption: "Best dinner of the trip", location: "Saffron, Amorita" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682146/BOs9_jvpq3m.jpg", caption: "超可怕水母", location: "Moalboal" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682143/BOs10_gmt3jk.jpg", caption: "Bohol's sky", location: "Panglao" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682142/BOs11_osze22.jpg", caption: "Tarsier，眼鏡猴", location: "Tarsier Sanctuary" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682145/BOs12_a50luk.jpg", caption: "Morning at Amorita", location: "Amorita Resort" },
];

const ITINERARY: Day[] = [
  {
    day: "DAY 1", date: "Oct 22, Wed", location: "Taipei → Cebu → Bohol",
    items: [
      { time: "07:00", text: "Depart Taipei (TPE)", cat: "flight", note: "薄荷島沒有直飛滿可惜的，清晨從台北出發下午四點才 check in，明明很近的地方" },
      { time: "09:50", text: "Arrive Cebu (CEB)", cat: "flight" },
      { time: "13:00", text: "OceanJet 渡輪出發", cat: "transit", note: "Ocean jet~ Ocean jet~" },
      { time: "15:00", text: "抵達薄荷島", cat: "transit" },
      { time: "16:00", text: "入住 Amorita Resort", cat: "stay", mapUrl: "https://www.google.com/maps/search/Amorita+Resort+Panglao+Bohol", note: "薄荷島懸崖邊的度假村，先去看海。" },
      { time: "傍晚", text: "泳池、沙灘放空", cat: "sight" },
      { time: "21:00", text: "飯店按摩", cat: "spa" },
    ]
  },
  {
    day: "DAY 2", date: "Oct 23, Thu", location: "Balicasag Island · Alona Beach",
    items: [
      { time: "06:30", text: "飯店接送出發", cat: "transit" },
      { time: "07:30", text: "前往 Balicasag Island 追海豚", cat: "dive", mapUrl: "https://www.google.com/maps/search/Balicasag+Island+Bohol" },
      { time: "08:00", text: "浮潛 & 潛水", cat: "dive" },
      { time: "15:00", text: "Alona Beach SUP & 獨木舟", cat: "dive", mapUrl: "https://www.google.com/maps/search/Alona+Beach+Panglao+Bohol" },
      { time: "17:30", text: "Ubeco 晚餐", cat: "food", mapUrl: "http://www.ubeco-bohol.com", note: "非常有名的餐廳，但薄荷島背後的老闆都是韓國人" },
      { time: "20:00", text: "Avocado massage", cat: "spa", mapUrl: "https://www.google.com/maps/place/Avocado+footspa+%EC%95%84%EB%B3%B4%EC%B9%B4%EB%8F%84+%ED%92%8B%EC%8A%A4%ED%8C%8C/@9.5535498,123.7730817,19z/data=!3m1!4b1!4m6!3m5!1s0x33abad0ee7b40a29:0xf242465d5baaf28a!8m2!3d9.5535498!4d123.7737268!16s%2Fg%2F11wc4cd1hr", note: "王造博10分鐘開始打呼笑死" },
    ]
  },
  {
    day: "DAY 3", date: "Oct 24, Fri", location: "Chocolate Hills · Tarsier · Bee Farm",
    items: [
      { time: "10:00", text: "巧克力山", cat: "sight", mapUrl: "https://www.google.com/maps/search/Chocolate+Hills+Complex+Carmen+Bohol", note: "1,268 座錐形小山，乾季會轉成棕色，像一顆顆巧克力。" },
      { time: "11:30", text: "拜訪眼鏡猴", cat: "sight", mapUrl: "https://www.google.com/maps/search/Philippine+Tarsier+Sanctuary+Bohol", note: "聽說大聲講話他會嚇到，然後會不吃東西餓死= =" },
      { time: "13:00", text: "Bohol Bee Farm 午餐", cat: "food", mapUrl: "https://www.google.com/maps/search/Bohol+Bee+Farm+Panglao" },
      { time: "15:00", text: "回 Amorita，游泳 / 追夕陽", cat: "sight", note: "Chill & relax" },
      { time: "19:00", text: "晚餐", cat: "food" },
    ]
  },
  {
    day: "DAY 4", date: "Oct 25, Sat", location: "Moalboal · Amorita Saffron",
    items: [
      { time: "10:00", text: "沙丁魚風暴", cat: "dive", note: "超多，還看到毒水母" },
      { time: "15:00", text: "按摩放鬆", cat: "spa" },
      { time: "19:00", text: "Amorita Saffron Restaurant — 烤肉晚餐", cat: "food", note: "日落、海風，Perfect night" },
    ]
  },
  {
    day: "DAY 5", date: "Oct 26, Sun", location: "Bohol → Cebu → Taipei",
    items: [
      { time: "早上", text: "Amorita 最後時光", cat: "sight" },
      { time: "11:40", text: "薄荷島渡輪出發", cat: "transit" },
      { time: "13:40", text: "抵達宿霧", cat: "transit" },
      { time: "14:30", text: "Alaya Mall", cat: "food" },
      { time: "19:45", text: "Depart Cebu (CEB)", cat: "flight", note: "Nothing beats a jet2 holiday" },
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
  if (cat === "cafe") return <svg {...p}><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/></svg>;
  if (cat === "dive") return <svg {...p}><path d="M2 11c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></svg>;
  if (cat === "spa") return <svg {...p}><path d="M12 2C12 2 6 9 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12z"/></svg>;
  return <span style={{ width: 13 }} />;
}

function GalleryImage({ img, index, onClick, isMobile, isTouch }: { img: typeof GALLERY[0]; index: number; onClick: () => void; isMobile: boolean; isTouch: boolean }) {
  const [active, setActive] = useState(false);
  const show = active;

  const handleClick = () => {
    if (isTouch) { setActive(o => !o); }
    else { onClick(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      onMouseEnter={() => { if (!isTouch) setActive(true); }}
      onMouseLeave={() => { if (!isTouch) setActive(false); }}
      onClick={handleClick}
      style={{ position: "relative", borderRadius: 2, overflow: "hidden", cursor: "pointer", marginBottom: isMobile ? 6 : 10, breakInside: "avoid" }}
    >
      <img src={img.url} alt={img.caption} style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: (!isTouch && active) ? "scale(1.03)" : "scale(1)" }} />
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: isMobile ? "12px 10px" : "20px 16px" }}
          >
            <div style={{ fontSize: isMobile ? 10 : 12, color: "rgba(255,255,255,0.9)", fontStyle: "italic", fontFamily: "Georgia, serif", lineHeight: 1.4 }}>{img.caption}</div>
            <div style={{ fontSize: isMobile ? 8 : 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", marginTop: 3 }}>{img.location}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
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
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(28,44,44,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
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

export default function Bohol() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => { setIsTouch(navigator.maxTouchPoints > 0); }, []);

  async function handleShare() {
    const blob = await buildPhotoGridShareCard(GALLERY.map(g => g.url), { kicker: "TRAVEL ARCHIVE", title: "Bohol", backdropColor: BG, footerTop: "Autumn 2025", footerBottom: "5 Days" });
    await shareOrCopyLink({
      title: "Bohol — Matt Travels",
      text: "Fall 2025, Oct 22–26",
      url: window.location.href,
      fileBlob: blob,
      filename: "bohol-story.png",
      fallbackImgUrl: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682135/BO1_flckks.jpg",
      onFallbackMessage: msg => { setShareMsg(msg); setTimeout(() => setShareMsg(null), 2000); },
    });
  }

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const col1 = [GALLERY[0], GALLERY[3], GALLERY[6], GALLERY[9]];
  const col2 = [GALLERY[1], GALLERY[4], GALLERY[7], GALLERY[10]];
  const col3 = [GALLERY[2], GALLERY[5], GALLERY[8], GALLERY[11]];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "-apple-system, 'Helvetica Neue', sans-serif", color: TEXT }}>
      {shareMsg && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(20,20,20,0.92)", color: "#f0ece4", padding: "8px 16px", borderRadius: 20, fontSize: 12, zIndex: 999, border: "1px solid rgba(255,255,255,0.1)" }}>
          {shareMsg}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}
          >
            <img src={lightbox} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "14px 20px" : "18px 40px", background: "rgba(242,237,227,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(28,44,44,0.08)` }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
          {!isMobile && <><a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span><a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span></>}
          {isMobile && <a href="/" style={{ color: MUTED, textDecoration: "none", marginRight: 10 }}>←</a>}
          <span style={{ color: TEXT }}>BOHOL</span>
        </div>
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>OCT 22 – 26, 2025</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", height: isMobile ? "auto" : "100vh", overflow: "hidden", background: "#061818" }}>
        <motion.div style={isMobile ? { y: 0 } : { position: "absolute", top: "-10%", left: 0, right: 0, height: "120%", y: heroY }}>
          <img
            src="https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682135/BO1_flckks.jpg"
            style={{ width: "100%", height: isMobile ? "auto" : "100%", objectFit: isMobile ? undefined : "cover", objectPosition: "center center", display: "block" }}
          />
        </motion.div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.88) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
        <button
          onClick={handleShare}
          aria-label="Share"
          style={{ position: "absolute", top: isMobile ? 52 : 60, right: isMobile ? 10 : 40, zIndex: 2, width: isMobile ? 26 : 34, height: isMobile ? 26 : 34, borderRadius: "50%", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width={isMobile ? 12 : 15} height={isMobile ? 12 : 15} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="15" rx="4" /><circle cx="12" cy="13.5" r="4.2" /><path d="M8 6l1.5-2.5h5L16 6" /><circle cx="17.5" cy="9.5" r="0.8" fill="#fff" stroke="none" />
          </svg>
        </button>

        <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 20px 32px" : "0 40px 48px", opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ fontSize: isMobile ? "clamp(52px, 14vw, 80px)" : "clamp(64px, 9vw, 120px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 20 }}
          >
            Bohol
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 24, flexWrap: "wrap" }}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>Autumn 2025</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>5 Days</span>
            {!isMobile && (
              <>
                <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>Philippines</span>
              </>
            )}
          </motion.div>
        </motion.div>

        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: "absolute", right: 40, bottom: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
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
            <div style={{ flex: 1, height: 0.5, background: "rgba(27,128,128,0.2)" }} />
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

        {/* Photographs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>PHOTOGRAPHS</span>
            <div style={{ flex: 1, height: 0.5, background: "rgba(27,128,128,0.2)" }} />
          </div>
          {isTouch && <p style={{ fontSize: 11, color: MUTED, fontStyle: "italic", margin: "0 0 20px", opacity: 0.7 }}>tap to view</p>}
          <div style={{ display: "flex", gap: isMobile ? 6 : 10 }}>
            {[col1, col2, col3].map((col, ci) => (
              <div key={ci} style={{ flex: 1 }}>
                {col.map((img, i) => (
                  <GalleryImage key={i} img={img} index={ci * 4 + i} onClick={() => setLightbox(img.url)} isMobile={isMobile} isTouch={isTouch} />
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metadata footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ borderTop: `0.5px solid rgba(28,44,44,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "27°C — 32°C", sub: "Tropical warmth" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Tropical / Marine / Chill", sub: "Ocean life & slow days" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>, label: "STAY", value: "Amorita Resort", sub: "Panglao Island, Bohol" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "WITH", value: "Middle School Friends", sub: "Good old days" },
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
