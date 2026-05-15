"""
Australia 行程資料
直接在這裡改 note，改完跑 `python itinerary.py`
輸出結果貼進 page.tsx 的 ITINERARY 區塊取代即可
"""

ITINERARY = [
    {
        "day": 1, "date": "Aug 17, Sat", "location": "台北 → 雪梨",
        "items": [
            {"time": "23:15", "text": "Depart Taipei (TPE)", "cat": "flight"},
        ]
    },
    {
        "day": 2, "date": "Aug 18, Sun", "location": "抵達雪梨 — CBD",
        "items": [
            {"time": "10:45", "text": "Arrive Sydney (SYD)", "cat": "flight"},
            {"time": "12:30", "text": "Train to Sydney CBD (T8 → T2)", "map": "https://www.google.com/maps/search/Sydney+Airport+Train+Station", "note": "T8 Airport Line 轉 T2 Inner West Line，直達 Town Hall。", "cat": "transit"},
            {"time": "14:00", "text": "Check-in · A by Adina Sydney", "map": "https://www.google.com/maps/search/A+by+Adina+Sydney", "cat": "stay"},
            {"time": "15:30", "text": "The Rocks Market", "map": "https://www.google.com/maps/search/The+Rocks+Market+Sydney", "cat": "sight"},
            {"time": "16:30", "text": "Sydney Harbour", "map": "https://www.google.com/maps/search/Sydney+Harbour", "cat": "sight"},
        ]
    },
    {
        "day": 3, "date": "Aug 19, Mon", "location": "雪梨歌劇院 · 港灣郵輪",
        "items": [
            {"time": "09:30", "text": "Sydney Opera House 導覽", "map": "https://www.google.com/maps/search/Sydney+Opera+House", "note": "約 1 小時導覽。", "cat": "sight"},
            {"time": "12:30", "text": "Sydney 海港自助午餐郵輪", "map": "https://www.google.com/maps/search/Circular+Quay+Sydney", "note": "從 Circular Quay 出發。", "cat": "food"},
            {"time": "下午", "text": "雪梨大橋 · 皇家植物園", "map": "https://www.google.com/maps/search/Sydney+Harbour+Bridge", "cat": "sight"},
            {"time": "21:30", "text": "晚餐 — Opera Bar / 附近", "map": "https://www.google.com/maps/search/Opera+Bar+Sydney", "cat": "food"},
        ]
    },
    {
        "day": 4, "date": "Aug 20, Tue", "location": "藍山一日遊 Blue Mountains",
        "items": [
            {"time": "08:30", "text": "達令港假日酒店 集合", "map": "https://www.google.com/maps/search/Ibis+Hotel+Darling+Harbour+Sydney", "cat": "transit"},
            {"time": "09:00", "text": "藍山跟團一日遊出發", "note": "09:00–18:30。", "cat": "transit"},
            {"time": "11:30", "text": "Lily's Pad Cafe — 午餐", "map": "https://www.google.com/maps/search/Lily%27s+Pad+Cafe+Leura", "cat": "food"},
            {"time": "13:30", "text": "Scenic World — 三姐妹岩 · 纜車", "map": "https://www.google.com/maps/search/Scenic+World+Blue+Mountains", "note": "纜車 + 空中步道，三姐妹岩。", "cat": "sight"},
            {"time": "18:30", "text": "返回雪梨", "cat": "transit"},
            {"time": "19:30", "text": "晚餐 — 達令港 / Nick's Seafood Restaurant", "map": "https://www.google.com/maps/search/Nick%27s+Seafood+Restaurant+Darling+Harbour", "cat": "food"},
        ]
    },
    {
        "day": 5, "date": "Aug 21, Wed", "location": "雪梨市區",
        "items": [
            {"time": "10:00", "text": "The University of Sydney", "map": "https://www.google.com/maps/search/University+of+Sydney", "cat": "sight"},
            {"time": "12:00", "text": "Sydney Fish Market", "map": "https://www.google.com/maps/search/Sydney+Fish+Market", "cat": "sight"},
            {"time": "14:00", "text": "Taronga Zoo 塔龍加動物園", "map": "https://www.google.com/maps/search/Taronga+Zoo+Sydney", "cat": "sight"},
        ]
    },
    {
        "day": 6, "date": "Aug 22, Thu", "location": "水族館 · 雪梨塔",
        "items": [
            {"time": "10:00", "text": "SEA LIFE Sydney Aquarium", "map": "https://www.google.com/maps/search/SEA+LIFE+Sydney+Aquarium", "cat": "sight"},
            {"time": "12:30", "text": "午餐 — Edition Roasters", "map": "https://www.google.com/maps/search/Edition+Roasters+Sydney", "note": "超讚咖啡廳。", "cat": "cafe"},
            {"time": "13:30", "text": "Queen Victoria Building", "map": "https://www.google.com/maps/search/Queen+Victoria+Building+Sydney", "cat": "sight"},
            {"time": "14:30", "text": "Westfield Sydney · Martin Place", "map": "https://www.google.com/maps/search/Westfield+Sydney", "cat": "shop"},
            {"time": "16:30", "text": "Sydney Tower Eye — 日落", "map": "https://www.google.com/maps/search/Sydney+Tower+Eye", "cat": "sight"},
            {"time": "18:30", "text": "SkyFeast at Sydney Tower — 旋轉餐廳", "map": "https://www.google.com/maps/search/Sydney+Tower+Restaurant", "note": "70 分鐘轉一圈！", "cat": "food"},
        ]
    },
    {
        "day": 7, "date": "Aug 23, Fri", "location": "雪梨 → 墨爾本",
        "items": [
            {"time": "12:00", "text": "前往雪梨機場", "cat": "transit"},
            {"time": "14:00", "text": "Depart Sydney (SYD)", "cat": "flight"},
            {"time": "15:35", "text": "Arrive Melbourne (MEL)", "cat": "flight"},
            {"time": "16:15", "text": "SkyBus 機場快線 → 市區", "note": "直達 Southern Cross Station。", "cat": "transit"},
            {"time": "17:30", "text": "Check-in · Tyrian Serviced Apartments", "map": "https://www.google.com/maps/search/Tyrian+Serviced+Apartments+Melbourne", "cat": "stay"},
            {"time": "21:00", "text": "晚餐 — 飯店附近", "cat": "food"},
        ]
    },
    {
        "day": 8, "date": "Aug 24, Sat", "location": "墨爾本市區一日遊",
        "items": [
            {"time": "08:30", "text": "Degraves St Laneway — 咖啡一條街", "map": "https://www.google.com/maps/search/Degraves+Street+Melbourne", "note": "墨爾本最有名的咖啡巷弄，後來選 Lune。", "cat": "cafe"},
            {"time": "10:00", "text": "National Gallery of Victoria", "map": "https://www.google.com/maps/search/National+Gallery+of+Victoria", "cat": "sight"},
            {"time": "12:00", "text": "South Melbourne Market — 午餐", "map": "https://www.google.com/maps/search/South+Melbourne+Market", "cat": "food"},
            {"time": "14:00", "text": "Melbourne Park — Rod Laver Arena", "map": "https://www.google.com/maps/search/Melbourne+Park", "note": "澳網主場，Djoko fans 喊在。", "cat": "sight"},
            {"time": "15:30", "text": "Royal Botanic Gardens Melbourne", "map": "https://www.google.com/maps/search/Royal+Botanic+Gardens+Victoria+Melbourne+Gardens", "cat": "sight"},
            {"time": "19:00", "text": "晚餐 — 亞拉河畔", "cat": "food"},
        ]
    },
    {
        "day": 9, "date": "Aug 25, Sun", "location": "普芬比利蒸汽火車 Puffing Billy",
        "items": [
            {"time": "09:00", "text": "出發前往 Belgrave Station", "map": "https://www.google.com/maps/search/Belgrave+Station+Melbourne", "cat": "transit"},
            {"time": "10:30", "text": "Belgrave Station", "cat": "transit"},
            {"time": "11:10", "text": "Puffing Billy Railway 出發", "map": "https://www.google.com/maps/search/Puffing+Billy+Railway+Belgrave", "note": "腳可以伸出窗外！百年蒸汽火車穿越丹頂嶺國家公園，終點 Lakeside Station。", "cat": "transit"},
            {"time": "16:00", "text": "Lakeside Station 抵達", "cat": "transit"},
            {"time": "17:00", "text": "返回墨爾本", "cat": "transit"},
            {"time": "19:30", "text": "晚餐 — 亞拉河畔", "cat": "food"},
        ]
    },
    {
        "day": 10, "date": "Aug 26, Mon", "location": "墨爾本CBD",
        "items": [
            {"time": "08:30", "text": "早餐", "cat": "food"},
            {"time": "10:00", "text": "State Library Victoria", "map": "https://www.google.com/maps/search/State+Library+Victoria+Melbourne", "cat": "sight"},
            {"time": "11:00", "text": "Flagstaff Gardens", "map": "https://www.google.com/maps/search/Flagstaff+Gardens+Melbourne", "cat": "sight"},
            {"time": "12:00", "text": "Queen Victoria Market — 午餐", "map": "https://www.google.com/maps/search/Queen+Victoria+Market+Melbourne", "cat": "food"},
            {"time": "13:30", "text": "Melbourne Central", "map": "https://www.google.com/maps/search/Melbourne+Central+Shopping", "cat": "shop"},
            {"time": "15:00", "text": "The University of Melbourne", "map": "https://www.google.com/maps/search/University+of+Melbourne", "cat": "sight"},
            {"time": "17:00", "text": "租車 — 5 人座 SUV", "cat": "transit"},
            {"time": "19:30", "text": "晚餐 — CBD", "cat": "food"},
        ]
    },
    {
        "day": 11, "date": "Aug 27, Tue", "location": "大洋路 Great Ocean Road",
        "items": [
            {"time": "08:00", "text": "早餐", "cat": "food"},
            {"time": "09:30", "text": "自駕出發大洋路", "note": "好期待啊。", "cat": "transit"},
            {"time": "11:00", "text": "Memorial Arch at Eastern View", "map": "https://www.google.com/maps/search/Great+Ocean+Road+Memorial+Arch", "note": "大洋路起點紀念拱門。", "cat": "sight"},
            {"time": "12:30", "text": "Apollo Bay Bakery — 午餐", "map": "https://www.google.com/maps/search/Apollo+Bay+Bakery", "cat": "food"},
            {"time": "15:00", "text": "Twelve Apostles 十二使徒岩", "map": "https://www.google.com/maps/search/Twelve+Apostles+Victoria", "note": "大洋路最經典。", "cat": "sight"},
            {"time": "16:00", "text": "Loch Ard Gorge 阿德湖峽", "map": "https://www.google.com/maps/search/Loch+Ard+Gorge", "cat": "sight"},
            {"time": "16:45", "text": "London Bridge", "map": "https://www.google.com/maps/search/London+Bridge+Victoria+Australia", "cat": "sight"},
            {"time": "17:30", "text": "回程墨爾本", "cat": "transit"},
            {"time": "21:00", "text": "晚餐 — 順路隨意", "cat": "food"},
        ]
    },
    {
        "day": 12, "date": "Aug 28, Wed", "location": "布萊頓 · 半島溫泉 Peninsula",
        "items": [
            {"time": "08:00", "text": "早餐", "cat": "food"},
            {"time": "10:00", "text": "退房", "cat": "stay"},
            {"time": "10:30", "text": "Brighton Beach — 彩虹小屋", "map": "https://www.google.com/maps/search/Brighton+Beach+Bathing+Boxes+Melbourne", "note": "墨爾本最知名的彩色小屋。", "cat": "sight"},
            {"time": "12:30", "text": "The Cerberus Beach House — 午餐", "map": "https://www.google.com/maps/search/The+Cerberus+Beach+House", "cat": "food"},
            {"time": "14:30", "text": "Peninsula Hot Springs", "map": "https://www.google.com/maps/search/Peninsula+Hot+Springs", "note": "半島戶外溫泉，邊下大雨邊泡。", "cat": "onsen"},
            {"time": "17:30", "text": "Cape Schanck Lighthouse — 日落", "map": "https://www.google.com/maps/search/Cape+Schanck+Lighthouse", "cat": "sight"},
            {"time": "21:00", "text": "Check-in · Flinders Hotel", "map": "https://www.google.com/maps/search/Flinders+Hotel+Victoria", "cat": "stay"},
        ]
    },
    {
        "day": 13, "date": "Aug 29, Thu", "location": "野生動物園 · 雅拉河谷 Yarra Valley",
        "items": [
            {"time": "13:30", "text": "前往 Yarra Valley 酒莊", "note": "最 chill 的最後兩天，運氣很好看到好多袋鼠。", "cat": "transit"},
            {"time": "14:30", "text": "Check-in · Balgownie Estate Yarra Valley", "map": "https://www.google.com/maps/search/Balgownie+Estate+Yarra+Valley", "cat": "stay"},
            {"time": "15:00", "text": "Yarra Valley 酒莊品酒", "map": "https://www.google.com/maps/search/Yarra+Valley+winery", "cat": "sight"},
            {"time": "19:00", "text": "晚餐 — 飯店內西餐", "cat": "food"},
        ]
    },
    {
        "day": 14, "date": "Aug 30, Fri", "location": "雅拉河谷 → 墨爾本機場",
        "items": [
            {"time": "08:00", "text": "早餐", "cat": "food"},
            {"time": "10:00", "text": "退房", "cat": "stay"},
            {"time": "10:30", "text": "酒莊休憩 · 午餐", "cat": "cafe"},
            {"time": "13:00", "text": "Yarra Valley Trails — 附近景點", "map": "https://www.google.com/maps/search/Yarra+Valley+Trails", "cat": "sight"},
            {"time": "15:30", "text": "前往墨爾本機場 · 還車", "cat": "transit"},
            {"time": "21:35", "text": "Depart Melbourne (MEL)", "cat": "flight"},
        ]
    },
    {
        "day": 15, "date": "Aug 31, Sat", "location": "返抵台灣",
        "items": [
            {"time": "05:05", "text": "Arrive Taipei (TPE)", "cat": "flight"},
        ]
    },
]

# ── 以下不用動 ──────────────────────────────────────────

def escape(s):
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${").replace('"', '\\"')

def render_item(item):
    parts = []
    parts.append(f'time: "{item["time"]}"')
    parts.append(f'text: "{escape(item["text"])}"')
    if "map" in item:
        parts.append(f'mapUrl: "{item["map"]}"')
    if "note" in item:
        parts.append(f'note: "{escape(item["note"])}"')
    if "cat" in item:
        parts.append(f'cat: "{item["cat"]}"')
    return "{ " + ", ".join(parts) + " }"

def render_day(day):
    lines = []
    lines.append("  {")
    lines.append(f'    day: {day["day"]}, date: "{day["date"]}", location: "{escape(day["location"])}",')
    lines.append("    items: [")
    for item in day["items"]:
        lines.append(f'      {render_item(item)},')
    lines.append("    ]")
    lines.append("  },")
    return "\n".join(lines)

if __name__ == "__main__":
    print("const ITINERARY: Day[] = [")
    for day in ITINERARY:
        print(render_day(day))
    print("];")
