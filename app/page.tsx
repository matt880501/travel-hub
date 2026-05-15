"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
const AmMap = dynamic(() => import("./AmMap"), { ssr: false });
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import * as d3geo from "d3-geo";
import * as topojson from "topojson-client";

type Trip = { id: string; title: string; sub: string; date: string; fullDate: string; startDate: string; status: string; img: string | null; href: string; };
const TRIPS: { year: string; list: Trip[] }[] = [
  {
    year: "2026",
    list: [
      { id: "canada", title: "Canada", sub: "加拿大", date: "Sep, 2026", fullDate: "Sep 17 – Sep 29, 2026", startDate: "2026-09-17", status: "upcoming", img: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778680358/CA1_c2rier.jpg", href: "/trips/canada" },
      { id: "singapore-bintan", title: "Singapore & Bintan", sub: "新加坡 · 民丹島", date: "Jul, 2026", fullDate: "Jul 23 – Jul 28, 2026", startDate: "2026-07-23", status: "next", img: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778602513/Bin1_pjzspe.jpg", href: "/trips/singapore-bintan" },
      { id: "nagoya", title: "Nagoya", sub: "名古屋 · 飛驒高山 · 犬山", date: "Mar, 2026", fullDate: "Feb 27 – Mar 4, 2026", startDate: "2026-02-27", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778669488/NG1_cfqqat.jpg", href: "/trips/nagoya" },
      { id: "chiang-mai", title: "Chiang Mai", sub: "清邁 · 春節", date: "Feb, 2026", fullDate: "Feb 13 – Feb 19, 2026", startDate: "2026-02-13", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778430032/CM1_syxfa2.jpg", href: "/trips/chiang-mai" },
    ],
  },
  {
    year: "2025",
    list: [
      { id: "bohol", title: "Bohol Island", sub: "薄荷島", date: "Oct, 2025", fullDate: "Oct 22 – Oct 26, 2025", startDate: "2025-10-22", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682135/BO1_flckks.jpg", href: "/trips/bohol" },
      { id: "okinawa", title: "Okinawa", sub: "沖繩", date: "Apr, 2025", fullDate: "Apr 11 – Apr 15, 2025", startDate: "2025-04-11", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843907/OKI1_kvpgjq.jpg", href: "/trips/okinawa" },
    ],
  },
  {
    year: "2024",
    list: [
      { id: "australia", title: "Australia", sub: "雪梨 · 墨爾本", date: "Aug, 2024", fullDate: "Aug 17 – Aug 30, 2024", startDate: "2024-08-17", status: "done", img: null, href: "#" },
      { id: "tokyo-2024", title: "Tokyo", sub: "東京", date: "May, 2024", fullDate: "May 17 – May 22, 2024", startDate: "2024-05-17", status: "done", img: null, href: "#" },
    ],
  },
  {
    year: "2023",
    list: [
      { id: "hokkaido", title: "Hokkaido", sub: "北海道", date: "Oct, 2023", fullDate: "Oct 5 – Oct 11, 2023", startDate: "2023-10-05", status: "done", img: null, href: "#" },
    ],
  },
  {
    year: "2020",
    list: [
      { id: "egypt", title: "Egypt", sub: "埃及", date: "Jan, 2020", fullDate: "Jan 23 – Feb 3, 2020", startDate: "2020-01-23", status: "done", img: null, href: "#" },
    ],
  },
  {
    year: "2019",
    list: [
      { id: "austria-czech", title: "Austria & Czech", sub: "奧地利 · 捷克", date: "Feb, 2019", fullDate: "Feb 2 – Feb 10, 2019", startDate: "2019-02-02", status: "done", img: null, href: "#" },
    ],
  },
  {
    year: "2018",
    list: [
      { id: "new-zealand", title: "New Zealand", sub: "紐西蘭", date: "Feb, 2018", fullDate: "Feb 13 – Mar 1, 2018", startDate: "2018-02-13", status: "done", img: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778430033/NZ1_vuque7.jpg", href: "#" },
    ],
  },
];

const MEMORIES = [
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778669488/NG1_cfqqat.jpg", label: "Nagoya · Takayama" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778430032/CM1_syxfa2.jpg", label: "Chiang Mai" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682135/BO1_flckks.jpg", label: "Bohol Island" },
  { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778430033/NZ1_vuque7.jpg", label: "New Zealand" },
];

const VISITED = ["Japan", "Philippines", "Australia", "New Zealand", "Thailand", "Egypt", "Austria", "Czechia", "Czech Republic"];


function WorldMap({ visited, onHover }: {
  visited: string[];
  onHover: (name: string | null, x: number, y: number) => void;
}) {
  const [features, setFeatures] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 300 });

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(world => {
        const feats = (topojson.feature(world, world.objects.countries) as any).features;
        setFeatures(feats);
      });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(containerRef.current);
    if (containerRef.current) {
      setSize({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
    }
    return () => ro.disconnect();
  }, []);

  const projection = d3geo.geoNaturalEarth1()
    .scale(size.w * 0.158)
    .translate([size.w * 0.45, size.h / 2 + size.h * 0.1]);

  const pathGen = d3geo.geoPath().projection(projection);

  const COUNTRY_NAMES: Record<string, string> = {
     "8": "Albania", "12": "Algeria", "24": "Angola",
    "32": "Argentina", "36": "Australia", "40": "Austria", "50": "Bangladesh",
    "56": "Belgium", "64": "Bhutan", "68": "Bolivia", "76": "Brazil",
    "100": "Bulgaria", "104": "Myanmar", "116": "Cambodia", "120": "Cameroon",
    "124": "Canada", "144": "Sri Lanka", "152": "Chile", "156": "China",
    "158": "Taiwan", "170": "Colombia", "178": "Congo", "188": "Costa Rica",
    "191": "Croatia", "192": "Cuba", "196": "Cyprus", "203": "Czechia",
    "208": "Denmark", "218": "Ecuador", "818": "Egypt", "231": "Ethiopia",
    "246": "Finland", "250": "France", "276": "Germany", "288": "Ghana",
    "300": "Greece", "320": "Guatemala", "332": "Haiti", "340": "Honduras",
    "348": "Hungary", "356": "India", "360": "Indonesia", "364": "Iran",
    "368": "Iraq", "372": "Ireland", "376": "Israel", "380": "Italy",
    "388": "Jamaica", "392": "Japan", "400": "Jordan", "398": "Kazakhstan",
    "404": "Kenya", "410": "South Korea", "414": "Kuwait", "418": "Laos",
    "422": "Lebanon", "426": "Lesotho", "434": "Libya", "458": "Malaysia",
    "484": "Mexico", "504": "Morocco", "508": "Mozambique", "524": "Nepal",
    "528": "Netherlands", "554": "New Zealand", "566": "Nigeria", "578": "Norway",
    "586": "Pakistan", "591": "Panama", "598": "Papua New Guinea", "604": "Peru",
    "608": "Philippines", "616": "Poland", "620": "Portugal", "630": "Puerto Rico",
    "642": "Romania", "643": "Russia", "682": "Saudi Arabia", "686": "Senegal",
    "694": "Sierra Leone", "703": "Slovakia", "706": "Somalia", "710": "South Africa",
    "724": "Spain", "729": "Sudan", "752": "Sweden", "756": "Switzerland",
    "760": "Syria", "764": "Thailand", "780": "Trinidad and Tobago", "788": "Tunisia",
    "792": "Turkey", "800": "Uganda", "804": "Ukraine", "784": "United Arab Emirates",
    "826": "United Kingdom", "840": "United States", "858": "Uruguay",
    "860": "Uzbekistan", "862": "Venezuela", "704": "Vietnam", "887": "Yemen",
    "894": "Zambia", "716": "Zimbabwe",
  };

  return (
    <div ref={containerRef} style={{ flex: 1, width: "100%", minHeight: 0, overflow: "hidden" }}>
      <svg width={size.w} height={size.h} style={{ display: "block" }}>
        {features.map((f, i) => {
          const name = COUNTRY_NAMES[String(f.id).padStart(3, "0")] || "";
          const isTaiwan = name === "Taiwan";
          const isVisited = visited.includes(name);
          const d = pathGen(f);
          if (!d) return null;
          return (
            <path
              key={i}
              d={d}
              fill={isTaiwan ? "#826f91" : isVisited ? "#b89b74" : "#181818"}
              stroke={isVisited ? "#d8bc92" : "rgba(255,255,255,0.08)"}
              strokeWidth={isVisited ? 1 : 0.3}
              style={{ cursor: isVisited ? "pointer" : "default", transition: "fill 0.2s" }}
              onMouseEnter={e => { if (isVisited || isTaiwan) { onHover(name, e.clientX, e.clientY); (e.target as SVGPathElement).setAttribute("fill", isVisited ? "#d8bc92" : "#9a85aa"); } }}
              onMouseMove={e => { if (isVisited || isTaiwan) onHover(name, e.clientX, e.clientY); }}
              onMouseLeave={e => { onHover(null, 0, 0); (e.target as SVGPathElement).setAttribute("fill", isTaiwan ? "#826f91" : isVisited ? "#b89b74" : "#181818"); }}
            />
          );
        })}
      </svg>
    </div>
  );
}


function Countdown({ targetDate, compact = false }: { targetDate: Date; compact?: boolean }) {
  const [time, setTime] = useState({ days: 0, hrs: 0, min: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff % 86400000) / 3600000),
        min: Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div style={{ display: "flex", gap: compact ? 4 : 8, background: "rgba(15,15,15,0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: compact ? 12 : 16, padding: compact ? "10px 14px" : "18px 24px" }}>
      {([["days", time.days], ["hrs", time.hrs], ["min", time.min]] as [string, number][]).map(([label, val]) => (
        <div key={label} style={{ textAlign: "center", minWidth: compact ? 34 : 52 }}>
          <div style={{ fontSize: compact ? 22 : 36, fontWeight: 300, color: "#f0ece4", lineHeight: 1, letterSpacing: "-0.02em", fontFamily: "Georgia, serif" }}>
            {String(val).padStart(2, "0")}
          </div>
          <div style={{ fontSize: compact ? 8 : 10, color: "#666", letterSpacing: "0.15em", marginTop: compact ? 3 : 5, textTransform: "uppercase" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [search, setSearch] = useState("");
  const [showMemories, setShowMemories] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTrips, setShowTrips] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [showNext, setShowNext] = useState(true);
  useEffect(() => { setShowNext(Math.random() >= 0.5); }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const today = new Date();
  const upcomingTrip = TRIPS.flatMap(g => g.list)
    .filter(t => t.status === "next" || t.status === "upcoming")
    .map(t => ({ ...t, parsedDate: new Date(t.startDate) }))
    .filter(t => t.parsedDate >= today)
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())[0];

  const lastTrip = TRIPS.flatMap(g => g.list)
    .filter(t => t.status === "done" && t.img)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

  const activeTrip = showNext ? upcomingTrip : lastTrip;
  const heroImg = activeTrip?.img || "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778602513/Bin1_pjzspe.jpg";
  const heroTitle = activeTrip?.title || "Singapore & Bintan";
  const heroFullDate = activeTrip?.fullDate || "Jul 23 – Jul 28, 2026";
  const heroHref = activeTrip?.href || "/trips/singapore-bintan";
  const heroCountdown = upcomingTrip ? new Date(upcomingTrip.startDate) : new Date("2026-07-23");

  const displayTrips = search
    ? TRIPS.map(g => ({ ...g, list: g.list.filter(t => t.title.toLowerCase().includes(search.toLowerCase())) })).filter(g => g.list.length > 0)
    : TRIPS;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#161616", fontFamily: "SF Pro Display, -apple-system, sans-serif", color: "#e8e4dc" }}>

      {/* Mobile top bar */}
      {isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "rgba(22,22,22,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setShowTrips(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ display: "block", width: 18, height: 1.5, background: "#888", borderRadius: 1 }} />
              <span style={{ display: "block", width: 14, height: 1.5, background: "#888", borderRadius: 1 }} />
              <span style={{ display: "block", width: 18, height: 1.5, background: "#888", borderRadius: 1 }} />
            </button>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ece4", letterSpacing: "0.02em" }}>MATT</div>
              <div style={{ fontSize: 9, color: "#c4a882", letterSpacing: "0.18em" }}>TRAVEL ARCHIVE</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowMemories(true)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#888", fontSize: 11 }}>Photos</button>
            <button onClick={() => setShowMap(true)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 12px", cursor: "pointer", color: "#888", fontSize: 11 }}>Map</button>
          </div>
        </div>
      )}

      {/* Mobile trips drawer */}
      {isMobile && (
        <>
          {showTrips && (
            <div onClick={() => setShowTrips(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 250, backdropFilter: "blur(2px)" }} />
          )}
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 260, zIndex: 300, background: "#161616", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", transform: showTrips ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)", overflowY: "auto" }}>
            <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#f0ece4" }}>MATT</div>
                <div style={{ fontSize: 9, color: "#c4a882", letterSpacing: "0.18em" }}>TRAVEL ARCHIVE</div>
              </div>
              <button onClick={() => setShowTrips(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: 20, lineHeight: 1, padding: 4 }}>×</button>
            </div>
            <div style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
              {upcomingTrip && (
                <>
                  <div style={{ padding: "4px 8px 8px", fontSize: 11, color: "#555", letterSpacing: "0.12em" }}>Upcoming</div>
                  <a href={upcomingTrip.href} onClick={() => setShowTrips(false)} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#2a2a2a" }}>
                        {upcomingTrip.img && <img src={upcomingTrip.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "#e8e4dc", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{upcomingTrip.title}</div>
                        <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{upcomingTrip.fullDate}</div>
                      </div>
                      <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(122,158,126,0.15)", color: "#7a9e7e", flexShrink: 0 }}>next</span>
                    </div>
                  </a>
                </>
              )}
              <div style={{ padding: "12px 8px 8px", fontSize: 11, color: "#555", letterSpacing: "0.12em" }}>Trips</div>
              {TRIPS.map(({ year, list }) => (
                <div key={year} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.15em", padding: "2px 10px 6px", fontWeight: 600 }}>{year}</div>
                  {list.map(trip => (
                    <a key={trip.id} href={trip.href} onClick={() => setShowTrips(false)} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 7, marginBottom: 1, borderLeft: trip.id === upcomingTrip?.id ? "2px solid #c4a882" : "2px solid transparent" }}>
                        <div style={{ width: 30, height: 30, borderRadius: 5, overflow: "hidden", flexShrink: 0, background: "#222" }}>
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
          </div>
        </>
      )}

      {/* Map Modal */}
      {showMap && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", flexDirection: "column", backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "20px 16px 12px" : "28px 36px 16px" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#f0ece4", fontFamily: "Georgia, serif" }}>Where I've Been</div>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", marginTop: 4 }}>CLICK A COUNTRY TO EXPLORE</div>
            </div>
            <button onClick={() => setShowMap(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#aaa", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>
            <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale: 145, center: [20, 20] }} width={1200} height={600} style={{ width: "100%", height: "100%" }}>
              <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                {({ geographies }) =>
                  geographies.filter(geo => geo.properties.name !== "Antarctica").map(geo => {
                    const isTaiwan = ["Taiwan", "Taiwan*"].includes(geo.properties.name);
                    const isVisited = VISITED.includes(geo.properties.name);
                    const tripForCountry = TRIPS.flatMap(g => g.list).find(t =>
                      t.title.toLowerCase().includes(geo.properties.name.toLowerCase()) ||
                      geo.properties.name.toLowerCase().includes(t.title.toLowerCase().split(" ")[0])
                    );
                    return (
                      <Geography key={geo.rsmKey} geography={geo}
                        fill={isTaiwan ? "#826f91" : isVisited ? "#b89b74" : "#181818"}
                        stroke={isVisited ? "#d8bc92" : "rgba(255,255,255,0.08)"}
                        strokeWidth={isVisited ? 1.5 : 0.4}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: isVisited ? "#d8bc92" : isTaiwan ? "#9a85aa" : "#2a2a2a", cursor: isVisited ? "pointer" : "default" },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={e => { setHoveredCountry(geo.properties.name); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
                        onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => { if (tripForCountry?.href && tripForCountry.href !== "#") window.location.href = tripForCountry.href; }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
          <div style={{ padding: isMobile ? "12px 16px 20px" : "16px 36px 28px", display: "flex", gap: isMobile ? 8 : 16, flexWrap: "wrap" }}>
            {TRIPS.flatMap(g => g.list).filter(t => t.status === "done").map(t => (
              <a key={t.id} href={t.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "5px 12px 5px 8px" }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, overflow: "hidden", background: "#2a2a2a", flexShrink: 0 }}>
                  {t.img && <img src={t.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
                <span style={{ fontSize: 11, color: "#888" }}>{t.title}</span>
                <span style={{ fontSize: 10, color: "#444" }}>{t.date}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Memories Modal */}
      {showMemories && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", flexDirection: "column", backdropFilter: "blur(8px)" }}
          onClick={() => setShowMemories(false)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "20px 16px 16px" : "28px 36px 20px" }} onClick={e => e.stopPropagation()}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#f0ece4", fontFamily: "Georgia, serif" }}>All Memories</div>
              <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", marginTop: 4 }}>{MEMORIES.length} PHOTOS</div>
            </div>
            <button onClick={() => setShowMemories(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#aaa", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "0 16px 24px" : "0 36px 36px" }} onClick={e => e.stopPropagation()}>
            <div style={{ columns: isMobile ? 2 : 3, gap: 10 }}>
              {MEMORIES.map((m, i) => (
                <div key={i} style={{ breakInside: "avoid", marginBottom: 10, borderRadius: 10, overflow: "hidden" }}>
                  <img src={m.url} alt={m.label} style={{ width: "100%", display: "block" }} />
                  <div style={{ background: "#1a1a1a", padding: "8px 12px", fontSize: 11, color: "#666", letterSpacing: "0.1em" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* tooltip */}
      {hoveredCountry && (
        <div style={{ position: "fixed", left: tooltipPos.x + 12, top: tooltipPos.y - 28, background: "#1a1a1a", color: "#c4a882", fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", pointerEvents: "none", zIndex: 9999 }}>
          {hoveredCountry}
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <div style={{ width: 248, flexShrink: 0, background: "#161616", borderRight: "1px solid rgba(255,255,255,0.06)", display: isMobile ? "none" : "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
        <div style={{ padding: "28px 20px 16px" }}>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "0.02em", color: "#f0ece4" }}>MATT</div>
          <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.18em", marginTop: 2 }}>TRAVEL ARCHIVE</div>
        </div>

        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", padding: "8px 12px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trips..." style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "#aaa", flex: 1 }} />
            <span style={{ fontSize: 10, color: "#444" }}>⌘K</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          {upcomingTrip && (
            <>
              <div style={{ padding: "4px 8px 8px", fontSize: 11, color: "#555", letterSpacing: "0.12em" }}>Upcoming</div>
              <a href={upcomingTrip.href} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, marginBottom: 4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#2a2a2a" }}>
                    {upcomingTrip.img && <img src={upcomingTrip.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "#e8e4dc", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{upcomingTrip.title}</div>
                    <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{upcomingTrip.fullDate}</div>
                  </div>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "rgba(122,158,126,0.15)", color: "#7a9e7e", flexShrink: 0 }}>next</span>
                </div>
              </a>
            </>
          )}

          <div style={{ padding: "12px 8px 8px", fontSize: 11, color: "#555", letterSpacing: "0.12em" }}>Trips</div>
          {displayTrips.map(({ year, list }) => (
            <div key={year} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.15em", padding: "2px 10px 6px", fontWeight: 600 }}>{year}</div>
              {list.map(trip => (
                <a key={trip.id} href={trip.href} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 7, marginBottom: 1, borderLeft: trip.id === upcomingTrip?.id ? "2px solid #c4a882" : "2px solid transparent", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 5, overflow: "hidden", flexShrink: 0, background: "#222" }}>
                      {trip.img && <img src={trip.img} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: trip.id === upcomingTrip?.id ? "#e8e4dc" : "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{trip.title}</div>
                      <div style={{ fontSize: 10, color: "#444", marginTop: 1 }}>{trip.date}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {[
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>, key: "globe" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>, key: "stats" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, key: "heart" },
            { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /></svg>, key: "profile" },
          ].map(({ icon, key }) => (
            <button key={key} style={{ background: "none", border: "none", cursor: "pointer", color: key === "globe" ? "#c4a882" : "#3a3a3a", padding: 4, display: "flex", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#888")}
              onMouseLeave={e => (e.currentTarget.style.color = key === "globe" ? "#c4a882" : "#3a3a3a")}
            >{icon}</button>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", paddingTop: isMobile ? 56 : 0 }}>

        {/* ── HERO ── */}
        <div style={{ position: "relative", height: isMobile ? 380 : 440, backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center 65%", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.3) 60%, rgba(10,10,10,0.1) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 50%)" }} />


          <div style={{ position: "absolute", bottom: isMobile ? 28 : 36, left: isMobile ? 20 : 36, right: isMobile ? 20 : 36, zIndex: 2, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", gap: isMobile ? 16 : 0 }}>
            <div>
              <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.25em", marginBottom: 10, fontWeight: 500 }}>{showNext ? "NEXT TRIP" : "LAST TRIP"}</div>
              <div style={{ fontSize: isMobile ? 36 : 44, fontWeight: 400, color: "#f0ece4", lineHeight: 1.1, letterSpacing: "-0.01em", fontFamily: "Georgia, serif" }}>
                {heroTitle.includes("&") ? (<>{heroTitle.split("&")[0].trim()}<br />&amp; {heroTitle.split("&")[1].trim()}</>) : heroTitle}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <div style={{ fontSize: 13, color: "#bbb" }}>{heroFullDate}</div>
                <a href={heroHref} style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 8 : 12, padding: isMobile ? "12px 16px" : "16px 20px", background: "#161616", flexShrink: 0 }}>
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>, val: "10", label: "Trips" },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>, val: "8", label: "Countries" },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, val: "2018", label: "Since" },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a882" strokeWidth={1.5}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>, val: "NZ", label: "Favorite Place" },
          ].map(({ icon, val, label }) => (
            <div key={label} style={{ background: "#1c1c1c", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
              <span>{icon}</span>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, color: "#f0ece4", fontFamily: "Georgia, serif" }}>{val}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 1, letterSpacing: "0.05em" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAP + MEMORIES ── */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "6fr 4fr", gap: isMobile ? 8 : 12, padding: isMobile ? "0 16px 16px" : "0 20px 20px", alignItems: "start" }}>

          {/* Map */}
          <div style={{ background: "#1c1c1c", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: "16px 16px 0", overflow: "hidden", display: "flex", flexDirection: "column", height: isMobile ? 240 : 390 }}>
            <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.18em", fontWeight: 600, marginBottom: 4 }}>WHERE I&apos;VE BEEN</div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <AmMap onHover={(name, x, y) => { setHoveredCountry(name); if (x && y) setTooltipPos({ x, y }); }} />
            </div>
            <div style={{ padding: "10px 0 14px" }}>
              <button onClick={() => setShowMap(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "7px 16px", cursor: "pointer", color: "#aaa", fontSize: 12 }}>
                Explore Map
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Memories */}
          <div style={{ background: "#1c1c1c", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: "16px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#c4a882", letterSpacing: "0.18em", fontWeight: 600 }}>RECENT MEMORIES</div>
              <span style={{ fontSize: 11, color: "#c4a882", cursor: "pointer" }} onClick={() => setShowMemories(true)}>View all →</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "160px 160px", gap: 6 }}>
              {MEMORIES.slice(0, 4).map((m, i) => (
                <div key={i} style={{ borderRadius: 8, overflow: "hidden", minHeight: 0 }}>
                  <img src={m.url} alt={m.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── QUOTE ── */}
        <div style={{ margin: isMobile ? "0 16px 16px" : "0 20px 20px", background: "#1c1c1c", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: isMobile ? "20px 24px" : "24px 32px", backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778591728/Quote_xmqyit.jpg)", backgroundSize: "cover", backgroundPosition: "center 65%", display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 48, color: "#c4a882", opacity: 0.3, fontFamily: "Georgia, serif", lineHeight: 1, marginTop: -8 }}>&ldquo;</span>
          <div>
            <div style={{ fontSize: 15, color: "#c4a882", fontStyle: "italic", fontFamily: "Georgia, serif" }}>For the moments that stayed.</div>
          </div>
        </div>


      </div>
    </div>
  );
}
