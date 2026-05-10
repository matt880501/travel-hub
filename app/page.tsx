"use client";
import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const TRIPS = [
  {
    year: "2026",
    list: [
      { id: "canada", title: "Canada", date: "Sep 17 – Sep 29, 2026", status: "upcoming", img: null, href: "#" },
      { id: "singapore-bintan", title: "Singapore & Bintan", date: "Jul 23 – Jul 28, 2026", status: "next", img: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430029/Bin1_kryiyj.png", href: "/trips/singapore-bintan" },
      { id: "nagoya", title: "Nagoya", date: "Feb 27 – Mar 4, 2026", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430734/NG1_czhase.jpg", href: "#" },
      { id: "chiang-mai", title: "Chiang Mai", date: "Feb 13 – Feb 19, 2026", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430032/CM1_syxfa2.jpg", href: "/trips/chiang-mai" },
    ],
  },
  {
    year: "2025",
    list: [
      { id: "bohol", title: "Bohol Island", date: "Oct 22 – Oct 26, 2025", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430733/BO1_lbvlfo.jpg", href: "#" },
      { id: "okinawa", title: "Okinawa", date: "Apr 11 – Apr 15, 2025", status: "done", img: null, href: "#" },
    ],
  },
  {
    year: "2024",
    list: [
      { id: "australia", title: "Australia (SYD, MEL)", date: "Aug 17 – Aug 30, 2024", status: "done", img: null, href: "#" },
      { id: "tokyo-2024", title: "Tokyo", date: "May 17 – May 22, 2024", status: "done", img: null, href: "#" },
    ],
  },
  {
    year: "2018",
    list: [
      { id: "new-zealand", title: "New Zealand", date: "Feb 13 – Mar 1, 2018", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430033/NZ1_vuque7.jpg", href: "#" },
    ],
  },
];

const MEMORIES = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430032/CM1_syxfa2.jpg", label: "Chiang Mai" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430029/Bin1_kryiyj.png", label: "Bintan" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430033/NZ1_vuque7.jpg", label: "New Zealand" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430733/BO1_lbvlfo.jpg", label: "Bohol Island" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430734/NG1_czhase.jpg", label: "Nagoya" },
];

const MARKERS: { name: string; coordinates: [number, number] }[] = [
  { name: "Japan", coordinates: [138, 36] },
  { name: "Philippines", coordinates: [122, 13] },
  { name: "Australia", coordinates: [134, -25] },
  { name: "New Zealand", coordinates: [172, -41] },
  { name: "Thailand", coordinates: [101, 15] },
  { name: "Singapore", coordinates: [103.8, 1.35] },
];

function Countdown({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState({ days: 0, hrs: 0, min: 0, sec: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff % 86400000) / 3600000),
        min: Math.floor((diff % 3600000) / 60000),
        sec: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div style={{
      display: "flex", gap: 4, background: "rgba(20,20,20,0.75)",
      backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "20px 24px",
    }}>
      {[["days", time.days], ["hrs", time.hrs], ["min", time.min]].map(([label, val]) => (
        <div key={label as string} style={{ textAlign: "center", minWidth: 56 }}>
          <div style={{ fontSize: 38, fontWeight: 300, color: "#f0ece4", lineHeight: 1, letterSpacing: "-0.02em", fontFamily: "'Georgia', serif" }}>
            {String(val).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.15em", marginTop: 6, textTransform: "uppercase" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [tooltip, setTooltip] = useState({ show: false, name: "", x: 0, y: 0 });
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");

  const today = new Date();
  const upcomingTrip = TRIPS.flatMap(g => g.list).find(t => t.status === "next");

  const nextTrip = new Date("2026-07-23T08:00:00");

  const filtered = TRIPS.map(g => ({
    ...g,
    list: g.list.filter(t => t.title.toLowerCase().includes(search.toLowerCase())),
  })).filter(g => g.list.length > 0);

  const displayTrips = search ? filtered : TRIPS;

  return (
    <div style={{
      display: "flex", flexDirection: "column", minHeight: "100vh",
      background: "#161616", fontFamily: "'SF Pro Display', -apple-system, sans-serif",
      color: "#e8e4dc",
    }}>
      {tooltip.show && (
        <div style={{
          position: "fixed", left: tooltip.x + 12, top: tooltip.y - 28,
          background: "#1a1a1a", color: "#c4a882", fontSize: 11,
          padding: "4px 10px", borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none", zIndex: 9999,
        }}>
          {tooltip.name}
        </div>
      )}

      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: 248, flexShrink: 0, background: "#111", borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column",
        }}>
          {/* Logo */}
          <div style={{ padding: "28px 20px 20px" }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "#f0ece4" }}>MATT</div>
            <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.18em", marginTop: 2 }}>TRAVEL ARCHIVE</div>
          </div>

          {/* Search */}
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.06)", padding: "8px 12px",
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search trips..."
                style={{
                  background: "none", border: "none", outline: "none",
                  fontSize: 12, color: "#aaa", flex: 1, letterSpacing: "0.02em",
                }}
              />
              <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.05em" }}>⌘K</span>
            </div>
          </div>

          {/* Trip list */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
            {/* Upcoming pinned */}
            {upcomingTrip && (
              <>
                <div style={{ padding: "4px 8px 8px", fontSize: 11, color: "#555", letterSpacing: "0.12em" }}>Upcoming</div>
                <a href={upcomingTrip.href} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                    borderRadius: 8, marginBottom: 4,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#2a2a2a" }}>
                      {upcomingTrip.img && <img src={upcomingTrip.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: "#e8e4dc", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{upcomingTrip.title}</div>
                      <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{upcomingTrip.date}</div>
                    </div>
                    <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(122,158,126,0.15)", color: "#7a9e7e", flexShrink: 0 }}>{upcomingTrip.status}</span>
                  </div>
                </a>
              </>
            )}

            {/* All trips */}
            <div style={{ padding: "12px 8px 8px", fontSize: 11, color: "#555", letterSpacing: "0.12em" }}>Trips</div>
            {displayTrips.map(({ year, list }) => (
              <div key={year} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.15em", padding: "2px 10px 6px", fontWeight: 600 }}>{year}</div>
                {list.map(trip => (
                  <a key={trip.id} href={trip.href} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "7px 10px", borderRadius: 7, marginBottom: 1,
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 5, overflow: "hidden", flexShrink: 0,
                        background: "#222",
                      }}>
                        {trip.img && <img src={trip.img} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trip.title}</div>
                        <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>{trip.date}</div>
                      </div>
                      
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          <div style={{
            display: "flex", justifyContent: "space-around", padding: "14px 16px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>, key: "globe" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>, key: "stats" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, key: "heart" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg>, key: "profile" },
            ].map(({ icon, key }) => (
              <button key={key} style={{
                background: "none", border: "none", cursor: "pointer",
                color: key === "globe" ? "#c4a882" : "#3a3a3a",
                padding: 4, display: "flex", transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#888")}
                onMouseLeave={e => (e.currentTarget.style.color = key === "globe" ? "#c4a882" : "#3a3a3a")}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>

          {/* ── HERO ── */}
          <div style={{
            position: "relative", height: 420,
            backgroundImage: "url(https://res.cloudinary.com/dydhvvubl/image/upload/v1778430029/Bin1_kryiyj.png)",
            backgroundSize: "cover", backgroundPosition: "center",
            flexShrink: 0,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.7) 70%, rgba(10,10,10,0.95) 100%)" }} />

            {/* Top-right controls */}
            <div style={{ position: "absolute", top: 20, right: 24, display: "flex", alignItems: "center", gap: 12, zIndex: 2 }}>
              <span style={{ fontSize: 18 }}>🌙</span>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #c4a882, #8a7060)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600, color: "#fff",
                border: "2px solid rgba(255,255,255,0.15)",
              }}>M</div>
            </div>

            {/* Content */}
            <div style={{
              position: "absolute", bottom: 36, left: 36, right: 36, zIndex: 2,
              display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.25em", marginBottom: 10, fontWeight: 500 }}>NEXT TRIP</div>
                <div style={{ fontSize: 42, fontWeight: 400, color: "#f0ece4", lineHeight: 1.1, letterSpacing: "-0.01em", fontFamily: "'Georgia', serif" }}>
                  Singapore<br />&amp; Bintan
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                  <div style={{ fontSize: 13, color: "#bbb" }}>Jul 23 – Jul 28, 2026</div>
                  <a href="/trips/singapore-bintan" style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
              <Countdown targetDate={nextTrip} />
            </div>
          </div>

          {/* ── STATS ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12, padding: "16px 20px",
            background: "#161616", flexShrink: 0,
          }}>
            {[
              { icon: "✈️", val: "7", label: "Trips Taken" },
              { icon: "🌍", val: "5", label: "Countries Visited" },
              { icon: "📅", val: "45+", label: "Days Traveled" },
              { icon: "❤️", val: "NZ", label: "Favorite Place" },
            ].map(({ icon, val, label }) => (
              <div key={label} style={{
                background: "#1c1c1c", borderRadius: 12, padding: "16px 18px",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 500, color: "#f0ece4", fontFamily: "'Georgia', serif" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 1, letterSpacing: "0.05em" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── MAP + MEMORIES ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 420px",
            gap: 12, padding: "0 20px 20px",
          }}>
            {/* Map */}
            <div style={{
              background: "#1c1c1c", borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 16px 0", overflow: "hidden",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.18em", fontWeight: 600 }}>WHERE I&apos;VE BEEN</div>
              </div>
              <div style={{ height: 360, width: "100%" }} onMouseMove={(e) => { if (tooltip.show) setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY })); }}>
                <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale: 130, center: [10, 10] }} width={800} height={260} style={{ width: "100%", height: "100%" }}>
                  <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                    {({ geographies }) =>
                      geographies.filter(geo => geo.properties.name !== "Antarctica").map(geo => {
                        const visited = ["Japan", "Philippines", "Australia", "New Zealand", "Thailand", "Singapore"];
                        const isTaiwan = ["Taiwan", "Taiwan*"].includes(geo.properties.name);
                        const isVisited = visited.includes(geo.properties.name);
                        return (
                          <Geography key={geo.rsmKey} geography={geo}
                            fill={isTaiwan ? "#6b5c6e" : isVisited ? "#c4a882" : "#242424"}
                            stroke="#1c1c1c" strokeWidth={0.5}
                            style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }}
                          />
                        );
                      })
                    }
                  </Geographies>
                  {MARKERS.map(({ name, coordinates }) => (
                    <Marker key={name} coordinates={coordinates}>
                      <circle r={3} fill="#f0ece4" opacity={0.9} style={{ cursor: "pointer" }}
                        onMouseEnter={e => setTooltip({ show: true, name, x: e.clientX, y: e.clientY })}
                        onMouseMove={e => setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))}
                        onMouseLeave={() => setTooltip(t => ({ ...t, show: false }))}
                      />
                    </Marker>
                  ))}
                </ComposableMap>
              </div>
              <div style={{ padding: "10px 0 14px" }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20, padding: "7px 16px", cursor: "pointer", color: "#aaa", fontSize: 12,
                }}>
                  Explore Map
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Memories */}
            <div style={{
              background: "#1c1c1c", borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "16px", display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.18em", fontWeight: 600 }}>RECENT MEMORIES</div>
                <span style={{ fontSize: 11, color: "#c4a882", cursor: "pointer" }}>View all</span>
              </div>
              {/* 2 large + 3 small grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, flex: 1 }}>
                {MEMORIES.slice(0, 2).map((m, i) => (
                  <div key={i} style={{ borderRadius: 8, overflow: "hidden", height: 130 }}>
                    <img src={m.url} alt={m.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
                {MEMORIES.slice(2, 5).map((m, i) => (
                  <div key={i} style={{ borderRadius: 8, overflow: "hidden", height: 90 }}>
                    <img src={m.url} alt={m.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── QUOTE BANNER ── */}
          <div style={{
            margin: "0 20px 20px",
            background: "#1c1c1c",
            borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
            padding: "24px 32px",
            backgroundImage: "linear-gradient(135deg, rgba(196,168,130,0.04) 0%, transparent 60%)",
            display: "flex", alignItems: "center", gap: 20,
            overflow: "hidden", position: "relative",
          }}>
            <span style={{ fontSize: 48, color: "#c4a882", opacity: 0.3, fontFamily: "Georgia, serif", lineHeight: 1, marginTop: -8 }}>&ldquo;</span>
            <div>
              <div style={{ fontSize: 15, color: "#c4a882", fontStyle: "italic", fontFamily: "Georgia, serif", fontWeight: 400 }}>
                We travel not to escape life, but for life not to escape us.
              </div>
              <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.15em", marginTop: 6 }}>UNKNOWN</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
