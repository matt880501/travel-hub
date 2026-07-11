"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const HERO_IMG  = "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg";
const STRIP_IMG = "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1783683328/%E5%98%89%E6%98%8E%E6%B9%961_bkpcs0.jpg";

const EXPEDITIONS = [
  { label: "武陵四秀",          sub: "Wuling Four Peaks", year: "2025", date: "2025.12", days: "4D3N", img: HERO_IMG,  pos: "center 20%" },
  { label: "嘉明湖、向陽山、三叉山", sub: "Jiaming Lake · Xiangyang · Sancha", year: "2023", date: "2023.6",  days: "3D2N", img: STRIP_IMG, pos: "center 60%" },
  { label: "郡大山",            sub: "Jundashan Peak",    year: "2021", date: "2021.8",  days: "2D1N", img: HERO_IMG,  pos: "center 70%" },
  { label: "玉山主北西",        sub: "Yu Shan",           year: "2021", date: "2021.3",  days: "2D1N", img: STRIP_IMG, pos: "center 30%" },
  { label: "合歡西峰",          sub: "Hehuan West",       year: "2020", date: "2020.6",  days: "1D",   img: HERO_IMG,  pos: "center 50%" },
  { label: "雪山主東",          sub: "Snow Mountain",     year: "2019", date: "2019.7",  days: "2D1N", img: STRIP_IMG, pos: "center 10%" },
  { label: "玉山前峰",          sub: "Yu Shan Front",     year: "2019", date: "2019.4",  days: "1D",   img: HERO_IMG,  pos: "center 40%" },
  { label: "玉山主峰",          sub: "Yu Shan",           year: "2018", date: "2018.6",  days: "2D1N", img: STRIP_IMG, pos: "center 50%" },
  { label: "合歡群峰 & 石門山", sub: "Hehuan Massif",     year: "2017", date: "",  days: "2D1N", img: HERO_IMG,  pos: "center 30%" },
];

const BY_YEAR = Object.entries(
  EXPEDITIONS.reduce<Record<string, typeof EXPEDITIONS>>((acc, e) => {
    (acc[e.year] = acc[e.year] || []).push(e);
    return acc;
  }, {})
).sort(([a], [b]) => Number(b) - Number(a));

const TOTAL = 18;

const MOUNTAIN_PHOTOS: { url: string; caption: string }[] = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693008/Sunrise_efjb6r.jpg", caption: "Sunrise" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg", caption: "月亮的鏡子" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693005/%E4%B8%89%E5%8F%89%E5%B1%B1_uhyola.jpg", caption: "三叉山彩霞" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693004/%E7%8E%89%E5%B1%B1%E4%B8%BB%E5%B3%B0_fmpf3f.jpg", caption: "我就站在玉山主峰" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693003/%E9%9B%AA%E5%B1%B1%E9%BB%91%E6%A3%AE%E6%9E%97_fppdex.jpg", caption: "雪山黑森林" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693002/369%E5%B1%B1%E8%8E%8A_ll84p8.jpg", caption: "369山莊" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693001/%E5%96%AE%E6%94%BB%E9%9B%AA%E4%B8%BB%E6%9D%B1_mrq2fd.jpg", caption: "單攻雪主東" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693001/%E7%8E%89%E5%B1%B1%E8%A5%BF%E5%B3%B0_a48p0j.jpg", caption: "玉山西峰望主峰" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783739593/%E6%B1%A0%E6%9C%89%E6%9C%9B%E5%A4%A7%E9%9C%B8%E5%B0%96_yoisgb.jpg", caption: "池有望大霸尖" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693001/%E5%98%89%E6%98%8E%E6%B9%96%E7%95%94_wlkcv1.jpg", caption: "嘉明湖畔" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693000/%E5%90%88%E6%AD%A1%E8%A5%BF%E5%B3%B0%E6%97%A5%E8%90%BD_y0udsk.jpg", caption: "合歡西日落" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693000/%E5%98%89%E6%98%8E%E6%B9%96%E5%A4%A7%E6%99%AF_bu9ntf.jpg", caption: "嘉明湖全景" },
];

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function GalleryPhotoCard({ photo, isMobile, isTouch }: { photo: { url: string; caption: string }; isMobile: boolean; isTouch: boolean }) {
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseEnter={() => { if (!isTouch) setActive(true); }}
      onMouseLeave={() => { if (!isTouch) setActive(false); }}
      onClick={() => { if (isTouch) setActive(o => !o); }}
      style={{ position: "relative", breakInside: "avoid", marginBottom: isMobile ? 8 : 10, borderRadius: isMobile ? 10 : 12, overflow: "hidden", cursor: isTouch ? "pointer" : "default", WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
    >
      <img src={photo.url} alt={photo.caption} style={{ width: "100%", display: "block", transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: (!isTouch && active) ? "scale(1.06)" : "scale(1)" }} />
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 45%)", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: isMobile ? 10 : 14 }}
          >
            <div style={{ fontSize: isMobile ? 10 : 12, color: "#f0ece4", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1.3, textAlign: "right" }}>{photo.caption}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconTravel({ active }: { active?: boolean }) {
  const c = active ? "#c4a882" : "#555";
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
}
function IconMountain({ active }: { active?: boolean }) {
  const c = active ? "#c4a882" : "#555";
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>;
}

export default function MountainsPage() {
  const [isMobile, setIsMobile]     = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState(MOUNTAIN_PHOTOS);
  const [isTouch, setIsTouch] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setIsTouch(navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    setGalleryPhotos(pickRandom(MOUNTAIN_PHOTOS, MOUNTAIN_PHOTOS.length));
  }, []);

  const NAV = [
    { label: "TRAVEL",    href: "/",          icon: IconTravel },
    { label: "MOUNTAINS", href: "/mountains", icon: IconMountain, active: true },
  ];

  const SidebarInner = ({ onNav }: { onNav?: () => void }) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Nav */}
      <div style={{ padding: "0 8px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
        {NAV.map(({ label, href, icon: Icon, active }) => (
          <a key={label} href={href} onClick={onNav} style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "7px 12px", borderRadius: 8, marginBottom: 1,
              background: active ? "rgba(196,168,130,0.1)" : "transparent",
              border: `1px solid ${active ? "rgba(196,168,130,0.15)" : "transparent"}`,
            }}>
              <Icon active={active} />
              <span style={{ fontSize: 12, color: active ? "#c4a882" : "#555", letterSpacing: "0.08em", fontWeight: active ? 500 : 400 }}>{label}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Peaks list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        <div style={{ padding: "12px 8px 6px", fontSize: 11, color: "#555", letterSpacing: "0.12em" }}>PEAKS</div>
        {BY_YEAR.map(([year, exps]) => (
          <div key={year} style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.15em", padding: "2px 10px 4px", fontWeight: 600 }}>{year === "2017" ? "Before 2017" : year}</div>
            {exps.map(exp => (
              <div key={exp.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 6 }}>
                <svg width={10} height={10} viewBox="0 0 10 10"><polygon points="5,0 10,10 0,10" fill="#c4a882" opacity={0.7} /></svg>
                <span style={{ fontSize: 11, color: "#777", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{exp.label}</span>
                <span style={{ fontSize: 10, color: "#3a3a3a", flexShrink: 0 }}>{exp.date}</span>
              </div>
            ))}
          </div>
        ))}
        <div style={{ padding: "4px 10px 16px", fontSize: 11, color: "#3a3a3a" }}>...</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#161616", fontFamily: "SF Pro Display, -apple-system, sans-serif", color: "#e8e4dc" }}>

      {/* Mobile top bar */}
      {isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "rgba(22,22,22,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setShowDrawer(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "block", width: 18, height: 1.5, background: "#888", borderRadius: 1 }} />
              <span style={{ display: "block", width: 14, height: 1.5, background: "#888", borderRadius: 1 }} />
              <span style={{ display: "block", width: 18, height: 1.5, background: "#888", borderRadius: 1 }} />
            </button>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ece4" }}>MATT</div>
              <div style={{ fontSize: 9, color: "#c4a882", letterSpacing: "0.18em" }}>MOUNTAINS</div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <>
          {showDrawer && <div onClick={() => setShowDrawer(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 250, backdropFilter: "blur(2px)" }} />}
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 260, zIndex: 300, background: "#161616", borderRight: "1px solid rgba(255,255,255,0.06)", transform: showDrawer ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ece4" }}>MATT</div>
                <div style={{ fontSize: 9, color: "#c4a882", letterSpacing: "0.18em" }}>ARCHIVE</div>
              </div>
              <button onClick={() => setShowDrawer(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <SidebarInner onNav={() => setShowDrawer(false)} />
            </div>
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      <div style={{ width: 248, flexShrink: 0, background: "#161616", borderRight: "1px solid rgba(255,255,255,0.06)", display: isMobile ? "none" : "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
        <div style={{ padding: "28px 20px 20px", flexShrink: 0 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "#f0ece4" }}>MATT</div>
            <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.18em", marginTop: 2 }}>ARCHIVE</div>
          </a>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <SidebarInner />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", paddingTop: isMobile ? 56 : 0 }}>

        {/* Hero */}
        <div ref={heroRef} style={{ position: "relative", height: isMobile ? 380 : 460, overflow: "hidden", flexShrink: 0 }}>
          <motion.div style={{ y: heroY, position: "absolute", inset: 0, top: "-20%", bottom: "-20%" }}>
            <img src={HERO_IMG} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
          </motion.div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.2) 70%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: isMobile ? 24 : 32, left: isMobile ? 20 : 32, zIndex: 2 }}>
            <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.25em", marginBottom: 10, fontWeight: 500 }}>MOUNTAIN ARCHIVE</div>
            <div style={{ fontSize: isMobile ? 32 : 46, fontWeight: 400, color: "#f0ece4", lineHeight: 1.05, letterSpacing: "-0.01em", fontFamily: "Georgia, serif" }}>
              百岳
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? 8 : 12, padding: isMobile ? "12px 16px" : "16px 20px", background: "#161616", flexShrink: 0 }}>
          {[
            { icon: <svg width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><path d="M3 20L9 8l4 6 3-4 5 10H3z" /></svg>, val: `${TOTAL}`, label: "Peaks" },
            { icon: <svg width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} viewBox="0 0 24 24" fill="#c4a882" stroke="none"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" /></svg>, val: "3,952 m", label: "Highest · 玉山主峰" },
            { icon: <svg width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, val: "嘉明湖", label: "Favorite" },
          ].map(({ icon, val, label }) => (
            <div key={label} style={{ background: "#1c1c1c", borderRadius: 12, padding: isMobile ? "10px 8px" : "16px 18px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: isMobile ? 6 : 14 }}>
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 14 : 22, fontWeight: 500, color: "#f0ece4", fontFamily: "Georgia, serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{val}</div>
                <div style={{ fontSize: isMobile ? 8.5 : 11, color: "#555", marginTop: 1, letterSpacing: "0.05em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div style={{ padding: isMobile ? "8px 16px 24px" : "12px 20px 24px" }}>
          <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.18em", fontWeight: 600, marginBottom: 12 }}>GALLERY</div>
          <div style={{ columns: isMobile ? 2 : 3, gap: isMobile ? 8 : 10 }}>
            {galleryPhotos.map((p, i) => (
              <GalleryPhotoCard key={i} photo={p} isMobile={isMobile} isTouch={isTouch} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
