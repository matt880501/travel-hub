"use client";
import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

export default function Home() {
  const [tooltip, setTooltip] = useState({ show: false, name: "", x: 0, y: 0 });

  const trips = [
    { year: "2026", list: [
      { id: "singapore-bintan", title: "Singapore & Bintan", status: "next" },
      { id: "canada", title: "Canada", status: "upcoming" },
      { id: "nagoya", title: "Nagoya", status: "done" },
      { id: "chiang-mai", title: "Chiang Mai", status: "done", href: "/trips/chiang-mai" },
    ]},
    { year: "2025", list: [
      { id: "bohol", title: "Bohol Island", status: "done" },
      { id: "okinawa", title: "Okinawa", status: "done" },
    ]},
    { year: "2024", list: [
      { id: "australia", title: "Australia (SYD, MEL)", status: "done" },
      { id: "tokyo-2024", title: "Tokyo", status: "done" },
    ]},
    { year: "2018", list: [
      { id: "new-zealand", title: "New Zealand", status: "done" },
    ]},
  ];

  const markers = [
    { name: "Japan", coordinates: [138, 36] },
    { name: "Philippines", coordinates: [122, 13] },
    { name: "Australia", coordinates: [134, -25] },
    { name: "New Zealand", coordinates: [172, -41] },
    { name: "Thailand", coordinates: [101, 15] },
  ];

  const memories = ["🗼", "🌊", "🦘", "🌿", "🍜", "🏔️", "🌅", "✈️"];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#242424", fontFamily: "-apple-system, Inter, sans-serif", color: "#e8e4dc" }}>
      {tooltip.show && (
        <div style={{ position: "fixed", left: tooltip.x + 12, top: tooltip.y - 28, background: "#1e1e1e", color: "#8ab4bc", fontSize: 11, padding: "4px 10px", borderRadius: 4, border: "0.5px solid #333", pointerEvents: "none", zIndex: 9999 }}>
          {tooltip.name}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "0.5px solid #333" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.2em" }}>MATT <span style={{ color: "#444", margin: "0 8px" }}>/</span> TRAVEL ARCHIVE</div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Overview", "Trips", "Map", "Stats"].map(n => (
            <span key={n} style={{ fontSize: 11, color: n === "Overview" ? "#e8e4dc" : "#666", letterSpacing: "0.1em", cursor: "default" }}>{n}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: 220, borderRight: "0.5px solid #333", padding: "20px 0", background: "#1e1e1e", flexShrink: 0 }}>
          {trips.map(({ year, list }) => (
            <div key={year} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.15em", padding: "4px 16px", marginBottom: 8, background: "#2a2a2a" }}>{year}</div>
              {list.map((trip) => (
                <a href={"/trips/" + trip.id} style={{ textDecoration: "none" }}>
                <div key={trip.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "6px 16px", fontSize: 12,
                  color: "#666",
                  background: "transparent",
                  borderLeft: "1.5px solid transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: trip.status === "next" ? "#7a9e7e" : trip.status === "upcoming" ? "transparent" : "#3a3a3a", border: trip.status === "upcoming" ? "0.5px solid #444" : "none", flexShrink: 0 }} />
                    {trip.title}
                  </div>
                  {trip.status === "next" && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: "rgba(122,158,126,0.12)", color: "#7a9e7e" }}>next</span>}
                  {trip.status === "upcoming" && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10, background: "rgba(255,255,255,0.04)", color: "#444" }}>upcoming</span>}
                </div>
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ position: "relative", backgroundImage: "url(/NZ.jpeg)", backgroundSize: "cover", backgroundPosition: "center 85%" }}>
            <div style={{ position: "relative", height: 480, display: "flex", alignItems: "flex-end", padding: 24 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,20,20,0.85) 0%, rgba(20,20,20,0.1) 60%)" }} />
              <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 6, zIndex: 1 }}>
                {["next up", "SG · ID"].map(p => (
                  <span key={p} style={{ fontSize: 10, color: "#7a9e7e", border: "0.5px solid #3a4e3c", padding: "4px 10px", borderRadius: 20, background: "rgba(122,158,126,0.06)" }}>{p}</span>
                ))}
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 10, color: "#7a9e7e", letterSpacing: "0.2em", marginBottom: 6 }}>NEXT TRIP</div>
                <div style={{ fontSize: 22, fontWeight: 400, color: "#e8e4dc", marginBottom: 4 }}>Singapore & Bintan</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>2026 · planning in progress</div>
              </div>
            </div>
            <div style={{ display: "flex", borderTop: "0.5px solid rgba(255,255,255,0.08)", borderBottom: "0.5px solid #333", background: "rgba(15,15,15,0.7)", backdropFilter: "blur(12px)" }}>
              {[["5", "COUNTRIES"], ["7", "TRIPS"], ["27", "AGE"], ["NZ", "FAVOURITE"]].map(([val, label], i) => (
                <div key={label} style={{ flex: 1, padding: "14px 16px", borderRight: i < 3 ? "0.5px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontSize: 18, fontWeight: 400, color: val === "NZ" ? "#7a9e7e" : "#e8e4dc" }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flex: 1, padding: 16, gap: 16 }}>
            <div style={{ flex: 1, border: "0.5px solid #333", borderRadius: 8, background: "#1e1e1e", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 12, left: 14, fontSize: 12, color: "#4a6670", letterSpacing: "0.2em", zIndex: 1, fontWeight: 500 }}>VISITED</div>
              <div style={{ width: "100%", height: "100%" }} onMouseMove={(e) => { if (tooltip.show) setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY })); }}>
                <ComposableMap projection="geoMercator" projectionConfig={{ scale: 155, center: [30, 30] }} style={{ width: "100%", height: "100%" }}>
                  <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                    {({ geographies }) => geographies.filter(geo => geo.properties.name !== "Antarctica").map(geo => {
                      const visited = ["Japan", "Philippines", "Australia", "New Zealand", "Thailand"];
                      const isTaiwan = ["Taiwan", "Taiwan*"].includes(geo.properties.name);
                      const isVisited = visited.includes(geo.properties.name);
                      return <Geography key={geo.rsmKey} geography={geo} fill={isTaiwan ? "#6b5c6e" : isVisited ? "#4a6670" : "#2e2e2e"} stroke="#3a3a3a" strokeWidth={0.5} style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }} />;
                    })}
                  </Geographies>
                  {markers.map(({ name, coordinates }) => (
                    <Marker key={name} coordinates={coordinates as [number, number]}>
                      <circle r={2.5} fill="#8ab4bc" opacity={0.9} style={{ cursor: "pointer" }}
                        onMouseEnter={(e) => setTooltip({ show: true, name, x: e.clientX, y: e.clientY })}
                        onMouseMove={(e) => setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))}
                        onMouseLeave={() => setTooltip(t => ({ ...t, show: false }))}
                      />
                    </Marker>
                  ))}
                </ComposableMap>
              </div>
            </div>
            <div style={{ width: 140, flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.15em", marginBottom: 8 }}>MEMORIES</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                {memories.map(e => (
                  <div key={e} style={{ height: 56, background: "#2a2a2a", borderRadius: 4, border: "0.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{e}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
