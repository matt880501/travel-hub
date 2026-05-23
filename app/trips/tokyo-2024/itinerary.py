"""
Tokyo 2024 行程資料
直接在這裡改 note，改完跑 `python itinerary.py`
輸出結果貼進 page.tsx 的 ITINERARY 區塊取代即可
"""

ITINERARY = [
    {
        "day": 1, "date": "May 17, Fri", "location": "東京gogo",
        "items": [
            {"time": "08:55", "text": "Depart Taipei (TPE)", "cat": "flight"},
            {"time": "13:15", "text": "Arrive Tokyo Narita (NRT)", "cat": "flight"},
            {"time": "14:49", "text": "JR N'EX 成田特快 → 品川 → 五反田", "map": "https://www.google.com/maps/search/Narita+Express+Tokyo", "note": "直達品川，轉五反田。15:54 抵達。", "cat": "transit"},
            {"time": "16:00", "text": "Check-in · 三井花園酒店五反田", "map": "https://www.google.com/maps/search/Hotel+Mitsui+Garden+Gotanda+Tokyo", "cat": "stay"},
            {"time": "17:00", "text": "山手線 → 新宿", "cat": "transit"},
            {"time": "18:00", "text": "晚餐 — Nabezo 鍋ぞう 新宿明治通り店", "cat": "food"},
            {"time": "19:30", "text": "ALPEN Tokyo · Lumine Est", "map": "https://www.google.com/maps/search/ALPEN+Tokyo+Shinjuku", "cat": "shop"},
        ]
    },
    {
        "day": 2, "date": "May 18, Sat", "location": "河口湖一日遊 Kawaguchiko",
        "items": [
            {"time": "06:26", "text": "新宿出發 → 河口湖", "map": "https://www.google.com/maps/search/Shinjuku+Station+Tokyo", "note": "富士山gogo", "cat": "transit"},
            {"time": "09:00", "text": "租電動自行車", "cat": "transit"},
            {"time": "09:30", "text": "下吉田新倉山淺間神社", "map": "https://www.google.com/maps/search/Arakurayama+Sengen+Park+Fujiyoshida", "cat": "sight"},
            {"time": "11:00", "text": "日川時計店", "map": "https://www.google.com/maps/search/Hikawa+Watch+Shimoyoshida", "cat": "sight"},
            {"time": "12:30", "text": "午餐 — 附近", "cat": "food"},
            {"time": "13:30", "text": "富士山景觀纜車", "map": "https://www.google.com/maps/search/Mt+Fuji+Panoramic+Ropeway+Kawaguchiko", "cat": "sight"},
            {"time": "14:00", "text": "河口湖天上山公園", "map": "https://www.google.com/maps/search/Tenjoyama+Park+Kawaguchiko", "cat": "sight"},
            {"time": "15:30", "text": "大石公園", "map": "https://www.google.com/maps/search/Oishi+Park+Kawaguchiko", "cat": "sight"},
            {"time": "17:16", "text": "下吉田 → 新宿", "note": "19:28 抵達新宿。", "cat": "transit"},
        ]
    },
    {
        "day": 3, "date": "May 19, Sun", "location": "原宿 · 表參道 · 澀谷",
        "items": [
            {"time": "08:30", "text": "早餐 — Bills", "map": "https://www.google.com/maps/search/Bills+Tokyo", "cat": "cafe"},
            {"time": "09:00", "text": "明治神宮", "map": "https://www.google.com/maps/search/Meiji+Shrine+Tokyo", "cat": "sight"},
            {"time": "10:00", "text": "新宿御苑", "map": "https://www.google.com/maps/search/Shinjuku+Gyoen+National+Garden", "cat": "sight"},
            {"time": "11:00", "text": "原宿 · 表參道逛街", "map": "https://www.google.com/maps/search/Takeshita+Street+Harajuku+Tokyo", "cat": "shop"},
            {"time": "12:00", "text": "午餐 — 原宿餃子樓", "map": "https://www.google.com/maps/search/Harajuku+Gyoza+Lou+Tokyo", "cat": "food"},
            {"time": "13:00", "text": "Blue Bottle Coffee", "map": "https://www.google.com/maps/search/Blue+Bottle+Coffee+Aoyama+Tokyo", "cat": "cafe"},
            {"time": "14:00", "text": "Parco · Pokémon Center · Disney Store", "map": "https://www.google.com/maps/search/Shibuya+Parco+Tokyo", "cat": "shop"},
            {"time": "16:30", "text": "Shibuya Sky — 日落", "map": "https://www.google.com/maps/search/Shibuya+Sky+Tokyo", "cat": "sight"},
        ]
    },
    {
        "day": 4, "date": "May 20, Mon", "location": "淺草 · 上野 · 秋葉原 · 銀座",
        "items": [
            {"time": "08:00", "text": "山手線 → 淺草", "cat": "transit"},
            {"time": "08:30", "text": "早餐 — MISOJYU", "map": "https://www.google.com/maps/search/MISOJYU+Asakusa+Tokyo", "cat": "cafe"},
            {"time": "10:00", "text": "淺草寺 · 淺草神社", "map": "https://www.google.com/maps/search/Senso-ji+Temple+Asakusa+Tokyo", "cat": "sight"},
            {"time": "11:30", "text": "壽壽喜園抹茶冰淇淋", "map": "https://www.google.com/maps/search/Suzukien+Asakusa+Tokyo", "cat": "food"},
            {"time": "12:00", "text": "銀座線 → 上野", "cat": "transit"},
            {"time": "12:30", "text": "午餐 — とんかつ山家 御徒町店", "map": "https://www.google.com/maps/search/Tonkatsu+Yamabe+Okachimachi+Tokyo", "cat": "food"},
            {"time": "13:00", "text": "東京大學", "map": "https://www.google.com/maps/search/University+of+Tokyo", "cat": "sight"},
            {"time": "16:00", "text": "阿美橫町", "map": "https://www.google.com/maps/search/Ameyoko+Market+Ueno+Tokyo", "note": "大章魚燒！", "cat": "food"},
            {"time": "17:00", "text": "秋葉原 · 廣播大樓", "map": "https://www.google.com/maps/search/Radio+Kaikan+Akihabara+Tokyo", "note": "Steins;Gate","cat": "shop"},
            {"time": "18:30", "text": "銀座", "map": "https://www.google.com/maps/search/Ginza+Tokyo", "cat": "shop"},
            {"time": "19:30", "text": "晚餐", "cat": "food"},
            {"time": "20:00", "text": "Uniqlo · 無印良品 旗艦店", "map": "https://www.google.com/maps/search/Uniqlo+Ginza+Tokyo", "cat": "shop"},
        ]
    },
    {
        "day": 5, "date": "May 21, Tue", "location": "晴空塔 → 成田機場",
        "items": [
            {"time": "08:00", "text": "飯店早餐", "cat": "food"},
            {"time": "10:30", "text": "東京晴空塔", "map": "https://www.google.com/maps/search/Tokyo+Skytree", "cat": "sight"},
            {"time": "11:00", "text": "Pokémon Center · Jump Shop · Kirby Café", "map": "https://www.google.com/maps/search/Pokemon+Center+Skytree+Town+Tokyo", "cat": "shop"},
            {"time": "12:30", "text": "午餐 — 敘敘苑 晴空塔 30F", "map": "https://www.google.com/maps/search/Jojoen+Tokyo+Skytree", "cat": "food"},
            {"time": "14:00", "text": "京成 Access 特急 → 成田機場", "cat": "transit"},
            {"time": "17:55", "text": "Depart Tokyo Narita (NRT)", "cat": "flight"},
            {"time": "21:00", "text": "Arrive Taipei (TPE)", "cat": "flight"},
        ]
    },
]

EXTRAS = [
    {"text": "", "note": "彭姥老進大東京"},
]

# caption / location 順序即為頁面顯示順序（3欄直式）
GALLERY = [
    {"id": "To1",   "caption": "Tokyo",       "location": "Tokyo"},
    {"id": "Tos2",  "caption": "新幹線",  "location": "Fujikyu Line"},
    {"id": "Tos3",  "caption": "-43",        "location": "Kawaguchiko"},
    {"id": "Tos4",  "caption": "日川時計店",    "location": "Shimoyoshida"},
    {"id": "Tos5",  "caption": "Shibuya Sky",  "location": "Shibuya"},
    {"id": "Tos6",  "caption": "Sunset",      "location": "Shibuya"},
    {"id": "Tos7",  "caption": "吉！",          "location": "淺草寺"},
    {"id": "Tos8",  "caption": "Steins;Gate",  "location": "Akihabara"},
    {"id": "Tos9",  "caption": "晴空，塔",        "location": "Tokyo Skytree"},
    {"id": "Tos10", "caption": "-43掰掰",        "location": "Sky"},
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
