"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Category = "food" | "transit" | "flight" | "stay" | "sight" | "shop" | "onsen" | "cafe";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: number; date: string; location: string; items: Item[]; };

const ACCENT = "#a86070";
const BG = "#f4f1f2";
const TEXT = "#1f1518";
const MUTED = "#8a6870";

const HERO_URL = "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526543/To1_rgcmr9.jpg";

type GalleryPhoto = { url: string; caption: string; location: string; };
const GALLERY: GalleryPhoto[] = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526544/Tos2_byiruz.jpg", caption: "新幹線", location: "Fujikyu Line" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526543/Tos3_yee38p.jpg", caption: "-43", location: "Kawaguchiko" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526543/Tos4_joloox.jpg", caption: "日川時計店", location: "Shimoyoshida" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526543/Tos5_biwcuh.jpg", caption: "Shibuya Sky", location: "Shibuya" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526545/Tos6_bm4kcc.jpg", caption: "Sunset", location: "Shibuya" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526545/Tos7_cxwapy.jpg", caption: "吉！", location: "淺草寺" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526544/Tos8_gdlgem.jpg", caption: "Steins;Gate", location: "Akihabara" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526543/Tos9_n2rorf.jpg", caption: "晴空，塔", location: "Tokyo Skytree" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526542/Tos10_tatbbx.jpg", caption: "-43掰掰", location: "Sky" },
];

const ITINERARY: Day[] = [
  {
    day: 1, date: "May 17, Fri", location: "東京gogo",
    items: [
      { time: "08:55", text: "Depart Taipei (TPE)", cat: "flight" },
      { time: "13:15", text: "Arrive Tokyo Narita (NRT)", cat: "flight" },
      { time: "14:49", text: "JR N'EX 成田特快 → 品川 → 五反田", mapUrl: "https://www.google.com/maps/search/Narita+Express+Tokyo", note: "直達品川，轉五反田。15:54 抵達。", cat: "transit" },
      { time: "16:00", text: "Check-in · 三井花園酒店五反田", mapUrl: "https://www.google.com/maps/search/Hotel+Mitsui+Garden+Gotanda+Tokyo", cat: "stay" },
      { time: "17:00", text: "山手線 → 新宿", cat: "transit" },
      { time: "18:00", text: "晚餐 — Nabezo 鍋ぞう 新宿明治通り店", cat: "food" },
      { time: "19:30", text: "ALPEN Tokyo · Lumine Est", mapUrl: "https://www.google.com/maps/search/ALPEN+Tokyo+Shinjuku", cat: "shop" },
    ]
  },
  {
    day: 2, date: "May 18, Sat", location: "河口湖一日遊 Kawaguchiko",
    items: [
      { time: "06:26", text: "新宿出發 → 河口湖", mapUrl: "https://www.google.com/maps/search/Shinjuku+Station+Tokyo", note: "富士山gogo", cat: "transit" },
      { time: "09:00", text: "租電動自行車", cat: "transit" },
      { time: "09:30", text: "下吉田新倉山淺間神社", mapUrl: "https://www.google.com/maps/search/Arakurayama+Sengen+Park+Fujiyoshida", cat: "sight" },
      { time: "11:00", text: "日川時計店", mapUrl: "https://www.google.com/maps/search/Hikawa+Watch+Shimoyoshida", cat: "sight" },
      { time: "12:30", text: "午餐 — 附近", cat: "food" },
      { time: "13:30", text: "富士山景觀纜車", mapUrl: "https://www.google.com/maps/search/Mt+Fuji+Panoramic+Ropeway+Kawaguchiko", cat: "sight" },
      { time: "14:00", text: "河口湖天上山公園", mapUrl: "https://www.google.com/maps/search/Tenjoyama+Park+Kawaguchiko", cat: "sight" },
      { time: "15:30", text: "大石公園", mapUrl: "https://www.google.com/maps/search/Oishi+Park+Kawaguchiko", cat: "sight" },
      { time: "17:16", text: "下吉田 → 新宿", note: "19:28 抵達新宿。", cat: "transit" },
    ]
  },
  {
    day: 3, date: "May 19, Sun", location: "原宿 · 表參道 · 澀谷",
    items: [
      { time: "08:30", text: "早餐 — Bills", mapUrl: "https://www.google.com/maps/search/Bills+Tokyo", cat: "cafe" },
      { time: "09:00", text: "明治神宮", mapUrl: "https://www.google.com/maps/search/Meiji+Shrine+Tokyo", cat: "sight" },
      { time: "10:00", text: "新宿御苑", mapUrl: "https://www.google.com/maps/search/Shinjuku+Gyoen+National+Garden", cat: "sight" },
      { time: "11:00", text: "原宿 · 表參道逛街", mapUrl: "https://www.google.com/maps/search/Takeshita+Street+Harajuku+Tokyo", cat: "shop" },
      { time: "12:00", text: "午餐 — 原宿餃子樓", mapUrl: "https://www.google.com/maps/search/Harajuku+Gyoza+Lou+Tokyo", cat: "food" },
      { time: "13:00", text: "Blue Bottle Coffee", mapUrl: "https://www.google.com/maps/search/Blue+Bottle+Coffee+Aoyama+Tokyo", cat: "cafe" },
      { time: "14:00", text: "Parco · Pokémon Center · Disney Store", mapUrl: "https://www.google.com/maps/search/Shibuya+Parco+Tokyo", cat: "shop" },
      { time: "16:30", text: "Shibuya Sky — 日落", mapUrl: "https://www.google.com/maps/search/Shibuya+Sky+Tokyo", cat: "sight" },
    ]
  },
  {
    day: 4, date: "May 20, Mon", location: "淺草 · 上野 · 秋葉原 · 銀座",
    items: [
      { time: "08:00", text: "山手線 → 淺草", cat: "transit" },
      { time: "08:30", text: "早餐 — MISOJYU", mapUrl: "https://www.google.com/maps/search/MISOJYU+Asakusa+Tokyo", cat: "cafe" },
      { time: "10:00", text: "淺草寺 · 淺草神社", mapUrl: "https://www.google.com/maps/search/Senso-ji+Temple+Asakusa+Tokyo", cat: "sight" },
      { time: "11:30", text: "壽壽喜園抹茶冰淇淋", mapUrl: "https://www.google.com/maps/search/Suzukien+Asakusa+Tokyo", cat: "food" },
      { time: "12:00", text: "銀座線 → 上野", cat: "transit" },
      { time: "12:30", text: "午餐 — とんかつ山家 御徒町店", mapUrl: "https://www.google.com/maps/search/Tonkatsu+Yamabe+Okachimachi+Tokyo", cat: "food" },
      { time: "13:00", text: "東京大學", mapUrl: "https://www.google.com/maps/search/University+of+Tokyo", cat: "sight" },
      { time: "16:00", text: "阿美橫町", mapUrl: "https://www.google.com/maps/search/Ameyoko+Market+Ueno+Tokyo", note: "大章魚燒！", cat: "food" },
      { time: "17:00", text: "秋葉原 · 廣播大樓", mapUrl: "https://www.google.com/maps/search/Radio+Kaikan+Akihabara+Tokyo", note: "Steins;Gate", cat: "shop" },
      { time: "18:30", text: "銀座", mapUrl: "https://www.google.com/maps/search/Ginza+Tokyo", cat: "shop" },
      { time: "19:30", text: "晚餐", cat: "food" },
      { time: "20:00", text: "Uniqlo · 無印良品 旗艦店", mapUrl: "https://www.google.com/maps/search/Uniqlo+Ginza+Tokyo", cat: "shop" },
    ]
  },
  {
    day: 5, date: "May 21, Tue", location: "晴空塔 → 成田機場",
    items: [
      { time: "08:00", text: "飯店早餐", cat: "food" },
      { time: "10:30", text: "東京晴空塔", mapUrl: "https://www.google.com/maps/search/Tokyo+Skytree", cat: "sight" },
      { time: "11:00", text: "Pokémon Center · Jump Shop · Kirby Café", mapUrl: "https://www.google.com/maps/search/Pokemon+Center+Skytree+Town+Tokyo", cat: "shop" },
      { time: "12:30", text: "午餐 — 敘敘苑 晴空塔 30F", mapUrl: "https://www.google.com/maps/search/Jojoen+Tokyo+Skytree", cat: "food" },
      { time: "14:00", text: "京成 Access 特急 → 成田機場", cat: "transit" },
      { time: "17:55", text: "Depart Tokyo Narita (NRT)", cat: "flight" },
      { time: "21:00", text: "Arrive Taipei (TPE)", cat: "flight" },
    ]
  },
];

const EXTRAS: { text: string; note: string }[] = [
  { text: "", note: "彭姥姥進大東京" },
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
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(31,21,24,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
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

function ExtraItem({ e }: { e: typeof EXTRAS[0] }) {
  const [open, setOpen] = useState(false);
  if (!e.text) return (
    <div style={{ padding: "14px 0", borderBottom: `0.5px solid rgba(31,21,24,0.1)` }}>
      <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{e.note}</p>
    </div>
  );
  return (
    <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "14px 0", borderBottom: `0.5px solid rgba(31,21,24,0.1)`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
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
      <span style={{ fontSize: 10, color: MUTED, opacity: 0.5, paddingTop: 3, marginLeft: 16 }}>{open ? "−" : "+"}</span>
    </div>
  );
}

function GalleryImage({ img, index, onClick, isMobile, isTouch }: { img: GalleryPhoto; index: number; onClick: () => void; isMobile: boolean; isTouch: boolean }) {
  const [active, setActive] = useState(false);
  const handleClick = () => { if (isTouch) { setActive(o => !o); } else { onClick(); } };
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
            <div style={{ fontSize: isMobile ? 8 : 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", marginTop: 3 }}>{img.location}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Tokyo2024() {
  const [lightbox, setLightbox] = useState<string | null>(null);
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
  const col1 = [GALLERY[0], GALLERY[3], GALLERY[6]];
  const col2 = [GALLERY[1], GALLERY[4], GALLERY[7]];
  const col3 = [GALLERY[2], GALLERY[5], GALLERY[8]];
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
            <img src={lightbox} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} alt="" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "14px 20px" : "18px 40px", background: `rgba(244,241,242,0.85)`, backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(31,21,24,0.08)` }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
          {!isMobile && <><a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span><a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span></>}
          {isMobile && <a href="/" style={{ color: MUTED, textDecoration: "none", marginRight: 10 }}>←</a>}
          <span style={{ color: TEXT }}>TOKYO 2024</span>
        </div>
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>MAY 17 – 21, 2024</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", overflow: "hidden", backgroundColor: "#1a0f12", minHeight: HERO_URL ? undefined : (isMobile ? "60vw" : "85vh") }}>
        {HERO_URL && (
          <motion.div style={{ y: heroY }}>
            <img src={HERO_URL} style={{ width: "100%", height: "auto", display: "block" }} alt="" />
          </motion.div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,15,18,0.1) 0%, transparent 30%, rgba(26,15,18,0.55) 70%, rgba(26,15,18,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,15,18,0.35) 0%, transparent 65%)" }} />

        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 20px 32px" : "0 40px 48px", opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ fontSize: "clamp(40px, 6vw, 88px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 20 }}
          >
            Tokyo<br />
            <span style={{ fontSize: "clamp(20px, 3vw, 46px)", color: "rgba(255,255,255,0.6)" }}>Kawaguchiko · Harajuku · Shibuya</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 24 }}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>May 2024</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>5 Days</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>Japan</span>
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(168,96,112,0.25)` }} />
          </div>

          {ITINERARY.map((day, di) => (
            <motion.div
              key={di}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: di * 0.03 }}
              style={{ marginBottom: 52 }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.2em" }}>DAY {day.day}</span>
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

        {/* Travel Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>TRAVEL INFO</span>
            <div style={{ flex: 1, height: 0.5, background: `rgba(168,96,112,0.25)` }} />
          </div>
          {EXTRAS.map((e, i) => <ExtraItem key={i} e={e} />)}
        </motion.div>

        {/* Gallery */}
        {GALLERY.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginBottom: 96 }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: isMobile ? 12 : 32 }}>
              <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>PHOTOGRAPHS</span>
              <div style={{ flex: 1, height: 0.5, background: `rgba(168,96,112,0.25)` }} />
            </div>
            {isTouch && (
              <p style={{ fontSize: 11, color: MUTED, fontStyle: "italic", margin: "0 0 20px", opacity: 0.7 }}>tap to view</p>
            )}
            <div style={{ display: "flex", gap: isMobile ? 6 : 10 }}>
              {[col1, col2, col3].map((col, ci) => (
                <div key={ci} style={{ flex: 1 }}>
                  {col.map((img, i) => img && (
                    <GalleryImage key={i} img={img} index={ci * 4 + i} onClick={() => setLightbox(img.url)} isMobile={isMobile} isTouch={isTouch} />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ borderTop: `0.5px solid rgba(31,21,24,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "16°C — 27°C", sub: "Late spring warmth" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Urban & Fuji", sub: "Neon streets and mountain air" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "May", sub: "Late spring Tokyo" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "WITH", value: "Charlotte", sub: "First trip together" },
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
