"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Category = "food" | "transit" | "stay" | "sight" | "shop" | "onsen" | "cafe";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: number; date: string; location: string; items: Item[]; };

const ACCENT = "#9c7c5a";
const BG = "#f4f1ea";
const TEXT = "#2f2b27";
const MUTED = "#9a8f85";

const GALLERY: { url: string; caption: string; location: string; }[] = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587721/CMs2_kxovon.jpg", caption: "Tempo", location: "Nimman" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587722/CMs3_ihos9b.jpg", caption: "The House by Ginger", location: "Chiang Mai Old City" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587723/CMs4_ibgozt.jpg", caption: "KaPaO Thai Kaprao", location: "Nimman" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587724/CMs6_xsqf9w.jpg", caption: "Elephant river crossing", location: "Elephant Nature Park" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587724/CMs5_nbru3r.jpg", caption: "Wachirathan Falls, late afternoon", location: "Doi Inthanon" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587725/CMs7_tlhwhg.jpg", caption: "Sunday morning at Jing Jai", location: "Jing Jai Market" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587727/CMs8_qthurk.jpg", caption: "Phra Mahathat Naphamethanidon", location: "Doi Inthanon National Park" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587729/CMs9_dcixzq.jpg", caption: "Mae Kampong village", location: "East Mountains" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778587736/CMs1_r4l0pn.jpg", caption: "Thai milk tea", location: "Nimman" },
];

const ITINERARY: Day[] = [
  {
    day: 1, date: "Feb 13, Fri", location: "Chiang Mai — Nimman",
    items: [
      { time: "07:20", text: "Depart Taipei", cat: "transit" },
      { time: "10:35", text: "Arrive Chiang Mai", cat: "transit" },
      { time: "12:00", text: "Check-in · Travelodge Nimman", cat: "stay" },
      { time: "14:00", text: "One Nimman", mapUrl: "https://www.google.com/maps/search/One+Nimman+Chiang+Mai", note: "清邁最美紅磚文創區，適合散步拍照。尼曼區算好逛，比古城區環境好，步調舒服，後來覺得住這不錯。", cat: "sight" },
      { time: "17:00", text: "烤山尼曼", mapUrl: "https://www.google.com/maps/search/Khao+Soy+Nimman+Chiang+Mai", note: "米其林推薦的泰北咖哩麵。早一點去可以不用排隊，排太久的話我覺得不值得。", cat: "food" },
      { time: "20:00", text: "Nimman House Massage", mapUrl: "https://www.google.com/maps/search/Nimman+House+Massage+Chiang+Mai", note: "就是愛按摩（這間還好）。", cat: "onsen" },
    ]
  },
  {
    day: 2, date: "Feb 14, Sat", location: "East — Mae Kampong",
    items: [
      { time: "09:00", text: "Private car — East Mountains", cat: "transit" },
      { time: "10:30", text: "Mae Kampong Village & Waterfall", mapUrl: "https://www.google.com/maps/search/Mae+Kampong+Chiang+Mai", note: "溪流與森林包圍的百年木造村落，這裡滿不錯的。", cat: "sight" },
      { time: "13:00", text: "The Giant Chiang Mai", mapUrl: "https://www.google.com/maps/search/The+Giant+Chiang+Mai", note: "就是一棵大樹。", cat: "sight" },
      { time: "18:00", text: "Tong Tem Toh", mapUrl: "https://www.google.com/maps/search/Tong+Tem+Toh+Chiang+Mai", note: "尼曼路超人氣泰北料理，烤豬肉好吃。", cat: "food" },
      { time: "20:00", text: "Sum Bamboo Massage", mapUrl: "https://www.google.com/maps/place/sum+bamboo+massage+(Nimman)", note: "Threads 上非常推的泰式按摩，很道地但很痛，想體驗可以去哈哈。", cat: "onsen" },
    ]
  },
  {
    day: 3, date: "Feb 15, Sun", location: "Market & Old City",
    items: [
      { time: "09:00", text: "Jing Jai Market", mapUrl: "https://www.google.com/maps/search/Jing+Jai+Market+Chiang+Mai", note: "清邁最美文創早市，算很好逛，環境好。", cat: "sight" },
      { time: "12:00", text: "Hummus Garden", mapUrl: "https://www.google.com/maps/place/Hummus+Garden+Chiang+Mai/@18.780532,98.9903323,14.58z/data=!4m15!1m8!3m7!1s0x30da3bbb11e91869:0xe27068e785391c52!2sHummus+Garden+Chiang+Mai!8m2!3d18.7749381!4d98.9994335!10e9!16s%2Fg%2F11h6qctkm3!3m5!1s0x30da3bbb11e91869:0xe27068e785391c52!8m2!3d18.7749381!4d98.9994335!16s%2Fg%2F11h6qctkm3?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D", cat: "food" },
      { time: "14:00", text: "契迪龍寺", cat: "sight" },
      { time: "17:00", text: "Sunday Walking Street", mapUrl: "https://www.google.com/maps/search/Sunday+Walking+Street+Chiang+Mai", note: "全泰國最大夜市，感受春節熱鬧氣氛。", cat: "sight" },
      { time: "18:30", text: "The House by Ginger", mapUrl: "https://www.google.com/maps/search/The+House+by+Ginger+Chiang+Mai", note: "米其林推薦，古城內懷舊風格精緻泰菜。吃完覺得普普，價位高吃氣氛的。", cat: "food" },
    ]
  },
  {
    day: 4, date: "Feb 16, Mon", location: "Doi Inthanon — 除夕",
    items: [
      { time: "08:30", text: "Private car — Doi Inthanon", cat: "transit" },
      { time: "10:30", text: "Summit & Twin Pagodas", mapUrl: "https://www.google.com/maps/search/Doi+Inthanon+National+Park", note: "雲海花園。", cat: "sight" },
      { time: "13:00", text: "Kiew Mae Pan Trail", mapUrl: "https://www.google.com/maps/search/Kiew+Mae+Pan+Trail+Doi+Inthanon", note: "2 小時高山健行，台灣的山比較漂亮哈哈。", cat: "sight" },
      { time: "15:30", text: "Wachirathan Falls", mapUrl: "https://www.google.com/maps/search/Wachirathan+Waterfall+Chiang+Mai", note: "瀑布好美。", cat: "sight" },
      { time: "18:00", text: "KaPaO Thai Kaprao", mapUrl: "https://www.google.com/maps/place/KaPaO", note: "環境好、便宜、好吃，吃完再去隔壁網美甜點很爽。", cat: "food" },
    ]
  },
  {
    day: 5, date: "Feb 17, Tue", location: "Elephant Park → InterContinental",
    items: [
      { time: "09:00", text: "Elephant Nature Park", mapUrl: "https://www.google.com/maps/search/Elephant+Nature+Park+Chiang+Mai", cat: "sight" },
      { time: "14:00", text: "Check-in · InterContinental Mae Ping", cat: "stay" },
      { time: "18:00", text: "Little Stove Kitchen", mapUrl: "https://www.google.com/maps/search/Little+Stove+Kitchen+Chiang+Mai", note: "吃膩泰式的話這間海南雞很好吃。", cat: "food" },
    ]
  },
  {
    day: 6, date: "Feb 18, Wed", location: "Free Day",
    items: [
      { time: "—", text: "Hotel, rest & souvenir shopping", cat: "shop" },
      { time: "21:00", text: "Makkha Health & Spa", mapUrl: "https://www.google.com/maps/search/Makkha+Health+Spa+Chiang+Mai", note: "環境很好，按完有芒果糯米飯，可能要早點預約。", cat: "onsen" },
    ]
  },
  {
    day: 7, date: "Feb 19, Thu", location: "Depart",
    items: [
      { time: "11:50", text: "Depart Chiang Mai", cat: "transit" },
      { time: "16:30", text: "Arrive Taipei", cat: "transit" },
    ]
  },
];

const EXTRAS = [
  { text: "Currency Exchange — Mr. Pierre", note: "路上很多坑盤子的別亂換，選這間就對了。V.K. Currency Exchange 也還行。" },
  { text: "Anantara Resort", note: "原本很想住，過年被訂滿了。下次來要提前卡位，看起來真的很讚。" },
];

const METADATA = [
  { label: "Temperature", value: "22°C — 31°C" },
  { label: "Currency", value: "Thai Baht (THB)" },
  { label: "Mood", value: "Slow / Warm / Quiet" },
  { label: "Season", value: "Cool Season, Lunar New Year" },
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

function GalleryImage({ img, index, onClick, isMobile }: { img: typeof GALLERY[0]; index: number; onClick: () => void; isMobile: boolean }) {
  const [active, setActive] = useState(false);
  const handleClick = () => {
    if (isMobile) { setActive(o => !o); }
    else { onClick(); }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onMouseEnter={() => { if (!isMobile) setActive(true); }}
      onMouseLeave={() => { if (!isMobile) setActive(false); }}
      onClick={handleClick}
      style={{ position: "relative", borderRadius: 2, overflow: "hidden", cursor: isMobile ? "pointer" : "zoom-in", marginBottom: isMobile ? 6 : 10, breakInside: "avoid" }}
    >
      <img src={img.url} style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: (!isMobile && active) ? "scale(1.03)" : "scale(1)" }} />
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 16px" }}
          >
            <div style={{ fontSize: isMobile ? 10 : 12, color: "rgba(255,255,255,0.9)", fontStyle: "italic", fontFamily: "Georgia, serif", lineHeight: 1.4 }}>{img.caption}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", marginTop: 4 }}>{img.location}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ExtraItem({ e }: { e: { text: string; note: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "14px 0", borderBottom: `0.5px solid rgba(47,43,39,0.1)`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 14, color: TEXT }}>{e.text}</div>
        <AnimatePresence>
          {open && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, margin: "8px 0 0", fontStyle: "italic", overflow: "hidden" }}
            >{e.note}</motion.p>
          )}
        </AnimatePresence>
      </div>
      <span style={{ fontSize: 10, color: MUTED, opacity: 0.5, paddingTop: 3 }}>{open ? "−" : "+"}</span>
    </div>
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
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(47,43,39,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
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

export default function ChiangMai() {
  const [lightbox, setLightbox] = useState<string | null>(null);
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

  const col1 = [GALLERY[0], GALLERY[3], GALLERY[6]];
  const col2 = [GALLERY[1], GALLERY[4], GALLERY[7]];
  const col3 = [GALLERY[2], GALLERY[5], GALLERY[8]];

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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "16px 20px" : "18px 40px", background: "rgba(244,241,234,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(47,43,39,0.08)` }}>
        {isMobile ? (
          <a href="/" style={{ fontSize: 10, letterSpacing: "0.15em", color: MUTED, textDecoration: "none" }}>← CHIANG MAI</a>
        ) : (
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
            <span style={{ color: TEXT }}>CHIANG MAI</span>
          </div>
        )}
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>FEB 13 – 19, 2026</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#2a1f1a" }}>
        <motion.div
          style={{ position: "absolute", inset: "-10% 0", backgroundImage: "url(https://res.cloudinary.com/dydhvvubl/image/upload/v1778430032/CM1_syxfa2.jpg)", backgroundSize: "cover", backgroundPosition: "center 30%", y: heroY }}
        />
        {/* Layered overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.75) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />

        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 20px 48px" : "0 40px 60px", opacity: heroOpacity }}
        >
          {/* Eyebrow */}


          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ fontSize: "clamp(56px, 9vw, 110px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 24 }}
          >
            Chiang Mai
          </motion.div>

          {/* Subtitle row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 24 }}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Spring 2026</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>7 Days</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em" }}>Thailand</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: "absolute", right: 40, bottom: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(156,124,90,0.2)` }} />
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
              {/* Day header */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.2em" }}>DAY {day.day}</span>
                <span style={{ fontSize: 18, color: TEXT, fontFamily: "Georgia, serif", fontWeight: 300 }}>{day.date}</span>
              </div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.1em", marginBottom: 16, paddingLeft: 0 }}>{day.location}</div>

              <div style={{ paddingLeft: 0 }}>
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(156,124,90,0.2)` }} />
          </div>
          {EXTRAS.map((e, i) => <ExtraItem key={i} e={e} />)}
        </motion.div>

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>PHOTOGRAPHS</span>
            <div style={{ flex: 1, height: 0.5, background: `rgba(156,124,90,0.2)` }} />
          </div>
          <div style={{ display: "flex", gap: isMobile ? 6 : 10 }}>
            {[col1, col2, col3].map((col, ci) => (
              <div key={ci} style={{ flex: 1 }}>
                {col.map((img, i) => (
                  <GalleryImage key={i} img={img} index={ci * 3 + i} onClick={() => setLightbox(img.url)} isMobile={isMobile} />
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
          style={{ borderTop: `0.5px solid rgba(47,43,39,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: "#9a8f85", letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "22°C — 31°C", sub: "Warm and pleasant" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label: "CURRENCY", value: "THB", sub: "Thai Baht" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Slow / Warm / Quiet", sub: "Perfect for reset" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "Cool Season", sub: "Lunar New Year" },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ color: "#9a8f85", marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontSize: 9, color: "#9a8f85", letterSpacing: "0.2em", marginBottom: 6 }}>{m.label}</div>
                <div style={{ fontSize: 14, color: "#2f2b27", marginBottom: 3 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "#9a8f85" }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
