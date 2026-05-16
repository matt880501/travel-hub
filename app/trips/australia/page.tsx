"use client";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

type Category = "food" | "transit" | "flight" | "stay" | "sight" | "shop" | "onsen" | "cafe";
type Item = { time: string; text: string; note?: string; mapUrl?: string; cat?: Category; };
type Day = { day: number; date: string; location: string; items: Item[]; };

const ACCENT = "#c07835";
const BG = "#f5f0e6";
const TEXT = "#2a1f12";
const MUTED = "#9a7a5a";

const HERO_URL = "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862389/AU12_w6s7vd.jpg";

type GalleryPhoto = { url: string; caption: string; location: string; wide?: boolean; };
// Each sub-array = one row. wide=true photos get flex:2, others flex:1.
const GALLERY_ROWS: GalleryPhoto[][] = [
  // Row 1 — 2 landscape
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862389/AU12_w6s7vd.jpg", caption: "雪梨大橋望歌劇院", location: "Sydney Harbour", wide: true },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862375/AU6_osbnal.jpg", caption: "海的對面是南極", location: "Great Ocean Road", wide: true },
  ],
  // Row 2 — 3 portrait
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862395/AUs1_wgcxyp.jpg", caption: "雪梨大學", location: "The University of Sydney" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862397/AUs2_iuwftb.jpg", caption: "冬末春初", location: "Sydney" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862399/AUs3_a9s1ib.jpg", caption: "雪梨塔夜景", location: "Sydney Tower Eye" },
  ],
  // Row 3 — 2 landscape
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862390/AU13_d8ezcd.jpg", caption: "三姐妹岩", location: "Blue Mountains", wide: true },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862380/AU7_ut5m63.jpg", caption: "London Bridge", location: "Great Ocean Road", wide: true },
  ],
  // Row 4 — 3 portrait
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862401/AUs4_ytvcuz.jpg", caption: "大洋路一景", location: "Great Ocean Road" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862403/AUs5_zm6rcb.jpg", caption: "藍山國家公園", location: "Blue Mountains" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862404/AUs6_vpzrlq.jpg", caption: "Amie Peng 到此一遊", location: "Blue Mountains" },
  ],
  // Row 5 — 2 landscape
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862373/AU2_dupumd.jpg", caption: "雪梨街景", location: "Sydney CBD", wide: true },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862393/AU14_mj0jsi.jpg", caption: "Twelve Apostles", location: "Great Ocean Road", wide: true },
  ],
  // Row 6 — 4 portrait
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862407/AUs7_ylcq6f.jpg", caption: "酒莊野生袋鼠", location: "Yarra Valley" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862409/AUs8_seqm2q.jpg", caption: "Edition Roasters", location: "Sydney" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862411/AUs9_rvjtqe.jpg", caption: "QVB", location: "Queen Victoria Building" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862413/AUs10_pn2x6s.jpg", caption: "Circular Quay", location: "Sydney" },
  ],
  // Row 7 — 2 landscape
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862381/AU8_cioqkc.jpg", caption: "小企鵝與大洋路", location: "Great Ocean Road", wide: true },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862874/AU3_kfnwfu.png", caption: "Lest We Forget", location: "Australian War Memorial", wide: true },
  ],
  // Row 8 — 3 portrait
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862417/AUs11_vorskd.jpg", caption: "痛風餐", location: "Sydney Fish Market" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862419/AUs12_ra72gg.jpg", caption: "澳網主場", location: "Melbourne Park" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862424/AUs15_lspzsa.jpg", caption: "State Library Victoria", location: "Melbourne" },
  ],
  // Row 8.5 — Puffing Billy: landscape + portrait
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778863717/AU4_compressed_m6pcrx.jpg", caption: "Lakeside Station", location: "Puffing Billy Railway", wide: true },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862421/AUs13_n0utze.jpg", caption: "Puffing Billy", location: "Dandenong Ranges" },
  ],
  // Row 9 — landscape + 2 portrait
  [
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862384/AU9_tnah0g.jpg", caption: "海鷗。", location: "Mornington Peninsula", wide: true },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778886135/AUs18_bcxab1.jpg", caption: "goodbye great ocean road", location: "Loch Ard Gorge" },
    { url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862430/AUs17_mqalqr.jpg", caption: "大洋路起點", location: "Great Ocean Road" },
  ],
];

const ITINERARY: Day[] = [
  {
    day: 1, date: "Aug 17, Sat", location: "台北 → 雪梨",
    items: [
      { time: "23:15", text: "Depart Taipei (TPE)", cat: "flight" },
    ]
  },
  {
    day: 2, date: "Aug 18, Sun", location: "抵達雪梨 — CBD",
    items: [
      { time: "10:45", text: "Arrive Sydney (SYD)", cat: "flight" },
      { time: "12:30", text: "Train to Sydney CBD (T8 → T2)", mapUrl: "https://www.google.com/maps/search/Sydney+Airport+Train+Station", note: "T8 Airport Line 轉 T2 Inner West Line，直達 Town Hall。", cat: "transit" },
      { time: "14:00", text: "Check-in · A by Adina Sydney", mapUrl: "https://www.google.com/maps/search/A+by+Adina+Sydney", cat: "stay" },
      { time: "15:30", text: "The Rocks Market", mapUrl: "https://www.google.com/maps/search/The+Rocks+Market+Sydney", cat: "sight" },
      { time: "16:30", text: "Sydney Harbour", mapUrl: "https://www.google.com/maps/search/Sydney+Harbour", cat: "sight" },
    ]
  },
  {
    day: 3, date: "Aug 19, Mon", location: "雪梨歌劇院 · 港灣郵輪",
    items: [
      { time: "09:30", text: "Sydney Opera House 導覽", mapUrl: "https://www.google.com/maps/search/Sydney+Opera+House", note: "約 1 小時導覽。", cat: "sight" },
      { time: "12:30", text: "Sydney 海港自助午餐郵輪", mapUrl: "https://www.google.com/maps/search/Circular+Quay+Sydney", note: "從 Circular Quay 出發。", cat: "food" },
      { time: "下午", text: "雪梨大橋 · 皇家植物園", mapUrl: "https://www.google.com/maps/search/Sydney+Harbour+Bridge", cat: "sight" },
      { time: "21:30", text: "晚餐 — Opera Bar / 附近", mapUrl: "https://www.google.com/maps/search/Opera+Bar+Sydney", cat: "food" },
    ]
  },
  {
    day: 4, date: "Aug 20, Tue", location: "藍山一日遊 Blue Mountains",
    items: [
      { time: "08:30", text: "達令港假日酒店 集合", mapUrl: "https://www.google.com/maps/search/Ibis+Hotel+Darling+Harbour+Sydney", cat: "transit" },
      { time: "09:00", text: "藍山跟團一日遊出發", note: "09:00–18:30。", cat: "transit" },
      { time: "11:30", text: "Lily's Pad Cafe — 午餐", mapUrl: "https://www.google.com/maps/search/Lily%27s+Pad+Cafe+Leura", cat: "food" },
      { time: "13:30", text: "Scenic World — 三姐妹岩 · 纜車", mapUrl: "https://www.google.com/maps/search/Scenic+World+Blue+Mountains", note: "纜車 + 空中步道，三姐妹岩。", cat: "sight" },
      { time: "18:30", text: "返回雪梨", cat: "transit" },
      { time: "19:30", text: "晚餐 — 達令港 / Nick's Seafood Restaurant", mapUrl: "https://www.google.com/maps/search/Nick%27s+Seafood+Restaurant+Darling+Harbour", cat: "food" },
    ]
  },
  {
    day: 5, date: "Aug 21, Wed", location: "雪梨市區",
    items: [
      { time: "10:00", text: "The University of Sydney", mapUrl: "https://www.google.com/maps/search/University+of+Sydney", cat: "sight" },
      { time: "12:00", text: "Sydney Fish Market", mapUrl: "https://www.google.com/maps/search/Sydney+Fish+Market", cat: "sight" },
      { time: "14:00", text: "Taronga Zoo 塔龍加動物園", mapUrl: "https://www.google.com/maps/search/Taronga+Zoo+Sydney", cat: "sight" },
    ]
  },
  {
    day: 6, date: "Aug 22, Thu", location: "水族館 · 雪梨塔",
    items: [
      { time: "10:00", text: "SEA LIFE Sydney Aquarium", mapUrl: "https://www.google.com/maps/search/SEA+LIFE+Sydney+Aquarium", cat: "sight" },
      { time: "12:30", text: "午餐 — Edition Roasters", mapUrl: "https://www.google.com/maps/search/Edition+Roasters+Sydney", note: "超讚咖啡廳。", cat: "cafe" },
      { time: "13:30", text: "Queen Victoria Building", mapUrl: "https://www.google.com/maps/search/Queen+Victoria+Building+Sydney", cat: "sight" },
      { time: "14:30", text: "Westfield Sydney · Martin Place", mapUrl: "https://www.google.com/maps/search/Westfield+Sydney", cat: "shop" },
      { time: "16:30", text: "Sydney Tower Eye — 日落", mapUrl: "https://www.google.com/maps/search/Sydney+Tower+Eye", cat: "sight" },
      { time: "18:30", text: "SkyFeast at Sydney Tower — 旋轉餐廳", mapUrl: "https://www.google.com/maps/search/Sydney+Tower+Restaurant", note: "70 分鐘轉一圈！", cat: "food" },
    ]
  },
  {
    day: 7, date: "Aug 23, Fri", location: "雪梨 → 墨爾本",
    items: [
      { time: "12:00", text: "前往雪梨機場", cat: "transit" },
      { time: "14:00", text: "Depart Sydney (SYD)", cat: "flight" },
      { time: "15:35", text: "Arrive Melbourne (MEL)", cat: "flight" },
      { time: "16:15", text: "SkyBus 機場快線 → 市區", note: "直達 Southern Cross Station。", cat: "transit" },
      { time: "17:30", text: "Check-in · Tyrian Serviced Apartments", mapUrl: "https://www.google.com/maps/search/Tyrian+Serviced+Apartments+Melbourne", cat: "stay" },
      { time: "21:00", text: "晚餐 — 飯店附近", cat: "food" },
    ]
  },
  {
    day: 8, date: "Aug 24, Sat", location: "墨爾本市區一日遊",
    items: [
      { time: "08:30", text: "Degraves St Laneway — 咖啡一條街", mapUrl: "https://www.google.com/maps/search/Degraves+Street+Melbourne", note: "墨爾本最有名的咖啡巷弄，後來選 Lune。", cat: "cafe" },
      { time: "10:00", text: "National Gallery of Victoria", mapUrl: "https://www.google.com/maps/search/National+Gallery+of+Victoria", cat: "sight" },
      { time: "12:00", text: "South Melbourne Market — 午餐", mapUrl: "https://www.google.com/maps/search/South+Melbourne+Market", cat: "food" },
      { time: "14:00", text: "Melbourne Park — Rod Laver Arena", mapUrl: "https://www.google.com/maps/search/Melbourne+Park", note: "澳網主場，Djoko fans 喊在。", cat: "sight" },
      { time: "15:30", text: "Royal Botanic Gardens Melbourne", mapUrl: "https://www.google.com/maps/search/Royal+Botanic+Gardens+Victoria+Melbourne+Gardens", cat: "sight" },
      { time: "19:00", text: "晚餐 — 亞拉河畔", cat: "food" },
    ]
  },
  {
    day: 9, date: "Aug 25, Sun", location: "普芬比利蒸汽火車 Puffing Billy",
    items: [
      { time: "09:00", text: "出發前往 Belgrave Station", mapUrl: "https://www.google.com/maps/search/Belgrave+Station+Melbourne", cat: "transit" },
      { time: "10:30", text: "Belgrave Station", cat: "transit" },
      { time: "11:10", text: "Puffing Billy Railway 出發", mapUrl: "https://www.google.com/maps/search/Puffing+Billy+Railway+Belgrave", note: "腳可以伸出窗外！百年蒸汽火車穿越丹頂嶺國家公園，終點 Lakeside Station。", cat: "transit" },
      { time: "16:00", text: "Lakeside Station 出發", cat: "transit" },
      { time: "17:00", text: "返回墨爾本", cat: "transit" },
      { time: "19:30", text: "晚餐 — 亞拉河畔", cat: "food" },
    ]
  },
  {
    day: 10, date: "Aug 26, Mon", location: "墨爾本CBD",
    items: [
      { time: "08:30", text: "早餐", cat: "food" },
      { time: "10:00", text: "State Library Victoria", mapUrl: "https://www.google.com/maps/search/State+Library+Victoria+Melbourne", cat: "sight" },
      { time: "11:00", text: "Flagstaff Gardens", mapUrl: "https://www.google.com/maps/search/Flagstaff+Gardens+Melbourne", cat: "sight" },
      { time: "12:00", text: "Queen Victoria Market — 午餐", mapUrl: "https://www.google.com/maps/search/Queen+Victoria+Market+Melbourne", cat: "food" },
      { time: "13:30", text: "Melbourne Central", mapUrl: "https://www.google.com/maps/search/Melbourne+Central+Shopping", cat: "shop" },
      { time: "15:00", text: "The University of Melbourne", mapUrl: "https://www.google.com/maps/search/University+of+Melbourne", cat: "sight" },
      { time: "17:00", text: "租車 — 5 人座 SUV", cat: "transit" },
      { time: "19:30", text: "晚餐 — CBD", cat: "food" },
    ]
  },
  {
    day: 11, date: "Aug 27, Tue", location: "大洋路 Great Ocean Road",
    items: [
      { time: "08:00", text: "早餐", cat: "food" },
      { time: "09:30", text: "自駕出發大洋路", note: "好期待啊。", cat: "transit" },
      { time: "11:00", text: "Memorial Arch at Eastern View", mapUrl: "https://www.google.com/maps/search/Great+Ocean+Road+Memorial+Arch", note: "大洋路起點紀念拱門。", cat: "sight" },
      { time: "12:30", text: "Apollo Bay Bakery — 午餐", mapUrl: "https://www.google.com/maps/search/Apollo+Bay+Bakery", cat: "food" },
      { time: "15:00", text: "Twelve Apostles 十二使徒岩", mapUrl: "https://www.google.com/maps/search/Twelve+Apostles+Victoria", note: "大洋路最經典。", cat: "sight" },
      { time: "16:00", text: "Loch Ard Gorge 阿德湖峽", mapUrl: "https://www.google.com/maps/search/Loch+Ard+Gorge", cat: "sight" },
      { time: "16:45", text: "London Bridge", mapUrl: "https://www.google.com/maps/search/London+Bridge+Victoria+Australia", cat: "sight" },
      { time: "17:30", text: "回程墨爾本", cat: "transit" },
      { time: "21:00", text: "晚餐 — 順路隨意", cat: "food" },
    ]
  },
  {
    day: 12, date: "Aug 28, Wed", location: "布萊頓 · 半島溫泉 Peninsula",
    items: [
      { time: "08:00", text: "早餐", cat: "food" },
      { time: "10:00", text: "退房", cat: "stay" },
      { time: "10:30", text: "Brighton Beach — 彩虹小屋", mapUrl: "https://www.google.com/maps/search/Brighton+Beach+Bathing+Boxes+Melbourne", note: "墨爾本最知名的彩色小屋。", cat: "sight" },
      { time: "12:30", text: "The Cerberus Beach House — 午餐", mapUrl: "https://www.google.com/maps/search/The+Cerberus+Beach+House", cat: "food" },
      { time: "14:30", text: "Peninsula Hot Springs", mapUrl: "https://www.google.com/maps/search/Peninsula+Hot+Springs", note: "半島戶外溫泉，邊下大雨邊泡。", cat: "onsen" },
      { time: "17:30", text: "Cape Schanck Lighthouse — 日落", mapUrl: "https://www.google.com/maps/search/Cape+Schanck+Lighthouse", cat: "sight" },
      { time: "21:00", text: "Check-in · Flinders Hotel", mapUrl: "https://www.google.com/maps/search/Flinders+Hotel+Victoria", cat: "stay" },
    ]
  },
  {
    day: 13, date: "Aug 29, Thu", location: "野生動物園 · 雅拉河谷 Yarra Valley",
    items: [
      { time: "13:30", text: "前往 Yarra Valley 酒莊", note: "最 chill 的最後兩天，運氣很好看到好多袋鼠。", cat: "transit" },
      { time: "14:30", text: "Check-in · Balgownie Estate Yarra Valley", mapUrl: "https://www.google.com/maps/search/Balgownie+Estate+Yarra+Valley", cat: "stay" },
      { time: "15:00", text: "Yarra Valley 酒莊品酒", mapUrl: "https://www.google.com/maps/search/Yarra+Valley+winery", cat: "sight" },
      { time: "19:00", text: "晚餐 — 飯店內西餐", cat: "food" },
    ]
  },
  {
    day: 14, date: "Aug 30, Fri", location: "雅拉河谷 → 墨爾本機場",
    items: [
      { time: "08:00", text: "早餐", cat: "food" },
      { time: "10:00", text: "退房", cat: "stay" },
      { time: "10:30", text: "酒莊休憩 · 午餐", cat: "cafe" },
      { time: "13:00", text: "Yarra Valley Trails — 附近景點", mapUrl: "https://www.google.com/maps/search/Yarra+Valley+Trails", cat: "sight" },
      { time: "15:30", text: "前往墨爾本機場 · 還車", cat: "transit" },
      { time: "21:35", text: "Depart Melbourne (MEL)", cat: "flight" },
    ]
  },
  {
    day: 15, date: "Aug 31, Sat", location: "返抵台灣",
    items: [
      { time: "05:05", text: "Arrive Taipei (TPE)", cat: "flight" },
    ]
  },
];

const EXTRAS: { text: string; note: string }[] = [
  { text: "", note: "大洋路回程的夜路，前後望不見第二盞車燈。Those Were the Days 在車裡放著，爸媽和姐姐都睡了。我挺累的，卻捨不得讓那個夜晚結束。" },
  { text: "交通 — Apple Pay · Myki 卡", note: "雪梨：Apple Pay 感應搭車，公車、火車、輕軌全適用，機場搭 T8 轉 T2 直達 CBD。墨爾本：Myki 卡需提前儲值，市區 Free Tram Zone 內搭電車免刷卡。" },
  { text: "行程預訂 — KKday · Klook", note: "KKday：郵輪午餐、藍山一日遊、雪梨塔 + 旋轉餐廳套票、普芬比利蒸汽火車、半島溫泉。Klook：澳洲網卡、雪梨歌劇院導覽、SkyBus 機場快線（墨爾本）。" },
];

function CatIcon({ cat }: { cat?: Category }) {
  const p = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none" as const, stroke: MUTED, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: { flexShrink: 0, opacity: 0.7 } };
  if (!cat) return <span style={{ width: 13 }} />;
  if (cat === "food") return <svg {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="21" y1="15" x2="21" y2="22"/><path d="M21 2a5 5 0 0 1 0 10V2z"/></svg>;
  if (cat === "transit") return <svg {...p}><rect x="4" y="3" width="16" height="15" rx="3"/><line x1="4" y1="11" x2="20" y2="11"/><line x1="12" y1="3" x2="12" y2="11"/><path d="M8 19l-1 3M16 19l1 3"/></svg>;
  if (cat === "flight") return <svg {...p}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>;
  if (cat === "stay") return <svg {...p}><path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>;
  if (cat === "sight") return <svg {...p}><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>;
  if (cat === "shop") return <svg {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
  if (cat === "onsen") return <svg {...p}><path d="M8 14s1.5-2 4-2 4 2 4 2"/><path d="M12 2v4M9.5 4.5C9.5 6.5 12 7 12 9M14.5 4.5C14.5 6.5 12 7 12 9"/><path d="M5 18s1.5-2 7-2 7 2 7 2"/><path d="M4 22s2-2 8-2 8 2 8 2"/></svg>;
  if (cat === "cafe") return <svg {...p}><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="5"/><line x1="10" y1="2" x2="10" y2="5"/><line x1="14" y1="2" x2="14" y2="5"/></svg>;
  return <span style={{ width: 13 }} />;
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
        style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: `0.5px solid rgba(42,31,18,0.1)`, cursor: item.note ? "pointer" : "default", alignItems: "center" }}
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

function ExtraItem({ e }: { e: typeof EXTRAS[0] }) {
  const [open, setOpen] = useState(false);
  if (!e.text) return (
    <div style={{ padding: "14px 0", borderBottom: `0.5px solid rgba(42,31,18,0.1)` }}>
      <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{e.note}</p>
    </div>
  );
  return (
    <div onClick={() => setOpen(o => !o)} style={{ cursor: "pointer", padding: "14px 0", borderBottom: `0.5px solid rgba(42,31,18,0.1)`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
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
      <span style={{ fontSize: 10, color: MUTED, opacity: 0.5, paddingTop: 3, marginLeft: 16 }}>{open ? "−" : "+"}</span>
    </div>
  );
}

function GalleryRow({ photos, rowIndex, onOpen, isMobile, isTouch }: { photos: GalleryPhoto[]; rowIndex: number; onOpen: (url: string) => void; isMobile: boolean; isTouch: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number | null>(null);
  const allPortrait = photos.every(p => !p.wide);
  const ROW_H = isMobile ? (allPortrait ? 200 : 130) : (allPortrait ? 360 : 220);
  const active = isTouch ? tapped : hovered;
  return (
    <div style={{ display: "flex", gap: isMobile ? 4 : 6, marginBottom: isMobile ? 4 : 6 }}>
      {photos.map((photo, pi) => (
        <motion.div
          key={pi}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: (rowIndex * photos.length + pi) * 0.04 }}
          onClick={() => isTouch ? setTapped(t => t === pi ? null : pi) : onOpen(photo.url)}
          onMouseEnter={() => !isTouch && setHovered(pi)}
          onMouseLeave={() => !isTouch && setHovered(null)}
          style={{ flex: photo.wide ? 2 : 1, height: ROW_H, position: "relative", overflow: "hidden", borderRadius: 2, cursor: "pointer", flexShrink: 0 }}
        >
          <img
            src={photo.url}
            alt={photo.caption}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s cubic-bezier(0.25,0.1,0.25,1)", transform: active === pi ? "scale(1.04)" : "scale(1)" }}
          />
          <AnimatePresence>
            {active === pi && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "14px 12px" }}
              >
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontStyle: "italic", fontFamily: "Georgia, serif" }}>{photo.caption}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", marginTop: 2 }}>{photo.location}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export default function Australia() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    setIsTouch(navigator.maxTouchPoints > 0);
  }, []);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
            <img src={lightbox} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} alt="" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "14px 20px" : "18px 40px", background: `rgba(245,240,230,0.85)`, backdropFilter: "blur(12px)", borderBottom: `0.5px solid rgba(42,31,18,0.08)` }}>
        <div style={{ fontSize: 10, letterSpacing: "0.2em", color: MUTED }}>
          {!isMobile && <><a href="/" style={{ color: MUTED, textDecoration: "none" }}>MATT</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span><a href="/" style={{ color: MUTED, textDecoration: "none" }}>TRAVEL ARCHIVE</a><span style={{ margin: "0 10px", opacity: 0.4 }}>/</span></>}
          {isMobile && <a href="/" style={{ color: MUTED, textDecoration: "none", marginRight: 10 }}>←</a>}
          <span style={{ color: TEXT }}>AUSTRALIA</span>
        </div>
        {!isMobile && <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.15em" }}>AUG 17 – 31, 2024</div>}
      </div>

      {/* Hero */}
      <div ref={heroRef} style={{ position: "relative", overflow: "hidden", backgroundColor: "#1a120a", minHeight: HERO_URL ? undefined : (isMobile ? "60vw" : "85vh") }}>
        {HERO_URL && (
          <motion.div style={{ y: heroY }}>
            <img src={HERO_URL} style={{ width: "100%", height: "auto", display: "block" }} alt="" />
          </motion.div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,18,10,0.1) 0%, transparent 30%, rgba(26,18,10,0.55) 70%, rgba(26,18,10,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(26,18,10,0.35) 0%, transparent 65%)" }} />

        <motion.div
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isMobile ? "0 20px 32px" : "0 40px 48px", opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ fontSize: "clamp(40px, 6vw, 88px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em", fontFamily: "Georgia, 'Times New Roman', serif", marginBottom: 20 }}
          >
            Australia<br />
            <span style={{ fontSize: "clamp(20px, 3vw, 46px)", color: "rgba(255,255,255,0.6)" }}>Sydney · Melbourne · Great Ocean Road</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 24 }}
          >
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>Aug 2024</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>15 Days</span>
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.05em" }}>Australia</span>
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
            <div style={{ flex: 1, height: 0.5, background: `rgba(192,120,53,0.25)` }} />
          </div>

          {ITINERARY.map((day, di) => (
            <motion.div
              key={di}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: di * 0.03 }}
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

        {/* Notes / Extras */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginBottom: 96 }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 32 }}>
            <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>TRAVEL INFO</span>
            <div style={{ flex: 1, height: 0.5, background: `rgba(192,120,53,0.25)` }} />
          </div>
          {EXTRAS.map((e, i) => <ExtraItem key={i} e={e} />)}
        </motion.div>

        {/* Gallery */}
        {GALLERY_ROWS.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginBottom: 96 }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: isMobile ? 12 : 32 }}>
              <span style={{ fontSize: 10, color: ACCENT, letterSpacing: "0.25em" }}>PHOTOGRAPHS</span>
              <div style={{ flex: 1, height: 0.5, background: `rgba(192,120,53,0.25)` }} />
            </div>
            {isTouch && (
              <p style={{ fontSize: 11, color: MUTED, fontStyle: "italic", margin: "0 0 20px", opacity: 0.7 }}>tap to view</p>
            )}
            {GALLERY_ROWS.map((row, ri) => (
              <GalleryRow key={ri} photos={row} rowIndex={ri} onOpen={setLightbox} isMobile={isMobile} isTouch={isTouch} />
            ))}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ borderTop: `0.5px solid rgba(42,31,18,0.15)`, paddingTop: 40 }}
        >
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: "0.2em", marginBottom: 24 }}>ABOUT THIS TRIP</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? 24 : 32 }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>, label: "TEMPERATURE", value: "10°C — 18°C", sub: "Southern Hemisphere winter" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, label: "MOOD", value: "Big Landscapes", sub: "Ocean cliffs & wide skies" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "SEASON", value: "August", sub: "Crisp winter mornings" },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: "WITH", value: "Family", sub: "Family road trip" },
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
