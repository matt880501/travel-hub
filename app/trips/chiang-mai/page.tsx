"use client";
import { useState } from "react";

type Item = { time: string; type: string; text: string; note?: string; };
type Day = { day: string; date: string; location: string; items: Item[]; };

export default function ChiangMai() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const itinerary: Day[] = [
    {
      day: "DAY 1", date: "Feb 13, Fri", location: "Chiang Mai — Nimman",
      items: [
        { time: "07:20", type: "flight", text: "Depart TPE" },
        { time: "10:35", type: "flight", text: "Arrive CNX" },
        { time: "12:00", type: "hotel", text: "Check-in · Travelodge Nimman" },
        { time: "14:00", type: "place", text: "One Nimman", note: "清邁最美紅磚文創區，適合初次散步拍照。尼曼區算好逛，比古城區環境好，步調舒服，後來覺得住這不錯。" },
        { time: "17:00", type: "food", text: "Khao Soy Nimman（烤山尼曼）", note: "米其林推薦的泰北咖哩麵。早一點去可以不用排隊，排太久的話我覺得不值得。" },
        { time: "20:00", type: "place", text: "Nimman House Massage", note: "第一天就按摩，旅行開始了的感覺。" },
      ]
    },
    {
      day: "DAY 2", date: "Feb 14, Sat", location: "East — Mae Kampong",
      items: [
        { time: "09:00", type: "place", text: "包車出發 — 東邊山區" },
        { time: "10:30", type: "place", text: "湄康瀑布 & 村落寺廟", note: "感受被溪流與森林包圍的百年木造村落。" },
        { time: "13:00", type: "food", text: "The Giant Chiang Mai", note: "坐在百年大樹上俯瞰森林，視覺震撼。" },
        { time: "18:00", type: "food", text: "Tong Tem Toh", note: "尼曼路超人氣泰北料理，烤豬肉好吃。" },
        { time: "18:30", type: "food", text: "CHARLIE THAI TEA x KAME KAFE", note: "泰奶好喝。" },
        { time: "20:00", type: "place", text: "Sum Bamboo Massage", note: "Threads 上非常推的泰式按摩，很道地但很痛，想體驗可以去哈哈。" },
      ]
    },
    {
      day: "DAY 3", date: "Feb 15, Sun", location: "Market & Old City",
      items: [
        { time: "09:00", type: "place", text: "Jing Jai Market", note: "清邁最美文創早市，算很好逛，環境好。" },
        { time: "14:00", type: "place", text: "契迪龍寺 or 帕邢寺", note: "選一個夠了。" },
        { time: "17:00", type: "place", text: "Sunday Walking Street", note: "全泰國最大夜市，感受春節熱鬧氣氛。" },
        { time: "18:30", type: "food", text: "THE HOUSE by Ginger", note: "米其林推薦，古城內懷舊風格精緻泰菜。吃完覺得普普，價位高吃氣氛的。" },
        { time: "20:30", type: "place", text: "Makkha Health & Spa", note: "環境很好，按完有芒果糯米飯，可能要早點預約。" },
      ]
    },
    {
      day: "DAY 4", date: "Feb 16, Mon", location: "Doi Inthanon — 除夕",
      items: [
        { time: "08:30", type: "place", text: "包車出發 — 茵他儂國家公園" },
        { time: "10:30", type: "place", text: "泰國最高峰 & 雙王塔", note: "觀賞絕美雲海花園。" },
        { time: "13:00", type: "place", text: "Kiew Mae Pan 步道", note: "2.5 小時高山健行，行程的壯觀高潮。" },
        { time: "15:30", type: "place", text: "Wachirathan 瀑布", note: "近距離感受震撼水霧。" },
        { time: "18:00", type: "food", text: "KaPaO Thai Kaprao", note: "環境好、便宜、好吃，吃完再去隔壁網美甜點很爽。" },
      ]
    },
    {
      day: "DAY 5", date: "Feb 17, Tue", location: "Elephant Park → InterContinental — 初一",
      items: [
        { time: "09:00", type: "place", text: "Elephant Nature Park 大象半日遊" },
        { time: "14:00", type: "hotel", text: "Check-in · InterContinental Mae Ping" },
        { time: "18:00", type: "food", text: "Little Stove Kitchen", note: "吃膩泰式的話這間海南雞很好吃。" },
      ]
    },
    {
      day: "DAY 6", date: "Feb 18, Wed", location: "Free Day",
      items: [
        { time: "", type: "place", text: "飯店耍廢 & 附近買伴手禮" },
      ]
    },
    {
      day: "DAY 7", date: "Feb 19, Thu", location: "Depart",
      items: [
        { time: "11:50", type: "flight", text: "Depart CNX" },
        { time: "16:30", type: "flight", text: "Arrive TPE" },
      ]
    },
  ];

  const extras = [
    { text: "換匯找 Mr. Pierre", note: "路上很多坑盤子的別亂換，認準這間就對了。V.K. Currency Exchange 也還行。" },
    { text: "Anantara Resort", note: "原本很想住，過年被訂滿了。下次來要提前卡位，看起來真的很讚。" },
  ];

  const typeIcon: Record<string, string> = { flight: "✈️", hotel: "🏨", place: "📍", food: "🍜" };
  const typeColor: Record<string, string> = { flight: "#4a7a8a", hotel: "#5a8a6a", place: "#444", food: "#7a6040" };

  return (
    <div style={{ minHeight: "100vh", background: "#e8e5de", fontFamily: "-apple-system, Inter, sans-serif", color: "#222" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "0.5px solid #d4d0c8", background: "#e8e5de" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.15em" }}>
          <a href="/" style={{ color: "#999", textDecoration: "none" }}>MATT</a>
          <span style={{ color: "#ccc", margin: "0 8px" }}>/</span>
          <a href="/" style={{ color: "#999", textDecoration: "none" }}>TRAVEL ARCHIVE</a>
          <span style={{ color: "#ccc", margin: "0 8px" }}>/</span>
          <span style={{ color: "#444" }}>CHIANG MAI</span>
        </div>
        <div style={{ fontSize: 11, color: "#999", letterSpacing: "0.1em" }}>FEB 13–19, 2026</div>
      </div>

      <div style={{ position: "relative", height: 400, backgroundImage: "url(/CM.jpg)", backgroundSize: "cover", backgroundPosition: "center 65%", display: "flex", alignItems: "flex-end", padding: 40, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, color: "#7a9e7e", letterSpacing: "0.2em", marginBottom: 8 }}>COMPLETED TRIP</div>
          <div style={{ fontSize: 36, fontWeight: 300, color: "#fff", marginBottom: 12 }}>Chiang Mai</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["🇹🇭 Thailand", "7 days", "春節 2026"].map(tag => (
              <span key={tag} style={{ fontSize: 11, color: "#ddd", border: "0.5px solid rgba(255,255,255,0.3)", padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.08)" }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
        {itinerary.map((day, di) => (
          <div key={di} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16, borderBottom: "0.5px solid #d4d0c8", paddingBottom: 10 }}>
              <span style={{ fontSize: 10, color: "#7a9e7e", letterSpacing: "0.15em", fontWeight: 500 }}>{day.day}</span>
              <span style={{ fontSize: 14, color: "#222" }}>{day.date}</span>
              <span style={{ fontSize: 11, color: "#999" }}>· {day.location}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {day.items.map((item, ii) => {
                const key = di + "-" + ii;
                const isOpen = expanded[key];
                return (
                  <div key={ii}>
                    <div
                      onClick={() => item.note && toggle(key)}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "11px 14px", background: "#f0ede6", borderRadius: isOpen ? "6px 6px 0 0" : 6, border: "0.5px solid #d4d0c8", cursor: item.note ? "pointer" : "default" }}
                    >
                      <span style={{ fontSize: 11, color: "#bbb", width: 36, flexShrink: 0 }}>{item.time}</span>
                      <span style={{ fontSize: 14 }}>{typeIcon[item.type]}</span>
                      <span style={{ fontSize: 13, color: typeColor[item.type], flex: 1 }}>{item.text}</span>
                      {item.note && <span style={{ fontSize: 12, color: "#bbb" }}>{isOpen ? "▾" : "▸"}</span>}
                    </div>
                    {item.note && isOpen && (
                      <div style={{ padding: "10px 14px 12px 76px", background: "#e8e4dc", borderRadius: "0 0 6px 6px", border: "0.5px solid #d4d0c8", borderTop: "none" }}>
                        <p style={{ fontSize: 12, color: "#777", lineHeight: 1.7, margin: 0 }}>{item.note}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 48, borderTop: "0.5px solid #d4d0c8", paddingTop: 32 }}>
          <div style={{ fontSize: 10, color: "#999", letterSpacing: "0.15em", marginBottom: 16 }}>NOTES & TIPS</div>
          {extras.map((e, i) => {
            const key = "extra-" + i;
            const isOpen = expanded[key];
            return (
              <div key={i} style={{ marginBottom: 2 }}>
                <div onClick={() => toggle(key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f0ede6", borderRadius: isOpen ? "6px 6px 0 0" : 6, border: "0.5px solid #d4d0c8", cursor: "pointer" }}>
                  <span style={{ fontSize: 13, color: "#444", flex: 1 }}>💡 {e.text}</span>
                  <span style={{ fontSize: 12, color: "#bbb" }}>{isOpen ? "▾" : "▸"}</span>
                </div>
                {isOpen && (
                  <div style={{ padding: "10px 14px 12px 14px", background: "#e8e4dc", borderRadius: "0 0 6px 6px", border: "0.5px solid #d4d0c8", borderTop: "none" }}>
                    <p style={{ fontSize: 12, color: "#777", lineHeight: 1.7, margin: 0 }}>{e.note}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
