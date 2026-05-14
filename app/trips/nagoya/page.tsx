"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Category = "food" | "transit" | "stay" | "sight" | "shop" | "onsen" | "cafe";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: number; date: string; location: string; items: Item[]; };

const ACCENT = "#4d6f8e";
const BG = "#f0f2f4";
const TEXT = "#1b2535";
const MUTED = "#7b8c9e";

const GALLERY: { url: string; caption: string; location: string; }[] = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669510/NGs1_urilkf.jpg", caption: "Shirakawago viewpoint", location: "Shirakawago" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669512/NGs2_odfg7m.jpg", caption: "合掌屋＆樹", location: "Shirakawago" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669508/NGs3_ow4lyu.jpg", caption: "麵屋優光", location: "Nagoya" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669506/NGs4_uhdwbt.jpg", caption: "Mont-bell, Chunichi Building", location: "Nagoya" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669504/NGs5_kzw07l.jpg", caption: "Sakae skyline", location: "Nagoya" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669501/NGs6_v4o9as.jpg", caption: "Onitsuka Tiger Nagoya", location: "Nagoya" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669499/NGs7_gii6og.jpg", caption: "大須大福", location: "Osu" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669497/NGs8_nrritk.jpg", caption: "Tonkatsu MATUMURA", location: "Chunichi Building" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669494/NGs9_lqbzuk.jpg", caption: "Limited Express Hida", location: "en route to Takayama" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669494/NGs10_nelfn3.jpg", caption: "Snoopy Tea House", location: "Takayama Old Town" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669490/NGs11_yvyeu4.jpg", caption: "合掌屋，黃昏", location: "Shirakawago" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669487/NGs12_u85hrv.jpg", caption: "Main road, winter morning", location: "Shirakawago" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669485/NGs13_kvzczc.jpg", caption: "Matsuki-Ushi 松喜うし", location: "Takayama" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669481/NGs14_swkmns.jpg", caption: "Takayama Jinya", location: "Takayama" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669478/NGs15_ror5j0.jpg", caption: "Hida bound for Nagoya", location: "Takayama Station" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669476/NGs16_f9qtav.jpg", caption: "Inuyama Castle", location: "Inuyama" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669475/NGs17_dz0znl.jpg", caption: "Hids' Cafe & Bar", location: "Takayama" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669474/NGs18_baz3jv.jpg", caption: "Takayama Station, after dark", location: "Takayama" },
];

const ITINERARY: Day[] = [
  {
    day: 1, date: "Feb 27, Fri", location: "抵達名古屋 — 榮區",
    items: [
      { time: "14:55", text: "Depart Taipei (TPE)", cat: "transit" },
      { time: "18:30", text: "Arrive Nagoya (NGO)", cat: "transit" },
      { time: "20:25", text: "Check-in · Nishitetsu Hotel Croom Nagoya", mapUrl: "https://www.google.com/maps/search/Nishitetsu+Hotel+Croom+Nagoya", cat: "stay" },
      { time: "20:50", text: "麵屋優光", mapUrl: "https://www.google.com/maps/search/%E9%BA%BA%E5%B1%8B%E5%84%AA%E5%85%89+%E5%90%8D%E5%8F%A4%E5%B1%8B", note: "京都風格貝類高湯拉麵，湯底清澈，第一餐！", cat: "food" },
    ]
  },
  {
    day: 2, date: "Feb 28, Sat", location: "名古屋市區巡禮",
    items: [
      { time: "09:00", text: "Konparu (コンパル) — 榮地下街", mapUrl: "https://www.google.com/maps/search/Konparu+%E3%82%B3%E3%83%B3%E3%83%91%E3%83%AB+%E6%A0%84+%E5%90%8D%E5%8F%A4%E5%B1%8B", note: "炸蝦三明治必點。", cat: "food" },
      { time: "10:30", text: "德川園 Tokugawaen", mapUrl: "https://www.google.com/maps/search/%E5%BE%B3%E5%B7%9D%E5%9C%92+%E5%90%8D%E5%8F%A4%E5%B1%8B", note: "很舒服的地方。", cat: "sight" },
      { time: "12:30", text: "大須商店街 Osu", mapUrl: "https://www.google.com/maps/search/%E5%A4%A7%E9%A0%88%E5%95%86%E5%BA%97%E8%A1%97+%E5%90%8D%E5%8F%A4%E5%B1%8B", note: "大福、章魚燒、二手古著都在這。", cat: "sight" },
      { time: "13:00", text: "大須大福 · 築地銀章魚燒 · Kagawa 烏龍麵", mapUrl: "https://www.google.com/maps/search/%E5%A4%A7%E9%A0%88%E5%A4%A7%E7%A6%8F+%E5%90%8D%E5%8F%A4%E5%B1%8B", cat: "food" },
      { time: "14:30", text: "Nagoya PARCO · Pokémon Center", mapUrl: "https://www.google.com/maps/search/Pokemon+Center+Nagoya", cat: "shop" },
      { time: "15:30", text: "HARBS", mapUrl: "https://www.google.com/maps/search/HARBS+%E5%90%8D%E5%8F%A4%E5%B1%8B", note: "招牌水果千層蛋糕。", cat: "food" },
      { time: "16:00", text: "ALPEN Nagoya 旗艦店", mapUrl: "https://www.google.com/maps/search/ALPEN+Nagoya", cat: "shop" },
      { time: "17:00", text: "LACHIC 百貨", mapUrl: "https://www.google.com/maps/search/LACHIC+%E5%90%8D%E5%8F%A4%E5%B1%8B", cat: "shop" },
      { time: "19:00", text: "Mont-bell Nagoya · Onitsuka Tiger Nagoya", mapUrl: "https://www.google.com/maps/search/Mont-bell+%E5%90%8D%E5%8F%A4%E5%B1%8B", note: "我愛 Mont-bell & 鬼塚虎。", cat: "shop" },
      { time: "20:00", text: "豬排 MATUMURA — 中日大廈", mapUrl: "https://www.google.com/maps/search/MATUMURA+%E3%81%BE%E3%81%A4%E3%82%80%E3%82%89+%E5%90%8D%E5%8F%A4%E5%B1%8B", note: "中日大樓裡的超好吃豬排！！", cat: "food" },
    ]
  },
  {
    day: 3, date: "Mar 1, Sun", location: "名古屋 → 飛驒高山",
    items: [
      { time: "10:00", text: "Snow Peak Eat — 名古屋", mapUrl: "https://www.google.com/maps/search/Snow+Peak+Eat+%E5%90%8D%E5%8F%A4%E5%B1%8B", note: "我愛雪峰。", cat: "cafe" },
      { time: "11:30", text: "Depart Nagoya · JR Limited Express Hida", mapUrl: "https://www.google.com/maps/search/%E5%90%8D%E5%8F%A4%E5%B1%8B%E9%A7%85", note: "特急飛驒號，沿途很美，越往北窗外積雪越深。", cat: "transit" },
      { time: "14:30", text: "Check-in · Tokyu Stay Hida Takayama 結之湯", mapUrl: "https://www.google.com/maps/search/Tokyu+Stay+Hida+Takayama", cat: "stay" },
      { time: "16:30", text: "高山老街初訪 — 三町筋", mapUrl: "https://www.google.com/maps/search/%E9%AB%98%E5%B1%B1%E4%B8%89%E7%94%BA%E7%AD%8B+%E8%80%81%E8%A1%97", note: "今天人超級少，但滿多店家沒開。", cat: "sight" },
      { time: "17:30", text: "丸明燒肉 Maruaki", mapUrl: "https://www.google.com/maps/search/%E4%B8%B8%E6%98%8E+%E9%A3%9B%E9%A9%92%E7%89%9B+%E9%AB%98%E5%B1%B1", note: "飛驒牛壽司配壽喜燒，吃完覺得沒很懂 XD。", cat: "food" },
    ]
  },
  {
    day: 4, date: "Mar 2, Mon", location: "世界遺產 — 白川鄉合掌村",
    items: [
      { time: "09:35", text: "高山濃飛巴士中心 → 白川鄉", mapUrl: "https://www.google.com/maps/search/%E7%99%BD%E5%B7%9D%E9%84%89+%E5%90%88%E6%8E%8C%E9%80%A0+%E5%B2%90%E9%98%9C%E7%B8%A3", note: "從高山搭巴士約 50 分鐘。早班車去觀景台人少，避開觀光團。", cat: "transit" },
      { time: "10:30", text: "荻町城跡觀景台 — 合掌村全景", mapUrl: "https://www.google.com/maps/search/%E8%8D%BB%E7%94%BA%E5%9F%8E%E8%B7%A1%E5%B1%95%E6%9C%9B%E5%8F%B0+%E7%99%BD%E5%B7%9D%E9%84%89", note: "走上來約 10 分鐘，最期待的地方。", cat: "sight" },
      { time: "12:00", text: "村內散策 — 明善寺 · 和田家", mapUrl: "https://www.google.com/maps/search/%E6%98%8E%E5%96%84%E5%AF%BA+%E7%99%BD%E5%B7%9D%E9%84%89", cat: "sight" },
      { time: "14:00", text: "Return bus to Takayama", cat: "transit" },
      { time: "15:00", text: "高山老街", mapUrl: "https://www.google.com/maps/search/%E9%AB%98%E5%B1%B1%E5%B8%82+%E4%B8%89%E7%94%BA%E7%AD%8B", note: "飛驒牛握壽司、史努比茶屋、米飛兔専賣店。", cat: "sight" },
      { time: "18:30", text: "Matsuki-Ushi 松喜うし", mapUrl: "https://www.google.com/maps/search/%E6%9D%BE%E5%96%9C%E3%81%86%E3%81%97+%E9%AB%98%E5%B1%B1", note: "好吃但好貴。", cat: "food" },
    ]
  },
  {
    day: 5, date: "Mar 3, Tue", location: "高山 → 犬山城下町",
    items: [
      { time: "09:00", text: "宮川朝市 Miyagawa Morning Market", mapUrl: "https://www.google.com/maps/search/%E5%AE%AE%E5%B7%9D%E6%9C%9D%E5%B8%82+%E9%AB%98%E5%B1%B1", cat: "sight" },
      { time: "10:30", text: "高山陣屋 Takayama Jinya", mapUrl: "https://www.google.com/maps/search/%E9%AB%98%E5%B1%B1%E9%99%A3%E5%B1%8B", note: "日本唯一完整保存的江戶時代代官所，裡面超大，只能穿襪子腳有夠冷，一路從腳底冷到頭頂＝＝", cat: "sight" },
      { time: "11:00", text: "Hids' Cafe & Bar", mapUrl: "https://www.google.com/maps/search/Hids+cafe+bar+%E9%AB%98%E5%B1%B1", note: "超級讚的早午餐。", cat: "cafe" },
      { time: "12:30", text: "JR 特急飛驒 → 鵜沼 · 轉名鐵犬山線 → 犬山遊園", mapUrl: "https://www.google.com/maps/search/%E7%8A%AC%E5%B1%B1%E9%81%8A%E5%9C%92%E9%A7%85", cat: "transit" },
      { time: "15:00", text: "Check-in · Hotel Indigo Inuyama Urakuen", mapUrl: "https://www.google.com/maps/search/Hotel+Indigo+Inuyama+Urakuen", cat: "stay" },
      { time: "16:00", text: "有樂苑 Urakuen", mapUrl: "https://www.google.com/maps/search/%E6%9C%89%E6%A5%BD%E8%8B%91+%E7%8A%AC%E5%B1%B1", note: "跪著喝茶，假裝自己是日本人。", cat: "sight" },
      { time: "17:30", text: "Unakyu うな久 — 鰻魚飯", mapUrl: "https://www.google.com/maps/search/%E3%81%86%E3%81%AA%E4%B9%85+%E7%8A%AC%E5%B1%B1", note: "我愛鰻魚飯。", cat: "food" },
      { time: "20:00", text: "英迪格精品溫泉", cat: "onsen" },
    ]
  },
  {
    day: 6, date: "Mar 4, Wed", location: "犬山 — 賦歸",
    items: [
      { time: "09:00", text: "慢食早餐 — 飯店內", cat: "food" },
      { time: "11:30", text: "國寶犬山城 · 三光稻荷神社 · 城下町街道", mapUrl: "https://www.google.com/maps/search/%E7%8A%AC%E5%B1%B1%E5%9F%8E+%E5%9C%8B%E5%AF%B6", cat: "sight" },
      { time: "15:00", text: "名鐵 μ-SKY → 中部國際機場 NGO", mapUrl: "https://www.google.com/maps/search/%E4%B8%AD%E9%83%A8%E5%9C%8B%E9%9A%9B%E6%A9%9F%E5%A0%B4", cat: "transit" },
      { time: "19:40", text: "Depart Nagoya (NGO)", cat: "transit" },
      { time: "22:15", text: "Arrive Taipei (TPE)", cat: "transit" },
    ]
  },
];

const EXTRAS: { text: string; note: string }[] = [];

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
  const show = isMobile ? active : active;

  const handleClick = () => {
    if (isMobile) { setActive(o => !o); }
    else { onClick(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.04 }}
      onMouseEnter={() => { if (!isMobile) setActive(true); }}
      onMouseLeave={() => { if (!isMobile) setActive(false); }}
      onClick={handleClick}
      style={{ position: "relative", borderRadius: 2, overflow: "hidden", cursor: isMobile ? "pointer" : "zoom-in", marginBottom: isMobile ? 6 : 10, breakInside: "avoid" }}
    >
      <img src={img.url} style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: (!isMobile && active) ? "scale(1.03)" : "scale(1)" }} />
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
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(27,37,53,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
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

export default function Nagoya() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const col1 = [GALLERY[0], GALLERY[3], GALLERY[6], GALLERY[9], GALLERY[12], GALLERY[15]];
  const col2 = [GALLERY[1], GALLERY[4], GALLERY[7], GALLERY[10], GALLERY[13], GALLERY[16]];
  const col3 = [GALLERY[2], GALLERY[5], GALLERY[8], GALLERY[11], GALLERY[14], GALLERY[17]];

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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "14px 20px" : "18px 40px", background: "rgba(240,242,244,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(27,37,53,0.08)` }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
          {!isMobile && <><a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span><a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span></>}
          {isMobile && <a href="/" style={{ color: MUTED, textDecoration: "none", marginRight: 10 }}>←</a>}
          <span style={{ color: TEXT }}>NAGOYA · TAKAYAMA · INUYAMA</span>
        </div>
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>FEB 27 – MAR 4, 2026</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", overflow: "hidden", backgroundColor: "#0d1a28" }}>
        <motion.div style={{ y: heroY }}>
          <img
            src="https://res.cloudinary.com/dydhvvubl/image/upload/v1778669488/NG1_cfqqat.jpg"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,20,35,0.1) 0%, transparent 30%, rgba(10,20,35,0.55) 70%, rgba(10,20,35,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,20,35,0.35) 0%, transparent 65%)" }} />

        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 20px 32px" : "0 40px 48px", opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ fontSize: "clamp(40px, 6vw, 88px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 20 }}
          >
            Nagoya<br />
            <span style={{ fontSize: "clamp(22px, 3.5vw, 50px)", color: "rgba(255,255,255,0.65)" }}>Takayama · Inuyama</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 24 }}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>Winter 2026</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>6 Days</span>
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(77,111,142,0.2)` }} />
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

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>NOTES</span>
            <div style={{ flex: 1, height: 0.5, background: `rgba(77,111,142,0.2)` }} />
          </div>
          {EXTRAS.map((e, i) => {
            const [open, setOpen] = useState(false);
            return (
              <div key={i} onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "14px 0", borderBottom: `0.5px solid rgba(27,37,53,0.1)`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
          })}
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(77,111,142,0.2)` }} />
          </div>
          <div style={{ display: "flex", gap: isMobile ? 6 : 10 }}>
            {[col1, col2, col3].map((col, ci) => (
              <div key={ci} style={{ flex: 1 }}>
                {col.map((img, i) => (
                  <GalleryImage key={i} img={img} index={ci * 6 + i} onClick={() => setLightbox(img.url)} isMobile={isMobile} />
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
          style={{ borderTop: `0.5px solid rgba(27,37,53,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "2°C — 15°C", sub: "Cold, snow possible" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label: "CURRENCY", value: "JPY", sub: "Japanese Yen" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Quiet / Cold / Layered", sub: "Snow country pace" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "Late Winter", sub: "Hida snow country" },
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
