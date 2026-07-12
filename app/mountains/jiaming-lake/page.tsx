"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildPhotoGridShareCard, shareOrCopyLink } from "../../shareCard";

const HERO_IMG = "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg";

const GALLERY: { url: string; caption: string }[] = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693008/Sunrise_efjb6r.jpg", caption: "Sunrise" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693005/%E4%B8%89%E5%8F%89%E5%B1%B1_uhyola.jpg", caption: "三叉山彩霞" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693001/%E5%98%89%E6%98%8E%E6%B9%96%E7%95%94_wlkcv1.jpg", caption: "嘉明湖畔" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693000/%E5%98%89%E6%98%8E%E6%B9%96%E5%A4%A7%E6%99%AF_bu9ntf.jpg", caption: "嘉明湖全景" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783778106/IMG_5036_wzavtu.jpg", caption: "Trail" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783778880/IMG_5176_z9113f.jpg", caption: "霧起時" },
];

const ROUTE = [
  { day: "DAY 1", text: "林道登山口 → 向陽山屋 → 向陽山 → 三叉路 → 嘉明湖避難山屋" },
  { day: "DAY 2", text: "山屋出發 → 三叉山 → 嘉明湖叉路 → 嘉明湖 → 避難山屋 → 向陽山屋 → 登山口" },
];

const STATS = [
  { label: "Total Distance", value: "31.42 km" },
  { label: "Total Elevation Gain", value: "2,162 m" },
  { label: "Highest Point", value: "3,603 m" },
  { label: "Moving Time", value: "10–12 hr" },
];

const HERO_STATS = [
  { icon: (s: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><path d="M3 20L9 8l4 6 3-4 5 10H3z" /></svg>, value: "3,603 m", label: "Elevation" },
  { icon: (s: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>, value: "2 Days", label: "Duration" },
  { icon: (s: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 9h18" /></svg>, value: "2023.6", label: "Date" },
];

function GalleryPhoto({ photo, isMobile, isTouch }: { photo: { url: string; caption: string }; isMobile: boolean; isTouch: boolean }) {
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseEnter={() => { if (!isTouch) setActive(true); }}
      onMouseLeave={() => { if (!isTouch) setActive(false); }}
      onClick={() => { if (isTouch) setActive(o => !o); }}
      style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: isMobile ? 10 : 12, overflow: "hidden", cursor: isTouch ? "pointer" : "default" }}
    >
      <img src={photo.url} alt={photo.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: (!isTouch && active) ? "scale(1.06)" : "scale(1)" }} />
      <AnimatePresence>
        {active && photo.caption && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 45%)", display: "flex", alignItems: "flex-end", padding: isMobile ? 10 : 14 }}
          >
            <div style={{ fontSize: isMobile ? 10 : 12, color: "#f0ece4", fontFamily: "Georgia, serif", fontStyle: "italic" }}>{photo.caption}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JiamingLakePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

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
    const photos = [HERO_IMG, ...GALLERY.map(g => g.url)];
    const blob = await buildPhotoGridShareCard(photos, { kicker: "MOUNTAIN ARCHIVE", title: "嘉明湖、向陽山、三叉山", titleMaxSize: 34, titleMinSize: 18, cols: 2, rows: 3, backdropUrl: HERO_IMG, footerTop: `總距離 ${STATS[0].value}`, footerBottom: `總爬升 ${STATS[1].value}`, footerBottomMuted: true });
    await shareOrCopyLink({
      title: "嘉明湖 — Matt's Mountain Archive",
      text: "2023.6 — 向陽山、三叉山、嘉明湖",
      url: window.location.href,
      fileBlob: blob,
      filename: "jiaming-lake-story.png",
      fallbackImgUrl: HERO_IMG,
      onFallbackMessage: msg => { setShareMsg(msg); setTimeout(() => setShareMsg(null), 2000); },
    });
  }

  const sectionLabel: React.CSSProperties = { fontSize: 11, color: "#c4a882", letterSpacing: "0.18em", fontWeight: 600, marginBottom: 14 };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "0 16px" : "0 20px", width: "100%" }}>
      {shareMsg && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(20,20,20,0.92)", color: "#f0ece4", padding: "8px 16px", borderRadius: 20, fontSize: 12, zIndex: 999, border: "1px solid rgba(255,255,255,0.1)" }}>
          {shareMsg}
        </div>
      )}

      {/* Back link */}
      <div style={{ padding: isMobile ? "14px 0 0" : "20px 0 0" }}>
        <a href="/mountains" style={{ fontSize: 12, color: "#777", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
          ← Back to Peaks
        </a>
      </div>

      {/* Hero — full uncropped photo, stats overlaid at the bottom */}
      <div style={{ position: "relative", overflow: "hidden", margin: isMobile ? "12px 0 0" : "16px 0 0", borderRadius: 16 }}>
        <img src={HERO_IMG} style={{ width: "100%", height: "auto", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.15) 45%, transparent 65%)" }} />
        <button
          onClick={handleShare}
          aria-label="Share"
          style={{ position: "absolute", top: isMobile ? 10 : 20, right: isMobile ? 10 : 20, zIndex: 2, width: isMobile ? 26 : 34, height: isMobile ? 26 : 34, borderRadius: "50%", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width={isMobile ? 12 : 15} height={isMobile ? 12 : 15} viewBox="0 0 24 24" fill="none" stroke="#f0ece4" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="15" rx="4" /><circle cx="12" cy="13.5" r="4.2" /><path d="M8 6l1.5-2.5h5L16 6" /><circle cx="17.5" cy="9.5" r="0.8" fill="#f0ece4" stroke="none" />
          </svg>
        </button>
        <div style={{ position: "absolute", bottom: isMobile ? 14 : 26, right: isMobile ? 14 : 28, textAlign: "right" }}>
          <div style={{ fontSize: isMobile ? 20 : 44, fontWeight: 400, color: "#f0ece4", lineHeight: 1.05, fontFamily: "Georgia, serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>嘉明湖</div>
          <div style={{ fontSize: isMobile ? 10 : 15, color: "rgba(240,236,228,0.7)", marginTop: isMobile ? 3 : 6, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>Jiaming Lake</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: isMobile ? 10 : 32, marginTop: isMobile ? 8 : 22 }}>
            {HERO_STATS.map(({ icon, value, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 8, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                {icon(isMobile ? 11 : 16)}
                <div>
                  <div style={{ fontSize: isMobile ? 10 : 16, color: "#f0ece4", fontFamily: "Georgia, serif" }}>{value}</div>
                  <div style={{ fontSize: isMobile ? 7 : 9.5, color: "rgba(240,236,228,0.6)", letterSpacing: "0.08em" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overview + Route / Itinerary, with stats aligned to the top of Overview */}
      <div style={{ padding: isMobile ? "24px 0 24px" : "32px 0 32px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", gap: isMobile ? 20 : 40 }}>
        <div>
          <div style={sectionLabel}>OVERVIEW</div>
          <p style={{ fontSize: isMobile ? 14 : 15, color: "rgba(232,228,220,0.85)", lineHeight: 1.8, maxWidth: 680 }}>
            嘉明湖，天使的眼淚，但我更喜歡月亮的鏡子這名字。
            <br /><br />
            何等運氣遇上日出大景，我坐在湖邊一待就是兩小時，看著湖面漸變的顏色，捨不得走。
          </p>

          <div style={{ marginTop: isMobile ? 24 : 32 }}>
            <div style={sectionLabel}>ROUTE / ITINERARY</div>
            <div style={{ position: "relative", paddingLeft: 20 }}>
              <div style={{ position: "absolute", left: 3, top: 6, bottom: 6, width: 1, background: "rgba(196,168,130,0.25)" }} />
              {ROUTE.map(r => (
                <div key={r.day} style={{ position: "relative", marginBottom: 20 }}>
                  <div style={{ position: "absolute", left: -20, top: 4, width: 7, height: 7, borderRadius: "50%", background: "#c4a882" }} />
                  <div style={{ fontSize: 10, color: "#c4a882", letterSpacing: "0.12em", marginBottom: 6 }}>{r.day}</div>
                  <div style={{ fontSize: isMobile ? 13 : 14, color: "rgba(232,228,220,0.85)", lineHeight: 1.6 }}>{r.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: "#1c1c1c", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", padding: isMobile ? "16px 18px" : "20px 22px", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: isMobile ? 16 : 20, alignContent: "flex-start", height: "fit-content" }}>
          {STATS.map(s => (
            <div key={s.label} style={{ minWidth: isMobile ? "40%" : "100%" }}>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.05em", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: isMobile ? 15 : 18, color: "#f0ece4", fontFamily: "Georgia, serif" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div style={{ padding: isMobile ? "0 0 32px" : "0 0 40px" }}>
        <div style={sectionLabel}>GALLERY</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: isMobile ? 8 : 10 }}>
          {GALLERY.map((p, i) => (
            <GalleryPhoto key={i} photo={p} isMobile={isMobile} isTouch={isTouch} />
          ))}
        </div>
      </div>
    </div>
  );
}
