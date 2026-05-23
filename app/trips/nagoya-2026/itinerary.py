"""
Nagoya 行程資料
直接在這裡改 note，改完跑 `python itinerary.py`
輸出結果貼進 page.tsx 的 ITINERARY 區塊取代即可
"""

ITINERARY = [
    {
        "day": 1, "date": "Feb 27, Fri", "location": "抵達名古屋 — 榮區",
        "items": [
            {"time": "14:55", "text": "Depart Taipei (TPE)", "cat": "flight"},
            {"time": "18:30", "text": "Arrive Nagoya (NGO)", "cat": "flight"},
            {"time": "20:25", "text": "Check-in · Nishitetsu Hotel Croom Nagoya", "map": "https://www.google.com/maps/search/Nishitetsu+Hotel+Croom+Nagoya", "cat": "stay"},
            {"time": "20:50", "text": "麵屋優光", "map": "https://www.google.com/maps/search/%E9%BA%BA%E5%B1%8B%E5%84%AA%E5%85%89+%E5%90%8D%E5%8F%A4%E5%B1%8B", "note": "京都風格貝類高湯拉麵，湯底清澈，第一餐！", "cat": "food"},
        ]
    },
    {
        "day": 2, "date": "Feb 28, Sat", "location": "名古屋市區巡禮",
        "items": [
            {"time": "09:00", "text": "Konparu (コンパル) — 榮地下街", "map": "https://www.google.com/maps/search/Konparu+%E3%82%B3%E3%83%B3%E3%83%91%E3%83%AB+%E6%A0%84+%E5%90%8D%E5%8F%A4%E5%B1%8B", "note": "炸蝦三明治必點。", "cat": "food"},
            {"time": "10:30", "text": "德川園 Tokugawaen", "map": "https://www.google.com/maps/search/%E5%BE%B3%E5%B7%9D%E5%9C%92+%E5%90%8D%E5%8F%A4%E5%B1%8B", "note": "很舒服的地方。", "cat": "sight"},
            {"time": "12:30", "text": "大須商店街 Osu", "map": "https://www.google.com/maps/search/%E5%A4%A7%E9%A0%88%E5%95%86%E5%BA%97%E8%A1%97+%E5%90%8D%E5%8F%A4%E5%B1%8B", "note": "大福、章魚燒、二手古著都在這。", "cat": "sight"},
            {"time": "13:00", "text": "大須大福 · 築地銀章魚燒 · Kagawa 烏龍麵", "map": "https://www.google.com/maps/search/%E5%A4%A7%E9%A0%88%E5%A4%A7%E7%A6%8F+%E5%90%8D%E5%8F%A4%E5%B1%8B", "cat": "food"},
            {"time": "14:30", "text": "Nagoya PARCO · Pokémon Center", "map": "https://www.google.com/maps/search/Pokemon+Center+Nagoya", "cat": "shop"},
            {"time": "15:30", "text": "HARBS", "map": "https://www.google.com/maps/search/HARBS+%E5%90%8D%E5%8F%A4%E5%B1%8B", "note": "招牌水果千層蛋糕。", "cat": "food"},
            {"time": "16:00", "text": "ALPEN Nagoya 旗艦店", "map": "https://www.google.com/maps/search/ALPEN+Nagoya", "cat": "shop"},
            {"time": "17:00", "text": "LACHIC 百貨", "map": "https://www.google.com/maps/search/LACHIC+%E5%90%8D%E5%8F%A4%E5%B1%8B", "cat": "shop"},
            {"time": "19:00", "text": "Mont-bell Nagoya · Onitsuka Tiger Nagoya", "map": "https://www.google.com/maps/search/Mont-bell+%E5%90%8D%E5%8F%A4%E5%B1%8B", "note": "我愛 Mont-bell & 鬼塚虎。", "cat": "shop"},
            {"time": "20:00", "text": "豬排 MATUMURA — 中日大廈", "map": "https://www.google.com/maps/search/MATUMURA+%E3%81%BE%E3%81%A4%E3%82%80%E3%82%89+%E5%90%8D%E5%8F%A4%E5%B1%8B", "note": "中日大樓裡的超好吃豬排！！", "cat": "food"},
        ]
    },
    {
        "day": 3, "date": "Mar 1, Sun", "location": "名古屋 → 飛驒高山",
        "items": [
            {"time": "10:00", "text": "Snow Peak Eat — 名古屋", "map": "https://www.google.com/maps/search/Snow+Peak+Eat+%E5%90%8D%E5%8F%A4%E5%B1%8B", "note": "我愛雪峰。", "cat": "cafe"},
            {"time": "11:30", "text": "Depart Nagoya · JR Limited Express Hida", "map": "https://www.google.com/maps/search/%E5%90%8D%E5%8F%A4%E5%B1%8B%E9%A7%85", "note": "特急飛驒號，沿途很美，越往北窗外積雪越深。", "cat": "transit"},
            {"time": "14:30", "text": "Check-in · Tokyu Stay Hida Takayama 結之湯", "map": "https://www.google.com/maps/search/Tokyu+Stay+Hida+Takayama", "cat": "stay"},
            {"time": "16:30", "text": "高山老街初訪 — 三町筋", "map": "https://www.google.com/maps/search/%E9%AB%98%E5%B1%B1%E4%B8%89%E7%94%BA%E7%AD%8B+%E8%80%81%E8%A1%97", "note": "今天人超級少，但滿多店家沒開。", "cat": "sight"},
            {"time": "17:30", "text": "丸明燒肉 Maruaki", "map": "https://www.google.com/maps/search/%E4%B8%B8%E6%98%8E+%E9%A3%9B%E9%A9%92%E7%89%9B+%E9%AB%98%E5%B1%B1", "note": "飛驒牛壽司配壽喜燒，吃完覺得沒很懂 XD。", "cat": "food"},
        ]
    },
    {
        "day": 4, "date": "Mar 2, Mon", "location": "世界遺產 — 白川鄉合掌村",
        "items": [
            {"time": "09:35", "text": "高山濃飛巴士中心 → 白川鄉", "map": "https://www.google.com/maps/search/%E7%99%BD%E5%B7%9D%E9%84%89+%E5%90%88%E6%8E%8C%E9%80%A0+%E5%B2%90%E9%98%9C%E7%B8%A3", "note": "從高山搭巴士約 50 分鐘。早班車去觀景台人少，避開觀光團。", "cat": "transit"},
            {"time": "10:30", "text": "荻町城跡觀景台 — 合掌村全景", "map": "https://www.google.com/maps/search/%E8%8D%BB%E7%94%BA%E5%9F%8E%E8%B7%A1%E5%B1%95%E6%9C%9B%E5%8F%B0+%E7%99%BD%E5%B7%9D%E9%84%89", "note": "走上來約 10 分鐘，最期待的地方。", "cat": "sight"},
            {"time": "12:00", "text": "村內散策 — 明善寺 · 和田家", "map": "https://www.google.com/maps/search/%E6%98%8E%E5%96%84%E5%AF%BA+%E7%99%BD%E5%B7%9D%E9%84%89", "cat": "sight"},
            {"time": "14:00", "text": "Return bus to Takayama", "cat": "transit"},
            {"time": "15:00", "text": "高山老街", "map": "https://www.google.com/maps/search/%E9%AB%98%E5%B1%B1%E5%B8%82+%E4%B8%89%E7%94%BA%E7%AD%8B", "note": "飛驒牛握壽司、史努比茶屋、米飛兔専賣店。", "cat": "sight"},
            {"time": "18:30", "text": "Matsuki-Ushi 松喜うし", "map": "https://www.google.com/maps/search/%E6%9D%BE%E5%96%9C%E3%81%86%E3%81%97+%E9%AB%98%E5%B1%B1", "note": "好吃但好貴。", "cat": "food"},
        ]
    },
    {
        "day": 5, "date": "Mar 3, Tue", "location": "高山 → 犬山城下町",
        "items": [
            {"time": "09:00", "text": "宮川朝市 Miyagawa Morning Market", "map": "https://www.google.com/maps/search/%E5%AE%AE%E5%B7%9D%E6%9C%9D%E5%B8%82+%E9%AB%98%E5%B1%B1", "cat": "sight"},
            {"time": "10:30", "text": "高山陣屋 Takayama Jinya", "map": "https://www.google.com/maps/search/%E9%AB%98%E5%B1%B1%E9%99%A3%E5%B1%8B", "note": "日本唯一完整保存的江戶時代代官所，裡面超大，只能穿襪子腳有夠冷，一路從腳底冷到頭頂＝＝", "cat": "sight"},
            {"time": "11:00", "text": "Hids' Cafe & Bar", "map": "https://www.google.com/maps/search/Hids+cafe+bar+%E9%AB%98%E5%B1%B1", "note": "超級讚的早午餐。", "cat": "cafe"},
            {"time": "12:30", "text": "JR 特急飛驒 → 鵜沼 · 轉名鐵犬山線 → 犬山遊園", "map": "https://www.google.com/maps/search/%E7%8A%AC%E5%B1%B1%E9%81%8A%E5%9C%92%E9%A7%85", "cat": "transit"},
            {"time": "15:00", "text": "Check-in · Hotel Indigo Inuyama Urakuen", "map": "https://www.google.com/maps/search/Hotel+Indigo+Inuyama+Urakuen", "cat": "stay"},
            {"time": "16:00", "text": "有樂苑 Urakuen", "map": "https://www.google.com/maps/search/%E6%9C%89%E6%A5%BD%E8%8B%91+%E7%8A%AC%E5%B1%B1", "note": "跪著喝茶，假裝自己是日本人。", "cat": "sight"},
            {"time": "17:30", "text": "Unakyu うな久 — 鰻魚飯", "map": "https://www.google.com/maps/search/%E3%81%86%E3%81%AA%E4%B9%85+%E7%8A%AC%E5%B1%B1", "note": "我愛鰻魚飯。", "cat": "food"},
            {"time": "20:00", "text": "英迪格精品溫泉", "cat": "onsen"},
        ]
    },
    {
        "day": 6, "date": "Mar 4, Wed", "location": "犬山 — 賦歸",
        "items": [
            {"time": "09:00", "text": "慢食早餐 — 飯店內", "cat": "food"},
            {"time": "11:30", "text": "國寶犬山城 · 三光稻荷神社 · 城下町街道", "map": "https://www.google.com/maps/search/%E7%8A%AC%E5%B1%B1%E5%9F%8E+%E5%9C%8B%E5%AF%B6", "cat": "sight"},
            {"time": "15:00", "text": "名鐵 μ-SKY → 中部國際機場 NGO", "map": "https://www.google.com/maps/search/%E4%B8%AD%E9%83%A8%E5%9C%8B%E9%9A%9B%E6%A9%9F%E5%A0%B4", "cat": "transit"},
            {"time": "19:40", "text": "Depart Nagoya (NGO)", "cat": "flight"},
            {"time": "22:15", "text": "Arrive Taipei (TPE)", "cat": "flight"},
        ]
    },
]

EXTRAS = [
    {"text": "", "note": "合掌村就是想像中的樣子，雪地裡的茅草屋頂，沉默又美。非常喜歡中部山區這種慢步調——下次想再去新穗高跟上高地走走。"},
]

# caption / location 順序即為頁面顯示順序（3欄直式）
GALLERY = [
    {"id": "NGs1",  "caption": "Shirakawago viewpoint",    "location": "Shirakawago"},
    {"id": "NGs2",  "caption": "合掌屋，針葉林",            "location": "Shirakawago"},
    {"id": "NGs3",  "caption": "麵屋優光",                  "location": "Nagoya"},
    {"id": "NGs4",  "caption": "Mont-bell, Chunichi Building", "location": "Nagoya"},
    {"id": "NGs5",  "caption": "Sakae skyline",             "location": "Nagoya"},
    {"id": "NGs6",  "caption": "Onitsuka Tiger Nagoya",     "location": "Nagoya"},
    {"id": "NGs7",  "caption": "大須大福",                  "location": "Osu"},
    {"id": "NGs8",  "caption": "Tonkatsu MATUMURA",         "location": "Chunichi Building"},
    {"id": "NGs9",  "caption": "Limited Express Hida",      "location": "en route to Takayama"},
    {"id": "NGs10", "caption": "Snoopy Tea House",          "location": "Takayama Old Town"},
    {"id": "NGs11", "caption": "合掌屋，雪",                "location": "Shirakawago"},
    {"id": "NGs12", "caption": "Main road, winter morning", "location": "Shirakawago"},
    {"id": "NGs13", "caption": "Matsuki-Ushi 松喜うし",     "location": "Takayama"},
    {"id": "NGs14", "caption": "Takayama Jinya",            "location": "Takayama"},
    {"id": "NGs15", "caption": "Hida bound for Nagoya",     "location": "Takayama Station"},
    {"id": "NGs16", "caption": "Inuyama Castle",            "location": "Inuyama"},
    {"id": "NGs17", "caption": "Hids' Cafe & Bar",          "location": "Takayama"},
    {"id": "NGs18", "caption": "Takayama Station, after dark", "location": "Takayama"},
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
