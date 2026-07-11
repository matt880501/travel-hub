export type Expedition = {
  label: string;
  sub: string;
  year: string;
  date: string;
  days: string;
  img: string;
  pos: string;
  slug?: string;
};

const HERO_IMG  = "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg";
const STRIP_IMG = "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1783683328/%E5%98%89%E6%98%8E%E6%B9%961_bkpcs0.jpg";

export const EXPEDITIONS: Expedition[] = [
  { label: "武陵四秀",  sub: "Wuling Four Peaks", year: "2025", date: "2025.12", days: "4D3N", img: HERO_IMG,  pos: "center 20%" },
  { label: "嘉明湖",    sub: "Jiaming Lake · Xiangyang · Sancha", year: "2023", date: "2023.6", days: "2D1N", img: STRIP_IMG, pos: "center 60%", slug: "jiaming-lake" },
  { label: "郡大山",    sub: "Jundashan Peak",    year: "2021", date: "2021.8",  days: "2D1N", img: HERO_IMG,  pos: "center 70%" },
  { label: "玉山主北西", sub: "Yu Shan",           year: "2021", date: "2021.3",  days: "2D1N", img: STRIP_IMG, pos: "center 30%" },
  { label: "合歡西峰",  sub: "Hehuan West",       year: "2020", date: "2020.6",  days: "1D",   img: HERO_IMG,  pos: "center 50%" },
  { label: "雪山主東",  sub: "Snow Mountain",     year: "2019", date: "2019.7",  days: "2D1N", img: STRIP_IMG, pos: "center 10%" },
  { label: "玉山前峰",  sub: "Yu Shan Front",     year: "2019", date: "2019.4",  days: "1D",   img: HERO_IMG,  pos: "center 40%" },
  { label: "玉山主峰",  sub: "Yu Shan",           year: "2018", date: "2018.6",  days: "2D1N", img: STRIP_IMG, pos: "center 50%" },
  { label: "合歡群峰 & 石門山", sub: "Hehuan Massif", year: "2017", date: "", days: "2D1N", img: HERO_IMG, pos: "center 30%" },
];

export const BY_YEAR = Object.entries(
  EXPEDITIONS.reduce<Record<string, Expedition[]>>((acc, e) => {
    (acc[e.year] = acc[e.year] || []).push(e);
    return acc;
  }, {})
).sort(([a], [b]) => Number(b) - Number(a));

export const TOTAL = 18;
