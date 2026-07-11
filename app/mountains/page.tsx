"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { buildPhotoGridShareCard, shareOrCopyLink } from "../shareCard";
import { TOTAL } from "./data";

const HERO_IMG  = "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg";

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

export default function MountainsPage() {
  const [isMobile, setIsMobile]     = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState(MOUNTAIN_PHOTOS);
  const [isTouch, setIsTouch] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
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

  async function handleShare() {
    const blob = await buildPhotoGridShareCard(MOUNTAIN_PHOTOS.map(p => p.url), { kicker: "Matt", title: "Mountain Archive", backdropUrl: HERO_IMG });
    await shareOrCopyLink({
      title: "百岳 — Matt's Mountain Archive",
      text: `${TOTAL} peaks and counting 🏔️`,
      url: window.location.href,
      fileBlob: blob,
      filename: "mountains-story.png",
      fallbackImgUrl: HERO_IMG,
      onFallbackMessage: msg => { setShareMsg(msg); setTimeout(() => setShareMsg(null), 2000); },
    });
  }

  useEffect(() => {
    setGalleryPhotos(pickRandom(MOUNTAIN_PHOTOS, MOUNTAIN_PHOTOS.length));
  }, []);

  return (
    <>
      {shareMsg && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(20,20,20,0.92)", color: "#f0ece4", padding: "8px 16px", borderRadius: 20, fontSize: 12, zIndex: 999, border: "1px solid rgba(255,255,255,0.1)" }}>
          {shareMsg}
        </div>
      )}

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", height: isMobile ? 380 : 460, overflow: "hidden", flexShrink: 0 }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0, top: "-20%", bottom: "-20%" }}>
          <img src={HERO_IMG} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.8) 0%, rgba(10,10,10,0.2) 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 55%)" }} />
        <button
          onClick={handleShare}
          aria-label="Share"
          style={{ position: "absolute", top: isMobile ? 10 : 24, right: isMobile ? 10 : 24, zIndex: 2, width: isMobile ? 26 : 34, height: isMobile ? 26 : 34, borderRadius: "50%", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width={isMobile ? 12 : 15} height={isMobile ? 12 : 15} viewBox="0 0 24 24" fill="none" stroke="#f0ece4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="15" rx="4" /><circle cx="12" cy="13.5" r="4.2" /><path d="M8 6l1.5-2.5h5L16 6" /><circle cx="17.5" cy="9.5" r="0.8" fill="#f0ece4" stroke="none" />
          </svg>
        </button>
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
    </>
  );
}
