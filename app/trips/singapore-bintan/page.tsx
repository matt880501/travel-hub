"use client";

export default function SingaporeBintan() {
  const itinerary = [
    {
      day: "DAY 1", date: "Jul 23, Thu", location: "Singapore",
      items: [
        { time: "08:05", type: "flight", text: "Depart TPE — CI 0753" },
        { time: "12:35", type: "flight", text: "Arrive SIN" },
        { time: "15:00", type: "hotel", text: "Check-in · Mercure ICON Singapore City Centre" },
        { time: "16:00", type: "place", text: "Merlion Park", url: "https://maps.google.com/?q=Merlion+Park+Singapore" },
        { time: "17:30", type: "place", text: "Marina Bay Sands", url: "https://maps.google.com/?q=Marina+Bay+Sands+Singapore" },
        { time: "19:00", type: "food", text: "Bak Kut Teh dinner" },
        { time: "20:30", type: "place", text: "Gardens by the Bay — OCBC Skyway", url: "https://maps.google.com/?q=Gardens+by+the+Bay+Singapore" },
      ]
    },
    {
      day: "DAY 2", date: "Jul 24, Fri", location: "Singapore → Bintan",
      items: [
        { time: "11:00", type: "hotel", text: "Check-out · Mercure ICON" },
        { time: "12:00", type: "place", text: "Jewel Changi Airport", url: "https://www.jewelchangiairport.com/en/attractions/rain-vortex.html" },
        { time: "14:00", type: "ferry", text: "Ferry · Singapore → Bintan (Business Class)", url: "https://maps.google.com/?q=Tanah+Merah+Ferry+Terminal+Singapore" },
        { time: "16:00", type: "hotel", text: "Check-in · Club Med Bintan Island", url: "https://www.clubmed.com.tw/r/印尼民丹島/y?departure_city=TPE" },
      ]
    },
    {
      day: "DAY 3–6", date: "Jul 25–27", location: "Bintan Island",
      items: [
        { time: "", type: "place", text: "Club Med all-inclusive — beach, pool, activities", url: "https://www.clubmed.com.tw/r/印尼民丹島/y?departure_city=TPE" },
      ]
    },
    {
      day: "DAY 6", date: "Jul 28, Tue", location: "Bintan → TPE",
      items: [
        { time: "08:35", type: "ferry", text: "Ferry · Bintan → Singapore (Business Class)" },
        { time: "13:45", type: "flight", text: "Depart SIN — CI 0754" },
        { time: "18:35", type: "flight", text: "Arrive TPE" },
      ]
    },
  ];

  const daysLeft = Math.ceil((new Date("2026-07-23").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const typeIcon: Record<string, string> = {
    flight: "✈️", ferry: "⛴️", hotel: "🏨", place: "📍", food: "🍜"
  };

  const typeColor: Record<string, string> = {
    flight: "#4a7a8a", ferry: "#4a7a8a", hotel: "#4a7a8a", place: "#333", food: "#7a6040"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#e0ddd6", fontFamily: "-apple-system, Inter, sans-serif", color: "#222" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "0.5px solid #ddd", background: "#e0ddd6" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em" }}>
          <span style={{ color: "#999" }}>MATT</span>
          <span style={{ color: "#ccc", margin: "0 8px" }}>/</span>
          <span style={{ color: "#999" }}>TRAVEL ARCHIVE</span>
          <span style={{ color: "#ccc", margin: "0 8px" }}>/</span>
          <span style={{ color: "#444" }}>SINGAPORE & BINTAN</span>
        </div>
        <div style={{ fontSize: 11, color: "#999", letterSpacing: "0.1em" }}>JUL 23–28, 2026</div>
      </div>

      <div style={{ position: "relative", height: 420, backgroundImage: "url(https://res.cloudinary.com/dydhvvubl/image/upload/v1778430029/Bin1_kryiyj.png)", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end", padding: 40, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, color: "#7a9e7e", letterSpacing: "0.2em", marginBottom: 8 }}>UPCOMING TRIP</div>
          <div style={{ fontSize: 36, fontWeight: 300, color: "#eae7e0", marginBottom: 12 }}>Singapore & Bintan</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["🇸🇬 Singapore", "🇮🇩 Bintan Island", "6 days"].map(tag => (
              <span key={tag} style={{ fontSize: 11, color: "#ddd", border: "0.5px solid rgba(255,255,255,0.3)", padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.08)" }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 24, right: 24, zIndex: 1, textAlign: "right" }}>
          <div style={{ fontSize: 40, fontWeight: 300, color: "#fff", lineHeight: 1 }}>{Math.ceil((new Date("2026-07-23").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.15em", marginTop: 4 }}>DAYS TO GO</div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        {itinerary.map((day, di) => (
          <div key={di} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16, borderBottom: "0.5px solid #e0ddd8", paddingBottom: 10 }}>
              <span style={{ fontSize: 10, color: "#7a9e7e", letterSpacing: "0.15em", fontWeight: 500 }}>{day.day}</span>
              <span style={{ fontSize: 14, color: "#222", fontWeight: 400 }}>{day.date}</span>
              <span style={{ fontSize: 11, color: "#999" }}>· {day.location}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {day.items.map((item, ii) => (
                <div key={ii} style={{ display: "flex", alignItems: "center", gap: 16, padding: "11px 14px", background: "#eae7e0", borderRadius: 6, border: "0.5px solid #e8e5e0" }}>
                  <span style={{ fontSize: 11, color: "#bbb", width: 36, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{item.time}</span>
                  <span style={{ fontSize: 14 }}>{typeIcon[item.type]}</span>
                  {(item as any).url ? (
                    <a href={(item as any).url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: typeColor[item.type], textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <span style={{ borderBottom: "0.5px solid currentColor" }}>{item.text}</span>
                      <span style={{ fontSize: 10, opacity: 0.7 }}>↗</span>
                    </a>
                  ) : (
                    <span style={{ fontSize: 13, color: typeColor[item.type], flex: 1 }}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
