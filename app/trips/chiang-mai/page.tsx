"use client";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Item = { time: string; text: string; note?: string; mapUrl?: string; };
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
      { time: "07:20", text: "Depart Taipei" },
      { time: "10:35", text: "Arrive Chiang Mai" },
      { time: "12:00", text: "Check-in · Travelodge Nimman" },
      { time: "14:00", text: "One Nimman", mapUrl: "https://www.google.com/maps/search/One+Nimman+Chiang+Mai", note: "清邁最美紅磚文創區，適合散步拍照。尼曼區算好逛，比古城區環境好，步調舒服，後來覺得住這不錯。" },
      { time: "17:00", text: "Khao Soy Nimman", mapUrl: "https://www.google.com/maps/search/Khao+Soy+Nimman+Chiang+Mai", note: "米其林推薦的泰北咖哩麵。早一點去可以不用排隊，排太久的話我覺得不值得。" },
      { time: "20:00", text: "Nimman House Massage", mapUrl: "https://www.google.com/maps/search/Nimman+House+Massage+Chiang+Mai", note: "就是愛按摩。" },
    ]
  },
  {
    day: 2, date: "Feb 14, Sat", location: "East — Mae Kampong",
    items: [
      { time: "09:00", text: "Private car — East Mountains" },
      { time: "10:30", text: "Mae Kampong Village & Waterfall", mapUrl: "https://www.google.com/maps/search/Mae+Kampong+Chiang+Mai", note: "溪流與森林包圍的百年木造村落，這裡滿不錯的。" },
      { time: "13:00", text: "The Giant Chiang Mai", mapUrl: "https://www.google.com/maps/search/The+Giant+Chiang+Mai", note: "就是一棵大樹。" },
      { time: "18:00", text: "Tong Tem Toh", mapUrl: "https://www.google.com/maps/search/Tong+Tem+Toh+Chiang+Mai", note: "尼曼路超人氣泰北料理，烤豬肉好吃。" },
      { time: "20:00", text: "Sum Bamboo Massage", mapUrl: "https://www.google.com/maps/place/sum+bamboo+massage+(Nimman)", note: "Threads 上非常推的泰式按摩，很道地但很痛，想體驗可以去哈哈。" },
    ]
  },
  {
    day: 3, date: "Feb 15, Sun", location: "Market & Old City",
    items: [
      { time: "09:00", text: "Jing Jai Market", mapUrl: "https://www.google.com/maps/search/Jing+Jai+Market+Chiang+Mai", note: "清邁最美文創早市，算很好逛，環境好。" },
      { time: "14:00", text: "Chedi Luang Temple", note: "選一個夠了。" },
      { time: "17:00", text: "Sunday Walking Street", mapUrl: "https://www.google.com/maps/search/Sunday+Walking+Street+Chiang+Mai", note: "全泰國最大夜市，感受春節熱鬧氣氛。" },
      { time: "18:30", text: "The House by Ginger", mapUrl: "https://www.google.com/maps/search/The+House+by+Ginger+Chiang+Mai", note: "米其林推薦，古城內懷舊風格精緻泰菜。吃完覺得普普，價位高吃氣氛的。" },
      { time: "20:30", text: "Makkha Health & Spa", mapUrl: "https://www.google.com/maps/search/Makkha+Health+Spa+Chiang+Mai", note: "環境很好，按完有芒果糯米飯，可能要早點預約。" },
    ]
  },
  {
    day: 4, date: "Feb 16, Mon", location: "Doi Inthanon — 除夕",
    items: [
      { time: "08:30", text: "Private car — Doi Inthanon" },
      { time: "10:30", text: "Summit & Twin Pagodas", mapUrl: "https://www.google.com/maps/search/Doi+Inthanon+National+Park", note: "雲海花園。" },
      { time: "13:00", text: "Kiew Mae Pan Trail", mapUrl: "https://www.google.com/maps/search/Kiew+Mae+Pan+Trail+Doi+Inthanon", note: "2 小時高山健行，台灣的山比較漂亮哈哈。" },
      { time: "15:30", text: "Wachirathan Falls", mapUrl: "https://www.google.com/maps/search/Wachirathan+Waterfall+Chiang+Mai", note: "瀑布好美。" },
      { time: "18:00", text: "KaPaO Thai Kaprao", mapUrl: "https://www.google.com/maps/place/KaPaO", note: "環境好、便宜、好吃，吃完再去隔壁網美甜點很爽。" },
    ]
  },
  {
    day: 5, date: "Feb 17, Tue", location: "Elephant Park → InterContinental",
    items: [
      { time: "09:00", text: "Elephant Nature Park", mapUrl: "https://www.google.com/maps/search/Elephant+Nature+Park+Chiang+Mai" },
      { time: "14:00", text: "Check-in · InterContinental Mae Ping" },
      { time: "18:00", text: "Little Stove Kitchen", mapUrl: "https://www.google.com/maps/search/Little+Stove+Kitchen+Chiang+Mai", note: "吃膩泰式的話這間海南雞很好吃。" },
    ]
  },
  {
    day: 6, date: "Feb 18, Wed", location: "Free Day",
    items: [
      { time: "—", text: "Hotel, rest & souvenir shopping" },
    ]
  },
  {
    day: 7, date: "Feb 19, Thu", location: "Depart",
    items: [
      { time: "11:50", text: "Depart Chiang Mai" },
      { time: "16:30", text: "Arrive Taipei" },
    ]
  },
];

const EXTRAS = [
  { text: "Currency Exchange — Mr. Pierre", note: "路上很多坑盤子的別亂換，選這間就對了。V.K. Currency Exchange 也還行。" },
  { text: "Anantara Resort", note: "原本很想住，過年被訂滿了。下次來要提前卡位，看起來真的很讚。" },
];

const METADATA = [
  { label: "Temperature", value: "26°C — 31°C" },
  { label: "Currency", value: "Thai Baht (THB)" },
  { label: "Mood", value: "Slow / Warm / Quiet" },
  { label: "Season", value: "Cool Season, Lunar New Year" },
];

function GalleryImage({ img, index }: { img: typeof GALLERY[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", borderRadius: 2, overflow: "hidden", cursor: "zoom-in", marginBottom: 10, breakInside: "avoid" }}
    >
      <img src={img.url} style={{ width: "100%", height: "auto", display: "block", transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: hovered ? "scale(1.03)" : "scale(1)" }} />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 16px" }}
          >
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontStyle: "italic", fontFamily: "Georgia, serif", lineHeight: 1.4 }}>{img.caption}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", marginTop: 4 }}>{img.location}</div>
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
        style={{ display: "flex", gap: 28, padding: "14px 0", borderBottom: `0.5px solid rgba(47,43,39,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "flex-start" }}
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

export default function ChiangMai() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", background: "rgba(244,241,234,0.85)", backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(47,43,39,0.08)` }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
          <a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a>
          <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
          <a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a>
          <span style={{ margin: "0 10px", opacity: 0.4 }}>/</span>
          <span style={{ color: TEXT }}>CHIANG MAI</span>
        </div>
        <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>FEB 13 – 19, 2026</div>
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <motion.div
          style={{ position: "absolute", inset: "-10% 0", backgroundImage: "url(https://res.cloudinary.com/dydhvvubl/image/upload/v1778430032/CM1_syxfa2.jpg)", backgroundSize: "cover", backgroundPosition: "center 30%", y: heroY }}
        />
        {/* Layered overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.75) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />

        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 40px 60px", opacity: heroOpacity }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.3em", marginBottom: 20 }}
          >
            COMPLETED JOURNEY
          </motion.div>

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
          {EXTRAS.map((e, i) => {
            const [open, setOpen] = useState(false);
            return (
              <div key={i} onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "14px 0", borderBottom: `0.5px solid rgba(47,43,39,0.1)`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(156,124,90,0.2)` }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[col1, col2, col3].map((col, ci) => (
              <div key={ci} style={{ flex: 1 }}>
                {col.map((img, i) => (
                  <div key={i} onClick={() => setLightbox(img.url)}>
                    <GalleryImage img={img} index={ci * 3 + i} />
                  </div>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24 }}>
            {METADATA.map((m, i) => (
              <div key={i}>
                <div style={{ fontSize: 9, color: MUTED, letterSpacing: "0.2em", marginBottom: 6, opacity: 0.6 }}>{m.label.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.5 }}>{m.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
