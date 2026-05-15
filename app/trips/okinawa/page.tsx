"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Category = "food" | "transit" | "flight" | "stay" | "sight" | "cafe" | "dive" | "spa";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: string; date: string; location: string; items: Item[]; };

const ACCENT = "#1480b0";
const BG = "#eef5f9";
const TEXT = "#1c2c35";
const MUTED = "#6595b0";

const GALLERY: { url: string; caption: string; location: string; }[] = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843905/OKIs1_hbdhtw.jpg", caption: "深夜到，通堂拉麵", location: "Tondou, Naha" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843906/OKIs2_hulunb.jpg", caption: "名城ビーチ", location: "Nanjo, South Okinawa" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843905/OKIs3_eciko5.jpg", caption: "Okinawa sky", location: "North Okinawa" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843903/OKIs4_amjost.jpg", caption: "Diver's steak", location: "Motobu, North Okinawa" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843905/OKIs5_llckn6.jpg", caption: "玉泉洞鐘乳石", location: "Gyokusendo, Nanjo" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843905/OKIs6_ue2p2l.jpg", caption: "波上宮", location: "Naha" },
];

const ITINERARY: Day[] = [
  {
    day: "DAY 1", date: "Apr 11, Fri", location: "Taipei → Okinawa",
    items: [
      { time: "17:05", text: "Depart Taipei (TPE)", cat: "flight" },
      { time: "19:45", text: "Arrive Okinawa (OKA)", cat: "flight" },
      { time: "20:30", text: "取車出發", cat: "transit", note: "ヴァケーション レンタカー 那覇空港店" },
      { time: "21:00", text: "琉球新麵 通堂 本店", cat: "food", mapUrl: "https://www.google.com/maps/search/琉球新麵+通堂+本店+那霸", note: "都幾點了還排一堆人..." },
      { time: "22:30", text: "入住 REF Okinawa Arena by Vessel Hotels", cat: "stay" },
    ]
  },
  {
    day: "DAY 2", date: "Apr 12, Sat", location: "North Okinawa",
    items: [
      { time: "09:30", text: "青之洞窟浮潛", cat: "dive", mapUrl: "https://www.google.com/maps/search/青の洞窟+真栄田岬+沖縄", note: "世界三大青洞之一，陽光從海底折射進來，整個洞是藍的。" },
      { time: "10:30", text: "万座毛", cat: "sight", mapUrl: "https://www.google.com/maps/search/万座毛+沖縄" },
      { time: "11:30", text: "潛水員牛排", cat: "food", mapUrl: "https://www.google.com/maps/place/%E6%BD%9B%E6%B0%B4%E5%93%A1%E7%89%9B%E6%8E%92/@26.4373497,127.5740051,9.46z/data=!4m6!3m5!1s0x34e4ff6d0f7340ff:0x9dd6ffcd2a4c5e4d!8m2!3d26.5947861!4d127.9594444!16s%2Fg%2F1tj82lxm", note: "日本牛排是配飯，這間好吃。" },
      { time: "13:00", text: "沖縄美ら海水族館", cat: "sight", mapUrl: "https://www.google.com/maps/search/沖縄美ら海水族館" },
      { time: "15:00", text: "古宇利島 — 海洋塔 & 沙灘", cat: "sight", mapUrl: "https://www.google.com/maps/search/古宇利島+沖縄" },
    ]
  },
  {
    day: "DAY 3", date: "Apr 13, Sun", location: "Central Okinawa · Naha",
    items: [
      { time: "10:00", text: "永旺夢樂城 沖縄 · 寶可夢中心", cat: "sight", mapUrl: "https://www.google.com/maps/search/イオンモール沖縄ライカム" },
      { time: "13:00", text: "美國村 · Blueseal", cat: "cafe", mapUrl: "https://www.google.com/maps/search/American+Village+Okinawa", note: "吃了一堆冰" },
      { time: "16:00", text: "國際通", cat: "sight", mapUrl: "https://www.google.com/maps/search/国際通り+那覇" },
      { time: "19:00", text: "入住 琉球ホテル＆リゾート 名城ビーチ", cat: "stay", mapUrl: "https://www.google.com/maps/search/琉球ホテル+名城ビーチ" },
    ]
  },
  {
    day: "DAY 4", date: "Apr 14, Mon", location: "South Okinawa",
    items: [
      { time: "12:00", text: "系滿魚市", cat: "food", mapUrl: "https://www.google.com/maps/place/%E7%B3%B8%E6%BB%BF%E9%AD%9A%E5%B8%82%E5%A0%B4/@26.1380635,127.6610395,16z/data=!4m6!3m5!1s0x34e567c221f4f19d:0x58162367592c3315!8m2!3d26.1380987!4d127.6613785!16s%2Fg%2F1td2k73b?entry=ttu&g_ep=EgoyMDI2MDUxMi4wIKXMDSoASAFQAw%3D%3D" },
      { time: "14:00", text: "OUTLET ASHIBINAA · SPORTS DEPO Toyosaki", cat: "sight" },
      { time: "16:00", text: "沙灘 / 泳池", cat: "dive" },
    ]
  },
  {
    day: "DAY 5", date: "Apr 15, Tue", location: "Naha → Taipei",
    items: [
      { time: "12:00", text: "玉泉洞", cat: "sight", mapUrl: "https://www.google.com/maps/search/玉泉洞+沖縄" },
      { time: "13:30", text: "瀨長島", cat: "sight", mapUrl: "https://www.google.com/maps/search/瀬長島+沖縄", note: "看很多飛機起降～" },
      { time: "16:00", text: "波上宮", cat: "sight", mapUrl: "https://www.google.com/maps/search/波上宮+那覇" },
      { time: "17:30", text: "Return car", cat: "transit" },
      { time: "20:55", text: "Depart Okinawa (OKA)", cat: "flight" },
    ]
  },
];

const EXTRAS = [
  { text: "Okinawa Vibe", note: "沖繩海灘沒有東南亞那種 chill 感，是日式整潔 fu——還是是因為關稅戰股票跌爛讓我這樣覺得哈哈哈哈" },
];

function ExtraItem({ e }: { e: { text: string; note: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "14px 0", borderBottom: `0.5px solid rgba(28,44,53,0.1)`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: TEXT }}>{e.text}</div>
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, margin: "8px 0 0", fontStyle: "italic", overflow: "hidden" }}
            >
              {e.note}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <span style={{ fontSize: 10, color: MUTED, opacity: 0.5, paddingTop: 2, marginLeft: 16 }}>{open ? "−" : "+"}</span>
    </div>
  );
}

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
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: isMobile ? "12px 10px" : "20px 16px" }}
          >
            <div style={{ fontSize: isMobile ? 10 : 12, color: "rgba(255,255,255,0.9)", fontStyle: "italic", fontFamily: "Georgia, serif", lineHeight: 1.4 }}>{img.caption}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", marginTop: 3 }}>{img.location}</div>
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
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(28,44,53,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
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

export default function Okinawa() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => { setIsTouch(navigator.maxTouchPoints > 0); }, []);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const col1 = [GALLERY[0], GALLERY[3]];
  const col2 = [GALLERY[1], GALLERY[4]];
  const col3 = [GALLERY[2], GALLERY[5]];

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "-apple-system, 'Helvetica Neue', sans-serif", color: TEXT }}>

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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "14px 20px" : "18px 40px", background: "rgba(238,245,249,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(28,44,53,0.08)` }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
          {!isMobile && <><a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span><a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span></>}
          {isMobile && <a href="/" style={{ color: MUTED, textDecoration: "none", marginRight: 10 }}>←</a>}
          <span style={{ color: TEXT }}>OKINAWA</span>
        </div>
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>APR 11 – 15, 2025</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", height: isMobile ? "auto" : "100vh", overflow: "hidden", background: "#010c18" }}>
        <motion.div style={isMobile ? { y: 0 } : { position: "absolute", top: "-10%", left: 0, right: 0, height: "120%", y: heroY }}>
          <img
            src="https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843907/OKI1_kvpgjq.jpg"
            style={{ width: "100%", height: isMobile ? "auto" : "100%", objectFit: isMobile ? undefined : "cover", objectPosition: "center center", display: "block" }}
          />
        </motion.div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.88) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />

        <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 20px 32px" : "0 40px 48px", opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ fontSize: isMobile ? "clamp(52px, 14vw, 80px)" : "clamp(64px, 9vw, 120px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 20 }}
          >
            Okinawa
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 24, flexWrap: "wrap" }}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>Spring 2025</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>5 Days</span>
            {!isMobile && (
              <>
                <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>Japan</span>
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(20,128,176,0.2)` }} />
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

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>NOTES</span>
            <div style={{ flex: 1, height: 0.5, background: `rgba(20,128,176,0.2)` }} />
          </div>
          {EXTRAS.map((e, i) => <ExtraItem key={i} e={e} />)}
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(20,128,176,0.2)` }} />
          </div>
          {isTouch && <p style={{ fontSize: 11, color: MUTED, fontStyle: "italic", margin: "0 0 20px", opacity: 0.7 }}>tap to view</p>}
          <div style={{ display: "flex", gap: isMobile ? 6 : 10 }}>
            {[col1, col2, col3].map((col, ci) => (
              <div key={ci} style={{ flex: 1 }}>
                {col.map((img, i) => (
                  <GalleryImage key={i} img={img} index={ci * 2 + i} onClick={() => setLightbox(img.url)} isMobile={isMobile} isTouch={isTouch} />
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
          style={{ borderTop: `0.5px solid rgba(28,44,53,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "19°C — 28°C", sub: "Subtropical spring" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Blue / Open Road / Island", sub: "5-day self-drive" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "Spring", sub: "April in the Ryukyus" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "WITH", value: "Charlotte", sub: "Island road trip" },
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
