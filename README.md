# MarketMind AI — Market Intelligence Terminal

เว็บวิเคราะห์ตลาดที่ใช้ **ข้อมูลจริง** (ไม่ต้องมี API key ก็ใช้ได้) + AI Analyst ที่เรียกข้อมูลผ่าน tools แล้วอธิบายเหตุผลพร้อมแหล่งที่มา

## เริ่มใช้งาน (3 ขั้นตอน)
```bash
npm install
cp .env.example .env.local     # ใส่ ANTHROPIC_API_KEY ถ้าต้องการ AI แบบ LLM (ไม่ใส่ก็ใช้ได้)
npm run dev                    # เปิด http://localhost:3000
```
Production: `npm run build && npm start` (หรือ deploy บน Vercel ได้ทันที — ตั้ง env ใน dashboard)

ต้องใช้ Node.js 20+ และเครื่องที่ต่ออินเทอร์เน็ตได้

## แหล่งข้อมูลจริง (ฟรี)
| ข้อมูล | แหล่ง | Key |
|---|---|---|
| ราคา/กราฟ หุ้น US, หุ้นไทย (.BK), ETF, FX, ทอง/น้ำมัน (futures), ดัชนี, Bond yield | Yahoo Finance chart API | ไม่ต้อง |
| คริปโต (ราคา/แท่งเทียน) | Binance spot (fallback Yahoo) | ไม่ต้อง |
| Funding rate, Open Interest | Binance futures | ไม่ต้อง |
| BTC dominance | CoinGecko | ไม่ต้อง |
| งบการเงิน, วันประกาศงบ, EPS estimate, เป้าราคานักวิเคราะห์ | Yahoo quoteSummary | ไม่ต้อง |
| ข่าว | Yahoo Finance RSS + Google News RSS | ไม่ต้อง |
| ปฏิทินเศรษฐกิจ (สัปดาห์นี้+หน้า) | Forex Factory JSON | ไม่ต้อง |
| COT (ทอง, เงิน, CME Bitcoin) | CFTC API | ไม่ต้อง |
| Fed Funds, CPI | FRED | `FRED_API_KEY` (ฟรี) |
| AI Analyst | Anthropic Claude (tool calling) | `ANTHROPIC_API_KEY` |

หมายเหตุ: XAUUSD ใช้ COMEX Gold futures (GC=F) เป็นตัวแทนราคา spot (แสดงบนหน้าจอ). ราคาหุ้นอาจดีเลย์ ~15 นาทีตามกฎตลาด.
ถ้าแหล่งใดดึงไม่ได้ ระบบจะแสดง **"Live data unavailable"** — ไม่สร้างตัวเลขเอง.

## โหมด DEMO
Settings → DEMO (หรือ `DATA_MODE=demo`) ใช้ข้อมูลจำลองสำหรับทดสอบ/นำเสนอแบบออฟไลน์ ทุกค่าถูกติดป้าย **DEMO DATA**

## AI
- มี `ANTHROPIC_API_KEY` → Claude เรียก tools: `getMarketPrice, getHistoricalPrices, getTechnicalIndicators, getNews, getEconomicCalendar, getFundamentals, getMacroData, getHistoricalEvents, getCompanyEarnings, getMarketRelationships` (ไม่ยัดข้อมูลทั้งหมดใน prompt) แล้วตอบแยก ข้อเท็จจริง / ข้อมูลในอดีต / การตีความ / Scenarios / ความเสี่ยง พร้อมแหล่งข้อมูล
- ไม่มี key → Rule-based analyst ใช้ tools ชุดเดียวกัน ตอบไทย/อังกฤษตามภาษาที่ถาม
- AI รู้ว่ากำลังดูสินทรัพย์ตัวไหน ("ตอนนี้เป็นยังไง" = ตัวที่เปิดอยู่) และห้ามฟันธงซื้อ/ขาย

## ฐานข้อมูล (ไม่บังคับ)
ตั้ง `DATABASE_URL` (PostgreSQL) → Watchlist และ Analysis History เก็บใน DB (สร้างตารางอัตโนมัติ). ไม่ตั้ง → เก็บในเบราว์เซอร์

## โครงสร้าง
```
src/lib/        market.ts (Yahoo/Binance) · news.ts · calendar.ts · fundamentals.ts · macro.ts
                events.ts (FOMC event study, correlations) · indicators.ts · analysis.ts (rule engine)
                tools.ts (AI tools) · ruleAnalyst.ts · demo.ts · db.ts
src/app/api/    chat (streaming tool loop) · overview · history · quotes · search · data/[kind] · store · status
src/app/        / · markets/[cat] · asset/[slug] · calendar · news · watchlist · insights · history · settings
```
ขยาย event study: เพิ่มวันที่ใน `EVENT_TYPES` (src/lib/events.ts) เช่น CPI/NFP. เพิ่มสินทรัพย์: `src/lib/assets.ts` (หรือค้นหา ticker ใดก็ได้จากช่อง search — ดึงจาก Yahoo)

> ข้อมูลเพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน
