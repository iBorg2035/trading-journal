import { useState, useEffect } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0c0f",
  surf: "#111418",
  card: "#131820",
  bord: "#1e2329",
  bord2: "#242f40",
  G: "#00d48a",
  R: "#ff4d6a",
  A: "#f5a623",
  B: "#3d9eff",
  P: "#c084fc",
  text: "#e8eaed",
  sub: "#9aa3af",
  muted: "#5a6170",
};

const ACCENT_COLORS = [C.G, C.A, C.B, C.R, C.P, "#fb923c", "#38bdf8", "#f472b6"];

// ─── STORAGE KEYS ─────────────────────────────────────────────────────────────
const SK = {
  userSessions: "tj2-user-sessions",   // manually added sessions
  overrides: "tj2-overrides",        // edits to hardcoded sessions {id: sessionObj}
  deletions: "tj2-deletions",        // deleted hardcoded session ids
  framework: "tj2-framework",
  settings: "tj2-settings",
  weeks: "tj2-weeks",
};

// ─── HARDCODED SESSIONS FROM PDFs ─────────────────────────────────────────────
// Updated: Mar 19 2026
const PDF_SESSIONS = [
  {
    id: "pdf-mar13", date: "2026-03-13", label: "Mar 13", symbol: "MESH6",
    netPnl: 509.00, grossPnl: 525.00, fees: 16, trades: 6, wins: 3, losses: 3,
    winRate: 50, avgWin: 305.00, avgLoss: 130.00, expectancy: 87.50,
    maxRunup: 707.00, maxDrawdown: 208.00, avgHold: "2:22:13", contracts: 40,
    tradeLog: [
      { id: "t1", time: "00:38:30", direction: "L", entry: 6689.50, exit: 6698.50, sl: "", tp: "", duration: "4:20:43", pnl: 180.00, rr: "", setup: "Order Block", confluence: "London Sweep", note: "Overnight long" },
      { id: "t2", time: "00:38:30", direction: "L", entry: 6689.50, exit: 6695.00, sl: "", tp: "", duration: "4:22:52", pnl: 110.00, rr: "", setup: "Order Block", confluence: "London Sweep", note: "Overnight long · longest hold" },
      { id: "t3", time: "08:28:08", direction: "S", entry: 6714.50, exit: 6704.50, sl: "", tp: "", duration: "17:02", pnl: -50.00, rr: "", setup: "Reversal", confluence: "", note: "Pre-market short · 1 contract" },
      { id: "t4", time: "08:28:08", direction: "S", entry: 6714.50, exit: 6704.50, sl: "", tp: "", duration: "17:03", pnl: -150.00, rr: "", setup: "Reversal", confluence: "", note: "Pre-market short · 3 contracts" },
      { id: "t5", time: "08:47:14", direction: "L", entry: 6685.50, exit: 6716.75, sl: "", tp: "", duration: "1:58:37", pnl: 625.00, rr: "", setup: "Order Block", confluence: "Trend", note: "⭐ Order block bounce after sweep · 31.25pt move 🎄" },
      { id: "t6", time: "13:47:27", direction: "S", entry: 6642.00, exit: 6632.50, sl: "", tp: "", duration: "2:56:59", pnl: -190.00, rr: "", setup: "Reversal", confluence: "", note: "Afternoon short · largest loss" },
    ],
    notes: [
      { id: "n1", color: C.G, title: "3/6 · 50% · +$509 · Rules Day — Breakthrough", content: "Followed the rules. Focused on previous session sweeps. +$625 off an order block bounce after a sweep. 31.25 points on 4 contracts. First time clearly identifying the setup — Christmas gift." },
      { id: "n2", color: C.R, title: "Mar 12 vs Mar 13 — The Contrast", content: "Coming off 38 trades yesterday, only 6 trades today and $16 in fees vs $137. Quality over quantity is the entire game." },
    ]
  },
  {
    id: "pdf-mar12", date: "2026-03-12", label: "Mar 12", symbol: "MESH6",
    netPnl: 333.00, grossPnl: 470.00, fees: 137, trades: 38, wins: 21, losses: 17,
    winRate: 55.26, avgWin: 163.93, avgLoss: 174.85, expectancy: 12.37,
    maxRunup: 835.00, maxDrawdown: 582.50, avgHold: "19:02", contracts: 268,
    tradeLog: [
      { id: "t1", time: "23:38", direction: "L", entry: 6706.25, exit: 6734.00, duration: "3:43:30", pnl: 277.50, note: "Late night long · 27.75pt" },
      { id: "t2", time: "09:34", direction: "S", entry: 6728.50, exit: 6697.75, duration: "21:44", pnl: -307.50, note: "Largest loss" },
      { id: "t3", time: "09:49", direction: "S", entry: 6710.50, exit: 6697.75, duration: "7:01", pnl: -127.50, note: "" },
      { id: "t4", time: "10:00", direction: "L", entry: 6707.50, exit: 6716.25, duration: "4:54", pnl: 87.50, note: "" },
      { id: "t5", time: "09:57", direction: "L", entry: 6702.00, exit: 6716.25, duration: "8:08", pnl: 142.50, note: "" },
      { id: "t6", time: "10:05", direction: "S", entry: 6717.25, exit: 6698.75, duration: "23:50", pnl: -185.00, note: "" },
      { id: "t7", time: "10:25", direction: "S", entry: 6714.00, exit: 6698.25, duration: "4:33", pnl: -157.50, note: "" },
      { id: "t8", time: "10:30", direction: "L", entry: 6698.00, exit: 6705.25, duration: "14:15", pnl: 145.00, note: "4c" },
      { id: "t9", time: "10:46", direction: "L", entry: 6708.25, exit: 6714.25, duration: "0:14", pnl: 120.00, note: "4c" },
      { id: "t10", time: "10:46", direction: "L", entry: 6717.25, exit: 6719.00, duration: "0:19", pnl: 35.00, note: "4c" },
      { id: "t11", time: "10:47", direction: "L", entry: 6713.25, exit: 6716.75, duration: "0:21", pnl: 70.00, note: "4c" },
      { id: "t12", time: "10:47", direction: "L", entry: 6711.00, exit: 6704.75, duration: "1:14", pnl: -125.00, note: "4c" },
      { id: "t13", time: "10:49", direction: "L", entry: 6699.75, exit: 6687.75, duration: "23:21", pnl: -240.00, note: "4c" },
      { id: "t14", time: "11:13", direction: "L", entry: 6685.75, exit: 6699.25, duration: "14:00", pnl: 270.00, note: "4c" },
      { id: "t15", time: "11:27", direction: "L", entry: 6700.00, exit: 6694.75, duration: "2:29", pnl: -105.00, note: "4c" },
      { id: "t16", time: "11:31", direction: "L", entry: 6699.00, exit: 6696.25, duration: "0:38", pnl: -55.00, note: "4c" },
      { id: "t17", time: "11:31", direction: "L", entry: 6698.50, exit: 6712.00, duration: "8:31", pnl: 270.00, note: "4c" },
      { id: "t18", time: "11:41", direction: "L", entry: 6711.00, exit: 6713.00, duration: "1:47", pnl: 40.00, note: "4c" },
      { id: "t19", time: "11:46", direction: "L", entry: 6707.50, exit: 6712.00, duration: "3:50", pnl: 90.00, note: "4c" },
      { id: "t20", time: "11:47", direction: "L", entry: 6702.75, exit: 6711.25, duration: "1:09", pnl: 170.00, note: "4c" },
      { id: "t21", time: "12:05", direction: "S", entry: 6718.50, exit: 6707.25, duration: "15:22", pnl: -225.00, note: "4c" },
      { id: "t22", time: "12:06", direction: "S", entry: 6713.75, exit: 6701.50, duration: "1:20", pnl: -245.00, note: "4c" },
      { id: "t23", time: "12:10", direction: "L", entry: 6695.50, exit: 6713.50, duration: "6:47", pnl: 360.00, note: "⭐ Largest winner · 4c" },
      { id: "t24", time: "12:21", direction: "S", entry: 6723.75, exit: 6710.25, duration: "3:40", pnl: -270.00, note: "4c" },
      { id: "t25", time: "12:26", direction: "L", entry: 6706.75, exit: 6723.00, duration: "3:40", pnl: 325.00, note: "4c" },
      { id: "t26", time: "12:27", direction: "S", entry: 6706.00, exit: 6704.50, duration: "0:50", pnl: -30.00, note: "4c" },
      { id: "t27", time: "12:28", direction: "L", entry: 6704.50, exit: 6714.25, duration: "13:07", pnl: 195.00, note: "4c" },
      { id: "t28", time: "12:41", direction: "S", entry: 6715.00, exit: 6710.75, duration: "2:34", pnl: -85.00, note: "4c" },
      { id: "t29", time: "12:46", direction: "L", entry: 6703.00, exit: 6712.50, duration: "18:39", pnl: 190.00, note: "4c" },
      { id: "t30", time: "13:15", direction: "S", entry: 6705.00, exit: 6691.25, duration: "39:54", pnl: -275.00, note: "4c" },
      { id: "t31", time: "13:56", direction: "S", entry: 6691.50, exit: 6680.00, duration: "1:53:54", pnl: -230.00, note: "4c · longest loss" },
      { id: "t32", time: "18:09", direction: "L", entry: 6684.25, exit: 6690.25, duration: "25:15", pnl: 60.00, note: "2c" },
      { id: "t33", time: "18:09", direction: "L", entry: 6684.25, exit: 6690.25, duration: "25:17", pnl: 60.00, note: "2c" },
      { id: "t34", time: "18:50", direction: "L", entry: 6689.00, exit: 6691.25, duration: "13:00", pnl: 45.00, note: "4c" },
      { id: "t35", time: "18:50", direction: "L", entry: 6689.00, exit: 6695.50, duration: "16:47", pnl: 130.00, note: "4c" },
      { id: "t36", time: "19:11", direction: "L", entry: 6690.50, exit: 6687.25, duration: "14:58", pnl: -65.00, note: "4c" },
      { id: "t37", time: "19:28", direction: "L", entry: 6688.75, exit: 6676.50, duration: "32:11", pnl: -245.00, note: "4c" },
      { id: "t38", time: "20:02", direction: "L", entry: 6671.75, exit: 6689.75, duration: "10:13", pnl: 360.00, note: "⭐ Largest winner tie · 4c" },
    ],
    notes: [
      { id: "n1", color: C.R, title: "⚠️ Off The Rails — 38 Trades · $137 Fees", content: "Not the strategy. 38 trades chopping ranges. $137 in commissions = 29% of gross. The clearest data point: overtrading kills the edge." },
      { id: "n2", color: C.A, title: "What Went Wrong", content: "Trading ranges instead of sweeps. Avg loss ($174.85) exceeded avg win ($163.93). Max drawdown $582.50. No session discipline — traded overnight through evening." },
    ]
  },
  {
    id: "pdf-mar11", date: "2026-03-11", label: "Mar 11", symbol: "MESH6",
    netPnl: 358.50, grossPnl: 372.50, fees: 14, trades: 7, wins: 4, losses: 3,
    winRate: 57.14, avgWin: 129.38, avgLoss: 48.33, expectancy: 53.21,
    maxRunup: 370.50, maxDrawdown: 127.50, avgHold: "1:33:04", contracts: 28,
    tradeLog: [
      { id: "t1", time: "09:55:53", direction: "L", entry: 6785.00, exit: 6807.50, duration: "4:44", pnl: 225.00, setup: "Liquidity Sweep", note: "⭐ Largest winner · 22.5pt" },
      { id: "t2", time: "10:01:11", direction: "L", entry: 6799.25, exit: 6812.50, duration: "7:52", pnl: 132.50, setup: "Trend Continuation", note: "" },
      { id: "t3", time: "10:15:21", direction: "L", entry: 6795.00, exit: 6783.00, duration: "8:32", pnl: -120.00, setup: "Reversal", note: "Largest loss" },
      { id: "t4", time: "10:30:06", direction: "L", entry: 6780.00, exit: 6781.75, duration: "41:11", pnl: 17.50, note: "Scratch" },
      { id: "t5", time: "11:11:45", direction: "L", entry: 6783.75, exit: 6782.25, duration: "0:27", pnl: -15.00, note: "Quick stop" },
      { id: "t6", time: "11:29:58", direction: "L", entry: 6762.50, exit: 6776.75, duration: "4:51:39", pnl: 142.50, setup: "Trend Continuation", note: "⭐ 4hr 51min patient hold" },
      { id: "t7", time: "11:24:34", direction: "L", entry: 6777.75, exit: 6776.75, duration: "4:57:04", pnl: -10.00, note: "6777 pivot — scratch loss" },
    ],
    notes: [
      { id: "n1", color: C.A, title: "4/7 · 57% · +$358.50", content: "Not a clean day but closed green. Two big winners carried it. 6777 pivot rejected 3x after stepping away." },
    ]
  },
  {
    id: "pdf-mar06", date: "2026-03-06", label: "Mar 6", symbol: "MESH6",
    netPnl: 550.50, grossPnl: 562.50, fees: 12, trades: 4, wins: 4, losses: 0,
    winRate: 100, avgWin: 140.62, avgLoss: 0, expectancy: 140.62,
    maxRunup: 553.50, maxDrawdown: 3.00, avgHold: "7:39", contracts: 24,
    tradeLog: [
      { id: "t1", time: "10:00:13", direction: "L", entry: 6739.25, exit: 6759.25, sl: 6725.25, tp: 6759.25, duration: "22:49", pnl: 300.00, rr: "1.43", setup: "Liquidity Sweep", confluence: "Trend", note: "⭐ 20pt sweep · do not trade against trend!" },
      { id: "t2", time: "10:40:02", direction: "S", entry: 6773.50, exit: 6767.00, sl: 6780.00, tp: 6736.50, duration: "2:15", pnl: 97.50, rr: "0.93", setup: "Reversal", confluence: "NFP Vol", note: "NFP + unemployment + core sales" },
      { id: "t3", time: "10:43:23", direction: "S", entry: 6764.00, exit: 6758.50, sl: 6758.00, tp: 6758.00, duration: "4:53", pnl: 82.50, rr: "1.00", setup: "Reversal", confluence: "NFP Vol", note: "NFP continuation short" },
      { id: "t4", time: "10:55:51", direction: "L", entry: 6763.75, exit: 6769.25, duration: "0:39", pnl: 82.50, rr: "—", setup: "Trend Continuation", confluence: "NFP Vol", note: "Quick continuation" },
    ],
    notes: [
      { id: "n1", color: C.G, title: "4/4 · 100% · +$550.50 · NFP Day", content: "Perfect execution. Largest winner $300 on 20pt liquidity sweep long. All four trades winners." },
      { id: "n2", color: C.A, title: "Key Lesson", content: "Do not trade against the trend of the day. Liquidity sweep aligned with daily trend = $300." },
    ]
  },
  {
    id: "pdf-feb20", date: "2026-02-20", label: "Feb 20", symbol: "MESH6",
    netPnl: 667.50, grossPnl: 682.50, fees: 15, trades: 6, wins: 6, losses: 0,
    winRate: 100, avgWin: 113.75, avgLoss: 0, expectancy: 113.75,
    maxRunup: 670.50, maxDrawdown: 3.00, avgHold: "4:22:14", contracts: 36,
    tradeLog: [
      { id: "t1", time: "07:15:43", direction: "L", entry: 6872.75, exit: 6884.75, duration: "11:40:04", pnl: 180.00, note: "⭐ Overnight hold" },
      { id: "t2", time: "07:15:43", direction: "L", entry: 6872.75, exit: 6874.00, duration: "13:13:53", pnl: 18.75, note: "Longest hold · 13hr" },
      { id: "t3", time: "10:09:50", direction: "L", entry: 6899.25, exit: 6909.50, duration: "33:53", pnl: 153.75, note: "NY open long" },
      { id: "t4", time: "11:22:53", direction: "L", entry: 6899.75, exit: 6908.00, duration: "38:20", pnl: 123.75, note: "" },
      { id: "t5", time: "11:30:04", direction: "L", entry: 6890.75, exit: 6897.75, duration: "1:02", pnl: 105.00, note: "Quick scalp" },
      { id: "t6", time: "11:32:45", direction: "L", entry: 6901.25, exit: 6908.00, duration: "6:12", pnl: 101.25, note: "Passed eval 🎯" },
    ],
    notes: [{ id: "n1", color: C.G, title: "6/6 · 100% · +$667.50 · Passed Eval 🎯", content: "Perfect day to close the week and pass evaluation." }]
  },
  {
    id: "pdf-feb19", date: "2026-02-19", label: "Feb 19", symbol: "MESH6",
    netPnl: 565.50, grossPnl: 577.50, fees: 12, trades: 4, wins: 4, losses: 0,
    winRate: 100, avgWin: 144.38, avgLoss: 0, expectancy: 144.38,
    maxRunup: 568.50, maxDrawdown: 3.00, avgHold: "50:23", contracts: 24,
    tradeLog: [
      { id: "t1", time: "09:43:27", direction: "L", entry: 6871.25, exit: 6887.50, duration: "52:20", pnl: 243.75, note: "⭐ Largest winner" },
      { id: "t2", time: "10:51:01", direction: "L", entry: 6879.75, exit: 6886.50, duration: "14:20", pnl: 101.25, note: "" },
      { id: "t3", time: "10:52:24", direction: "L", entry: 6879.50, exit: 6885.75, duration: "9:41", pnl: 93.75, note: "" },
      { id: "t4", time: "13:45:51", direction: "L", entry: 6861.50, exit: 6870.75, duration: "2:05:12", pnl: 138.75, note: "2hr hold" },
    ],
    notes: [{ id: "n1", color: C.G, title: "4/4 · 100% · +$565.50", content: "Four trades, four winners." }]
  },
  {
    id: "pdf-feb18", date: "2026-02-18", label: "Feb 18", symbol: "MESH6",
    netPnl: 393.00, grossPnl: 405.00, fees: 12, trades: 4, wins: 4, losses: 0,
    winRate: 100, avgWin: 101.25, avgLoss: 0, expectancy: 101.25,
    maxRunup: 396.00, maxDrawdown: 3.00, avgHold: "1:11:57", contracts: 24,
    tradeLog: [
      { id: "t1", time: "08:43:48", direction: "L", entry: 6880.75, exit: 6888.25, duration: "11:20", pnl: 112.50, note: "Pre-market long" },
      { id: "t2", time: "08:58:32", direction: "L", entry: 6873.75, exit: 6875.00, duration: "27:51", pnl: 18.75, note: "Small scalp" },
      { id: "t3", time: "13:53:09", direction: "L", entry: 6895.50, exit: 6909.25, duration: "3:45:25", pnl: 206.25, note: "⭐ 3hr 45min hold" },
      { id: "t4", time: "14:18:15", direction: "L", entry: 6896.75, exit: 6901.25, duration: "23:11", pnl: 67.50, note: "Afternoon continuation" },
    ],
    notes: [{ id: "n1", color: C.G, title: "4/4 · 100% · +$393.00", content: "Second consecutive perfect session." }]
  },
  {
    id: "pdf-feb17", date: "2026-02-17", label: "Feb 17", symbol: "MESH6",
    netPnl: 624.75, grossPnl: 648.75, fees: 24, trades: 8, wins: 6, losses: 2,
    winRate: 75, avgWin: 150, avgLoss: 125.62, expectancy: 81.09,
    maxRunup: 795.75, maxDrawdown: 169.50, avgHold: "24:31", contracts: 48,
    tradeLog: [
      { id: "t1", time: "09:47:20", direction: "S", entry: 6836.50, exit: 6825.50, duration: "3:10", pnl: -165.00, note: "Hard SL hit" },
      { id: "t2", time: "10:01:49", direction: "L", entry: 6806.00, exit: 6822.50, duration: "19:16", pnl: 247.50, note: "⭐ Swept Feb 6 London Low · 11-day level" },
      { id: "t3", time: "10:22:18", direction: "L", entry: 6822.00, exit: 6830.50, duration: "40:02", pnl: 127.50, note: "Continuation long" },
      { id: "t4", time: "11:31:03", direction: "L", entry: 6843.50, exit: 6857.75, duration: "1:54", pnl: 213.75, note: "Quick momentum" },
      { id: "t5", time: "11:38:32", direction: "S", entry: 6860.00, exit: 6854.25, duration: "5:32", pnl: -86.25, note: "Hard SL hit" },
      { id: "t6", time: "12:13:53", direction: "L", entry: 6847.75, exit: 6853.75, duration: "29:31", pnl: 90.00, note: "" },
      { id: "t7", time: "12:23:07", direction: "L", entry: 6840.00, exit: 6844.75, duration: "8:50", pnl: 71.25, note: "" },
      { id: "t8", time: "15:28:57", direction: "L", entry: 6863.50, exit: 6873.50, duration: "1:27:51", pnl: 150.00, note: "FVG reversal" },
    ],
    notes: [
      { id: "n1", color: C.G, title: "⭐ Trade of the Day — 10:01 AM (+$247.50)", content: "Swept the Feb 6 London Low — 11-day old untouched level. Multi-week level + real sweep + reversal = highest confluence." },
      { id: "n2", color: C.A, title: "Stop Loss Observation", content: "Both losses had hard SL. All 6 winners had no stop. Mental stop: price closes back through EMA on 15-sec = exit." },
    ]
  },
  {
    id: "pdf-feb13", date: "2026-02-13", label: "Feb 13", symbol: "MESH6",
    netPnl: 759.00, grossPnl: 840.00, fees: 81, trades: 27, wins: 19, losses: 8,
    winRate: 70.37, avgWin: 81.71, avgLoss: 89.06, expectancy: 31.11,
    maxRunup: 902.25, maxDrawdown: 293.25, avgHold: "5:04", contracts: 162,
    tradeLog: [
      { id: "t1", time: "10:29:08", direction: "S", entry: 6875.00, exit: 6867.00, duration: "3:49", pnl: -120.00, note: "" },
      { id: "t2", time: "11:17:47", direction: "L", entry: 6862.75, exit: 6874.00, duration: "2:59", pnl: 168.75, note: "" },
      { id: "t3", time: "11:24:08", direction: "L", entry: 6854.50, exit: 6871.25, duration: "3:44", pnl: 251.25, note: "⭐ Largest winner" },
      { id: "t4", time: "11:21:12", direction: "L", entry: 6859.50, exit: 6871.25, duration: "6:41", pnl: 176.25, note: "" },
      { id: "t5", time: "11:28:06", direction: "L", entry: 6869.00, exit: 6870.50, duration: "9:55", pnl: 22.50, note: "" },
      { id: "t6", time: "11:38:11", direction: "L", entry: 6871.75, exit: 6876.50, duration: "1:00", pnl: 71.25, note: "" },
      { id: "t7", time: "11:39:19", direction: "L", entry: 6875.75, exit: 6876.00, duration: "3:53", pnl: 3.75, note: "" },
      { id: "t8", time: "11:43:24", direction: "S", entry: 6883.25, exit: 6877.75, duration: "2:55", pnl: -82.50, note: "" },
      { id: "t9", time: "11:48:54", direction: "L", entry: 6878.75, exit: 6884.50, duration: "6:03", pnl: 86.25, note: "" },
      { id: "t10", time: "11:47:39", direction: "L", entry: 6881.50, exit: 6884.50, duration: "7:18", pnl: 45.00, note: "" },
      { id: "t11", time: "14:10:12", direction: "L", entry: 6884.00, exit: 6887.25, duration: "1:40", pnl: 48.75, note: "" },
      { id: "t12", time: "14:13:36", direction: "L", entry: 6883.75, exit: 6884.50, duration: "6:25", pnl: 11.25, note: "" },
      { id: "t13", time: "14:21:14", direction: "S", entry: 6887.00, exit: 6886.50, duration: "3:58", pnl: -7.50, note: "" },
      { id: "t14", time: "14:25:34", direction: "S", entry: 6887.25, exit: 6881.00, duration: "10:02", pnl: -93.75, note: "" },
      { id: "t15", time: "14:36:20", direction: "L", entry: 6874.75, exit: 6880.50, duration: "3:23", pnl: 86.25, note: "" },
      { id: "t16", time: "14:40:06", direction: "L", entry: 6869.00, exit: 6875.75, duration: "1:40", pnl: 101.25, note: "" },
      { id: "t17", time: "14:46:14", direction: "L", entry: 6873.00, exit: 6876.50, duration: "1:48", pnl: 52.50, note: "" },
      { id: "t18", time: "15:31:38", direction: "S", entry: 6842.25, exit: 6835.00, duration: "5:42", pnl: -108.75, note: "Late session chop begins" },
      { id: "t19", time: "15:40:32", direction: "L", entry: 6834.25, exit: 6840.50, duration: "2:52", pnl: 93.75, note: "" },
      { id: "t20", time: "15:37:26", direction: "L", entry: 6834.25, exit: 6836.25, duration: "5:59", pnl: 30.00, note: "" },
      { id: "t21", time: "15:46:04", direction: "S", entry: 6846.00, exit: 6837.25, duration: "3:10", pnl: -131.25, note: "" },
      { id: "t22", time: "15:44:11", direction: "S", entry: 6846.00, exit: 6836.00, duration: "5:03", pnl: -150.00, note: "Largest loss · Max drawdown" },
      { id: "t23", time: "15:55:58", direction: "L", entry: 6846.50, exit: 6851.25, duration: "3:31", pnl: 71.25, note: "" },
      { id: "t24", time: "15:52:40", direction: "L", entry: 6840.25, exit: 6851.25, duration: "6:49", pnl: 165.00, note: "" },
      { id: "t25", time: "16:11:29", direction: "L", entry: 6848.00, exit: 6851.50, duration: "1:43", pnl: 52.50, note: "" },
      { id: "t26", time: "16:00:37", direction: "S", entry: 6852.75, exit: 6851.50, duration: "12:35", pnl: -18.75, note: "" },
      { id: "t27", time: "16:20:49", direction: "L", entry: 6847.75, exit: 6848.75, duration: "12:02", pnl: 15.00, note: "" },
    ],
    notes: [
      { id: "n1", color: C.A, title: "Day 1 — 27 Trades · $81 Fees", content: "Win rate 70% but avg loss exceeded avg win. $81 commissions a significant drag." },
      { id: "n2", color: C.R, title: "Late Session Danger Zone", content: "5 of 8 losses after 15:30. Lesson: stop trading after 15:00." },
    ]
  },
];

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────
const DEFAULT_FW = {
  steps: [
    { id: "s1", num: "01", title: "Real Sweep", color: C.G, desc: "Previous session H/L, London H/L, Asia H/L. Place limit and walk away — no screen staring required." },
    { id: "s2", num: "02", title: "EMA Cross", color: C.B, desc: "9/21 EMA crossover confirms reversal direction on execution chart." },
    { id: "s3", num: "03", title: "FVG / OB", color: C.A, desc: "Fair Value Gap or Order Block as entry zone. Order block bounce after sweep confirmed Mar 13." },
    { id: "s4", num: "04", title: "Daily Context", color: C.P, desc: "Know daily hi/lo. Don't trade against the trend of the day." },
    { id: "s5", num: "05", title: "Time Bias", color: C.R, desc: "NY open 9:30–11 AM prime window. Avoid after 15:00 — late session chop kills edge." },
  ],
  levels: [
    { id: "l1", color: C.G, name: "London High/Low", desc: "Highest priority. NY sweeps overnight range then reverses and delivers." },
    { id: "l2", color: C.B, name: "Asia High/Low", desc: "Overnight range boundaries. Strong if untouched into NY open." },
    { id: "l3", color: C.A, name: "PDH / PDL", desc: "Previous day high/low. Always on chart. Dense stop clusters." },
    { id: "l4", color: C.R, name: "Multi-Day Levels", desc: "11+ day old untouched levels. More stops = sharper reversal." },
  ],
};
const DEFAULT_SETTINGS = { goal: 2450, balance: 1257, symbol: "MESH6" };

// ─── UTILS ────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (v) => ((+v || 0) >= 0 ? "+" : "") + "$" + Math.abs(+v || 0).toFixed(2);
const pc = (v) => (+v || 0) >= 0 ? C.G : C.R;
const clamp = (v, mn, mx) => Math.min(mx, Math.max(mn, v));

function useLS(key, def) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; }
    catch { return def; }
  });
  const set = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { }
  };
  return [val, set];
}

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────
function Btn({ children, onClick, color = C.G, fill, sm, danger, disabled }) {
  const c = danger ? C.R : color;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: fill ? c : "none",
      border: `1px solid ${c}`,
      color: fill ? "#0a0c0f" : c,
      padding: sm ? "3px 10px" : "8px 18px",
      fontSize: sm ? 10 : 11,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: ".06em", fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: 2, opacity: disabled ? 0.4 : 1,
    }}>{children}</button>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      padding: "10px 16px", fontSize: 10, letterSpacing: ".12em",
      textTransform: "uppercase", fontWeight: 700,
      fontFamily: "'Syne', sans-serif",
      color: active ? C.G : C.muted,
      borderBottom: `2px solid ${active ? C.G : "transparent"}`,
    }}>{label}</button>
  );
}

function Stat({ label, value, sub, color }) {
  return (
    <div style={{ background: C.surf, padding: "14px 18px" }}>
      <div style={{ fontSize: 9, letterSpacing: ".14em", color: C.muted, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: color || C.text }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, rows, options, list, listId, full, style = {} }) {
  const base = {
    background: C.bg, border: `1px solid ${C.bord2}`, color: C.text,
    padding: "7px 10px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
    outline: "none", borderRadius: 2,
    width: full ? "100%" : undefined, boxSizing: "border-box",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      {label && <label style={{ fontSize: 9, letterSpacing: ".12em", color: C.muted, textTransform: "uppercase" }}>{label}</label>}
      {options
        ? <select value={value} onChange={e => onChange(e.target.value)} style={base}>
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
        : rows
          ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{ ...base, resize: "vertical" }} />
          : <>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} list={listId} />
            {list && listId && <datalist id={listId}>{list.map(o => <option key={o} value={o} />)}</datalist>}
          </>
      }
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surf, border: `1px solid ${C.G}`, borderRadius: 3, padding: 28, width: "100%", maxWidth: wide ? 860 : 520, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.G, letterSpacing: ".1em", textTransform: "uppercase", fontFamily: "'Syne',sans-serif" }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: ".12em", color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Color</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ACCENT_COLORS.map(c => (
          <button key={c} onClick={() => onChange(c)} style={{ width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer", border: `2px solid ${value === c ? "#fff" : "transparent"}`, outline: value === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
        ))}
      </div>
    </div>
  );
}

function Confirm({ msg, onConfirm, onClose }) {
  return (
    <Modal title="Confirm Delete" onClose={onClose}>
      <p style={{ fontSize: 13, color: C.sub, marginBottom: 24, lineHeight: 1.7 }}>{msg}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn onClick={onClose} color={C.muted}>Cancel</Btn>
        <Btn onClick={() => { onConfirm(); onClose(); }} danger fill>Delete</Btn>
      </div>
    </Modal>
  );
}

function EmptyState({ msg, action, onAction }) {
  return (
    <div style={{ background: C.surf, border: `1px dashed ${C.bord2}`, borderRadius: 2, padding: 48, textAlign: "center" }}>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>{msg}</div>
      {action && <Btn onClick={onAction} color={C.G}>{action}</Btn>}
    </div>
  );
}

function SessSelector({ sessions, si, setSi }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
      {sessions.map((s, i) => (
        <button key={s.id} onClick={() => setSi(i)} style={{
          background: i === si ? C.G : C.surf, color: i === si ? "#0a0c0f" : C.muted,
          border: `1px solid ${i === si ? C.G : C.bord}`,
          padding: "4px 12px", fontSize: 10, cursor: "pointer", borderRadius: 2,
          fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
        }}>{s.label}</button>
      ))}
    </div>
  );
}

// ─── SESSION FORM ─────────────────────────────────────────────────────────────
const EMPTY_SESS = () => ({ id: uid(), date: "", label: "", symbol: "MESH6", netPnl: "", grossPnl: "", fees: "", trades: "", wins: "", losses: "", winRate: "", avgWin: "", avgLoss: "", expectancy: "", maxRunup: "", maxDrawdown: "", avgHold: "", contracts: "", tradeLog: [], notes: [] });

function SessionForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init ? { ...init } : EMPTY_SESS());
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={init ? "Edit Session" : "New Session"} onClose={onClose} wide>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
        <Field label="Label" value={f.label} onChange={v => set("label", v)} full />
        <Field label="Date" type="date" value={f.date} onChange={v => set("date", v)} full />
        <Field label="Symbol" value={f.symbol} onChange={v => set("symbol", v)} full />
      </div>
      <div style={{ fontSize: 9, letterSpacing: ".14em", color: C.muted, textTransform: "uppercase", marginBottom: 12, borderTop: `1px solid ${C.bord}`, paddingTop: 14 }}>Stats</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[["Net P&L", "netPnl"], ["Gross P&L", "grossPnl"], ["Fees", "fees"], ["Contracts", "contracts"],
        ["# Trades", "trades"], ["# Wins", "wins"], ["# Losses", "losses"], ["Win Rate %", "winRate"],
        ["Avg Win", "avgWin"], ["Avg Loss", "avgLoss"], ["Expectancy", "expectancy"], ["Max Run-up", "maxRunup"],
        ["Max Drawdown", "maxDrawdown"]].map(([l, k]) => (
          <Field key={k} label={l} type="number" value={f[k] || ""} onChange={v => set(k, v)} full />
        ))}
        <Field label="Avg Hold" value={f.avgHold || ""} onChange={v => set("avgHold", v)} placeholder="22:49" full />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn onClick={onClose} color={C.muted}>Cancel</Btn>
        <Btn onClick={() => { if (f.label) { onSave(f); onClose(); } }} fill color={C.G} disabled={!f.label}>Save</Btn>
      </div>
    </Modal>
  );
}

// ─── TRADE FORM ───────────────────────────────────────────────────────────────
const EMPTY_TRADE = () => ({ id: uid(), time: "", direction: "L", entry: "", exit: "", sl: "", tp: "", duration: "", pnl: "", rr: "", setup: "", confluence: "", note: "" });

function TradeForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init ? { ...init } : EMPTY_TRADE());
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={init ? "Edit Trade" : "New Trade"} onClose={onClose} wide>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
        <Field label="Time" value={f.time || ""} onChange={v => set("time", v)} placeholder="10:23:04" full />
        <Field label="Direction" value={f.direction} onChange={v => set("direction", v)} options={[{ value: "L", label: "▲ Long" }, { value: "S", label: "▼ Short" }]} full />
        <Field label="Entry" type="number" value={f.entry || ""} onChange={v => set("entry", v)} full />
        <Field label="Exit" type="number" value={f.exit || ""} onChange={v => set("exit", v)} full />
        <Field label="Stop Loss" type="number" value={f.sl || ""} onChange={v => set("sl", v)} full />
        <Field label="Take Profit" type="number" value={f.tp || ""} onChange={v => set("tp", v)} full />
        <Field label="Duration" value={f.duration || ""} onChange={v => set("duration", v)} placeholder="22:49" full />
        <Field label="P&L ($)" type="number" value={f.pnl || ""} onChange={v => set("pnl", v)} full />
        <Field label="R:R" value={f.rr || ""} onChange={v => set("rr", v)} placeholder="1.43" full />
        <Field label="Setup Type" value={f.setup || ""} onChange={v => set("setup", v)} placeholder="Liquidity Sweep" full
          listId="setup-list" list={["Liquidity Sweep", "Order Block", "FVG", "Reversal", "Trend Continuation", "Scalp", "Breakout", "Range"]} />
        <Field label="Confluence" value={f.confluence || ""} onChange={v => set("confluence", v)} placeholder="Trend" full style={{ gridColumn: "span 2" }}
          listId="confluence-list" list={["Trend", "London Sweep", "Asia Sweep", "PDH/PDL", "EMA Cross", "FVG", "Order Block", "NFP Vol", "Time Bias", "Daily Context", "Multi-Day Level"]} />
      </div>
      <Field label="Note" value={f.note || ""} onChange={v => set("note", v)} rows={2} placeholder="Trade notes..." full />
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
        <Btn onClick={onClose} color={C.muted}>Cancel</Btn>
        <Btn onClick={() => { onSave(f); onClose(); }} fill color={C.G}>Save Trade</Btn>
      </div>
    </Modal>
  );
}

// ─── NOTE FORM ────────────────────────────────────────────────────────────────
const EMPTY_NOTE = () => ({ id: uid(), color: C.G, title: "", content: "" });

function NoteForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init ? { ...init } : EMPTY_NOTE());
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={init ? "Edit Note" : "New Note"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <ColorPicker value={f.color} onChange={v => set("color", v)} />
        <Field label="Title" value={f.title} onChange={v => set("title", v)} full />
        <Field label="Content" value={f.content} onChange={v => set("content", v)} rows={5} full />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
        <Btn onClick={onClose} color={C.muted}>Cancel</Btn>
        <Btn onClick={() => { if (f.title || f.content) { onSave(f); onClose(); } }} fill color={C.G}>Save Note</Btn>
      </div>
    </Modal>
  );
}

// ─── WEEK FORM ────────────────────────────────────────────────────────────────
const EMPTY_WEEK = () => ({ id: uid(), label: "", dateRange: "", sessions: "", trades: "", wins: "", losses: "", winRate: "", netPnl: "", bestDay: "", worstDay: "", review: "", goals: "" });

function WeekForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init ? { ...init } : EMPTY_WEEK());
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={init ? "Edit Week" : "New Week Review"} onClose={onClose} wide>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Field label="Label" value={f.label} onChange={v => set("label", v)} full />
        <Field label="Date Range" value={f.dateRange} onChange={v => set("dateRange", v)} placeholder="Mar 9–13" full />
        <Field label="Net P&L ($)" type="number" value={f.netPnl} onChange={v => set("netPnl", v)} full />
        <Field label="Win Rate %" type="number" value={f.winRate} onChange={v => set("winRate", v)} full />
        <Field label="Sessions" type="number" value={f.sessions} onChange={v => set("sessions", v)} full />
        <Field label="Total Trades" type="number" value={f.trades} onChange={v => set("trades", v)} full />
        <Field label="Wins" type="number" value={f.wins} onChange={v => set("wins", v)} full />
        <Field label="Losses" type="number" value={f.losses} onChange={v => set("losses", v)} full />
        <Field label="Best Day" value={f.bestDay} onChange={v => set("bestDay", v)} placeholder="Mar 13 · +$509" full style={{ gridColumn: "span 2" }} />
        <Field label="Worst Day" value={f.worstDay} onChange={v => set("worstDay", v)} placeholder="Mar 12 · +$333" full style={{ gridColumn: "span 2" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Field label="Weekly Review / Observations" value={f.review} onChange={v => set("review", v)} rows={4} full />
        <Field label="Goals for Next Week" value={f.goals} onChange={v => set("goals", v)} rows={3} full />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
        <Btn onClick={onClose} color={C.muted}>Cancel</Btn>
        <Btn onClick={() => { if (f.label) { onSave(f); onClose(); } }} fill color={C.A} disabled={!f.label}>Save Week</Btn>
      </div>
    </Modal>
  );
}

// ─── FRAMEWORK FORMS ──────────────────────────────────────────────────────────
function StepForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init ? { ...init } : { id: uid(), num: "", title: "", color: C.G, desc: "" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={init ? "Edit Filter" : "New Filter"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 10 }}>
          <Field label="Number" value={f.num} onChange={v => set("num", v)} placeholder="01" full />
          <Field label="Title" value={f.title} onChange={v => set("title", v)} full />
        </div>
        <ColorPicker value={f.color} onChange={v => set("color", v)} />
        <Field label="Description" value={f.desc} onChange={v => set("desc", v)} rows={3} full />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
        <Btn onClick={onClose} color={C.muted}>Cancel</Btn>
        <Btn onClick={() => { if (f.title) { onSave(f); onClose(); } }} fill color={C.G} disabled={!f.title}>Save</Btn>
      </div>
    </Modal>
  );
}

function LevelForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init ? { ...init } : { id: uid(), color: C.G, name: "", desc: "" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title={init ? "Edit Level" : "New Level"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Level Name" value={f.name} onChange={v => set("name", v)} full />
        <ColorPicker value={f.color} onChange={v => set("color", v)} />
        <Field label="Description" value={f.desc} onChange={v => set("desc", v)} rows={3} full />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
        <Btn onClick={onClose} color={C.muted}>Cancel</Btn>
        <Btn onClick={() => { if (f.name) { onSave(f); onClose(); } }} fill color={C.G} disabled={!f.name}>Save</Btn>
      </div>
    </Modal>
  );
}

function SettingsForm({ init, onSave, onClose }) {
  const [f, setF] = useState(init);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  return (
    <Modal title="Settings" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Profit Goal ($)" type="number" value={f.goal} onChange={v => set("goal", v)} full />
        <Field label="Account Balance ($)" type="number" value={f.balance} onChange={v => set("balance", v)} full />
        <Field label="Default Symbol" value={f.symbol} onChange={v => set("symbol", v)} full />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 18 }}>
        <Btn onClick={onClose} color={C.muted}>Cancel</Btn>
        <Btn onClick={() => { onSave(f); onClose(); }} fill color={C.G}>Save</Btn>
      </div>
    </Modal>
  );
}

// ─── SESSION DATA HOOK ────────────────────────────────────────────────────────
// Merges hardcoded PDF sessions with user overrides and additions
function useSessionData() {
  const [overrides, setOverrides] = useLS(SK.overrides, {});
  const [deletions, setDeletions] = useLS(SK.deletions, []);
  const [userSessions, setUserSessions] = useLS(SK.userSessions, []);

  // Build merged session list: PDF sessions (with overrides applied) + user sessions
  const sessions = [
    ...PDF_SESSIONS
      .filter(s => !deletions.includes(s.id))
      .map(s => overrides[s.id] ? { ...s, ...overrides[s.id] } : s),
    ...userSessions
  ];

  const updateSession = (id, updated) => {
    if (PDF_SESSIONS.find(s => s.id === id)) {
      setOverrides(o => ({ ...o, [id]: updated }));
    } else {
      setUserSessions(ss => ss.map(s => s.id === id ? updated : s));
    }
  };

  const addSession = (sess) => setUserSessions(ss => [sess, ...ss]);

  const deleteSession = (id) => {
    if (PDF_SESSIONS.find(s => s.id === id)) {
      setDeletions(d => [...d, id]);
    } else {
      setUserSessions(ss => ss.filter(s => s.id !== id));
    }
  };

  const calcStats = (trades) => {
    const wins = trades.filter(t => +t.pnl >= 0);
    const losses = trades.filter(t => +t.pnl < 0);
    const grossPnl = trades.reduce((s, t) => s + (+t.pnl || 0), 0);
    const winRate = trades.length > 0 ? +((wins.length / trades.length) * 100).toFixed(2) : 0;
    const avgWin = wins.length > 0 ? +(wins.reduce((s, t) => s + (+t.pnl || 0), 0) / wins.length).toFixed(2) : 0;
    const avgLoss = losses.length > 0 ? +Math.abs(losses.reduce((s, t) => s + (+t.pnl || 0), 0) / losses.length).toFixed(2) : 0;
    const expectancy = +(((winRate / 100) * avgWin) - ((1 - winRate / 100) * avgLoss)).toFixed(2);
    return { trades: trades.length, wins: wins.length, losses: losses.length, grossPnl: +grossPnl.toFixed(2), netPnl: +grossPnl.toFixed(2), winRate, avgWin, avgLoss, expectancy };
  };

  const updateTrades = (id, trades) => {
    const stats = calcStats(trades);
    const isPdf = !!PDF_SESSIONS.find(s => s.id === id);
    if (isPdf) {
      const base = overrides[id] || PDF_SESSIONS.find(s => s.id === id);
      setOverrides(o => ({ ...o, [id]: { ...base, ...stats, tradeLog: trades } }));
    } else {
      setUserSessions(ss => ss.map(s => s.id === id ? { ...s, ...stats, tradeLog: trades } : s));
    }
  };

  const updateNotes = (id, notes) => {
    const isPdf = !!PDF_SESSIONS.find(s => s.id === id);
    if (isPdf) {
      const base = overrides[id] || PDF_SESSIONS.find(s => s.id === id);
      setOverrides(o => ({ ...o, [id]: { ...base, notes } }));
    } else {
      setUserSessions(ss => ss.map(s => s.id === id ? { ...s, notes } : s));
    }
  };

  return { sessions, addSession, updateSession, deleteSession, updateTrades, updateNotes };
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ sessions, addSession, updateSession, deleteSession, settings }) {
  const [modal, setModal] = useState(null);
  const totalPnl = sessions.reduce((s, x) => s + (+x.netPnl || 0), 0);
  const totalT = sessions.reduce((s, x) => s + (+x.trades || 0), 0);
  const totalW = sessions.reduce((s, x) => s + (+x.wins || 0), 0);
  const overallWR = totalT > 0 ? ((totalW / totalT) * 100).toFixed(1) : "—";
  const { goal, balance } = settings;
  const pct = goal > 0 ? clamp((balance / goal) * 100, 0, 100).toFixed(1) : 0;
  const rem = (+goal || 0) - (+balance || 0);

  return (
    <div>
      {/* Goal bar */}
      <div style={{ background: C.surf, border: `1px solid ${C.bord}`, padding: "14px 20px", marginBottom: 20, borderRadius: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>
          <span>Goal · <span style={{ color: C.G }}>${(+balance || 0).toFixed(2)}</span> of <span style={{ color: C.A }}>${(+goal || 0).toFixed(2)}</span></span>
          <span style={{ color: rem > 0 ? C.A : C.G }}>{rem > 0 ? `$${rem.toFixed(2)} remaining` : "🎯 Goal reached!"}</span>
        </div>
        <div style={{ height: 6, background: C.bord, borderRadius: 3 }}>
          <div style={{ width: `${pct}%`, height: 6, background: `linear-gradient(90deg,${C.G},${C.A})`, borderRadius: 3, transition: "width .5s" }} />
        </div>
        <div style={{ fontSize: 9, color: C.muted, marginTop: 6, textAlign: "right" }}>{pct}% complete</div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: C.bord, border: `1px solid ${C.bord}`, marginBottom: 24, borderRadius: 2, overflow: "hidden" }}>
        <Stat label="Total P&L" value={fmt(totalPnl)} color={pc(totalPnl)} sub="net all sessions" />
        <Stat label="Sessions" value={sessions.length} color={C.B} sub="logged" />
        <Stat label="Total Trades" value={totalT} color={C.text} sub={`${totalW}W overall`} />
        <Stat label="Overall WR" value={`${overallWR}%`} color={overallWR >= 75 ? C.G : overallWR >= 55 ? C.A : C.R} sub="win rate" />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 10, letterSpacing: ".14em", color: C.muted, textTransform: "uppercase", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>All Sessions</div>
        <Btn onClick={() => setModal("add")} color={C.G}>+ Add Session</Btn>
      </div>

      <div style={{ background: C.surf, border: `1px solid ${C.bord}`, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "110px 70px 100px 90px 90px 80px 1fr 100px", gap: 8, padding: "8px 18px", fontSize: 9, letterSpacing: ".1em", color: C.muted, textTransform: "uppercase", borderBottom: `1px solid ${C.bord}` }}>
          <span>Session</span><span>Symbol</span><span>Trades</span><span>WR</span><span>Gross</span><span>Fees</span><span>Net P&L</span><span style={{ textAlign: "right" }}>Actions</span>
        </div>
        {sessions.map((s, i) => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "110px 70px 100px 90px 90px 80px 1fr 100px", gap: 8, alignItems: "center", padding: "12px 18px", borderTop: i > 0 ? `1px solid ${C.bord}` : "none", fontSize: 12 }}>
            <span style={{ fontWeight: 700, color: C.text, fontFamily: "'Syne',sans-serif" }}>{s.label}</span>
            <span style={{ color: C.muted, fontSize: 11 }}>{s.symbol}</span>
            <span style={{ color: C.muted, fontSize: 11 }}>{s.trades || 0}t · {s.wins || 0}W</span>
            <span style={{ color: (+s.winRate >= 75) ? C.G : (+s.winRate >= 55) ? C.A : C.R, fontWeight: 700 }}>{s.winRate || "—"}%</span>
            <span style={{ color: C.sub }}>${(+s.grossPnl || 0).toFixed(2)}</span>
            <span style={{ color: (+s.fees > 50) ? C.R : C.muted, fontSize: 11 }}>-${(+s.fees || 0).toFixed(2)}{+s.fees > 50 ? " ⚠️" : ""}</span>
            <span style={{ fontWeight: 800, color: pc(+s.netPnl) }}>{fmt(+s.netPnl || 0)}</span>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              <Btn sm onClick={() => setModal({ ...s, _edit: true })} color={C.A}>Edit</Btn>
              <Btn sm danger onClick={() => setModal({ _del: true, id: s.id, label: s.label })}>Del</Btn>
            </div>
          </div>
        ))}
      </div>

      {modal === "add" && <SessionForm onSave={addSession} onClose={() => setModal(null)} />}
      {modal?._edit && <SessionForm init={modal} onSave={s => updateSession(s.id, s)} onClose={() => setModal(null)} />}
      {modal?._del && <Confirm msg={`Delete session "${modal.label}"?`} onConfirm={() => deleteSession(modal.id)} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── TRADES TAB ───────────────────────────────────────────────────────────────
function TradesTab({ sessions, updateTrades }) {
  const [si, setSi] = useState(0);
  const [modal, setModal] = useState(null);
  const sess = sessions[si];
  const trades = sess?.tradeLog || [];

  const saveTrade = (t) => {
    const updated = t._edit
      ? trades.map(x => x.id === t.id ? { ...t, _edit: undefined } : x)
      : [...trades, t];
    updateTrades(sess.id, updated);
  };
  const delTrade = (id) => updateTrades(sess.id, trades.filter(t => t.id !== id));

  return (
    <div>
      <SessSelector sessions={sessions} si={si} setSi={setSi} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.muted }}>
          {sess?.label} · <span style={{ color: C.G }}>{trades.filter(t => +t.pnl >= 0).length}W</span> / <span style={{ color: C.R }}>{trades.filter(t => +t.pnl < 0).length}L</span> · {trades.length} trades
        </div>
        <Btn onClick={() => setModal("add")} color={C.G}>+ Add Trade</Btn>
      </div>
      {trades.length === 0
        ? <EmptyState msg="No trades yet." action="+ Add Trade" onAction={() => setModal("add")} />
        : <>
          <div style={{ display: "grid", gridTemplateColumns: "28px 44px 76px 74px 74px 66px 66px 66px 72px 100px 88px 1fr 88px", gap: 6, padding: "7px 14px", fontSize: 9, letterSpacing: ".1em", color: C.muted, textTransform: "uppercase" }}>
            <span>#</span><span>Dir</span><span>Time</span><span>Entry</span><span>Exit</span><span>SL</span><span>TP</span><span>Hold</span><span>R:R</span><span>Setup</span><span>P&L</span><span>Note</span><span style={{ textAlign: "right" }}>Act</span>
          </div>
          {trades.map((t, i) => (
            <div key={t.id} style={{ display: "grid", gridTemplateColumns: "28px 44px 76px 74px 74px 66px 66px 66px 72px 100px 88px 1fr 88px", gap: 6, alignItems: "center", background: C.surf, padding: "10px 14px", marginBottom: 2, fontSize: 11, borderLeft: `3px solid ${+t.pnl >= 0 ? C.G : C.R}` }}>
              <span style={{ color: C.muted, fontSize: 10 }}>{i + 1}</span>
              <span style={{ fontWeight: 800, color: t.direction === "L" ? C.G : C.R }}>{t.direction === "L" ? "▲L" : "▼S"}</span>
              <span style={{ color: C.muted, fontSize: 10 }}>{t.time || "—"}</span>
              <span>{t.entry || "—"}</span>
              <span>{t.exit || "—"}</span>
              <span style={{ color: C.R, fontSize: 10 }}>{t.sl || "—"}</span>
              <span style={{ color: C.G, fontSize: 10 }}>{t.tp || "—"}</span>
              <span style={{ color: C.muted, fontSize: 10 }}>{t.duration || "—"}</span>
              <span style={{ color: C.A, fontSize: 10 }}>{t.rr || "—"}</span>
              <span style={{ color: C.B, fontSize: 10 }}>{t.setup || "—"}</span>
              <span style={{ fontWeight: 800, color: pc(+t.pnl) }}>{fmt(+t.pnl || 0)}</span>
              <span style={{ fontSize: 10, color: t.note?.includes("⭐") ? C.A : C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note || ""}</span>
              <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                <Btn sm onClick={() => setModal({ ...t, _edit: true })} color={C.A}>Edit</Btn>
                <Btn sm danger onClick={() => setModal({ _del: true, id: t.id })}>Del</Btn>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 28, padding: "12px 14px", background: C.surf, border: `1px solid ${C.bord}`, marginTop: 8, fontSize: 11 }}>
            <span style={{ color: C.muted }}>Gross: <strong style={{ color: C.G }}>${(+sess?.grossPnl || 0).toFixed(2)}</strong></span>
            <span style={{ color: C.muted }}>Net: <strong style={{ color: C.G }}>{fmt(+sess?.netPnl || 0)}</strong></span>
            <span style={{ color: C.muted }}>Fees: <strong style={{ color: (+sess?.fees > 50) ? C.R : C.muted }}>-${(+sess?.fees || 0).toFixed(2)}</strong></span>
            <span style={{ color: C.muted }}>Contracts: <strong style={{ color: C.B }}>{sess?.contracts || 0}</strong></span>
            <span style={{ color: C.muted }}>Avg Hold: <strong style={{ color: C.text }}>{sess?.avgHold || "—"}</strong></span>
          </div>
        </>
      }
      {modal === "add" && <TradeForm onSave={saveTrade} onClose={() => setModal(null)} />}
      {modal?._edit && <TradeForm init={modal} onSave={saveTrade} onClose={() => setModal(null)} />}
      {modal?._del && <Confirm msg="Delete this trade?" onConfirm={() => delTrade(modal.id)} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── NOTES TAB ────────────────────────────────────────────────────────────────
function NotesTab({ sessions, updateNotes }) {
  const [si, setSi] = useState(0);
  const [modal, setModal] = useState(null);
  const sess = sessions[si];
  const notes = sess?.notes || [];

  const saveNote = (n) => {
    const updated = n._edit
      ? notes.map(x => x.id === n.id ? { ...n, _edit: undefined } : x)
      : [...notes, n];
    updateNotes(sess.id, updated);
  };
  const delNote = (id) => updateNotes(sess.id, notes.filter(n => n.id !== id));

  return (
    <div>
      <SessSelector sessions={sessions} si={si} setSi={setSi} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: ".14em", color: C.muted, textTransform: "uppercase", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{sess?.label} · Notes · {notes.length}</div>
        <Btn onClick={() => setModal("add")} color={C.G}>+ Add Note</Btn>
      </div>
      {notes.length === 0
        ? <EmptyState msg="No notes yet." action="+ Add Note" onAction={() => setModal("add")} />
        : notes.map((n, i) => (
          <div key={n.id} style={{ background: C.surf, padding: "16px 20px", marginBottom: 10, borderLeft: `3px solid ${n.color || C.G}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.muted }}>{n.title}</div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
                <Btn sm onClick={() => setModal({ ...n, _edit: true })} color={C.A}>Edit</Btn>
                <Btn sm danger onClick={() => setModal({ _del: true, id: n.id })}>Del</Btn>
              </div>
            </div>
            {n.content && <p style={{ fontSize: 12, lineHeight: 1.8, color: C.sub, margin: 0 }}>{n.content}</p>}
          </div>
        ))
      }
      {modal === "add" && <NoteForm onSave={saveNote} onClose={() => setModal(null)} />}
      {modal?._edit && <NoteForm init={modal} onSave={saveNote} onClose={() => setModal(null)} />}
      {modal?._del && <Confirm msg="Delete this note?" onConfirm={() => delNote(modal.id)} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── WEEKLY REVIEW TAB ────────────────────────────────────────────────────────
function WeeklyTab({ weeks, setWeeks }) {
  const [wi, setWi] = useState(0);
  const [modal, setModal] = useState(null);
  const saveWeek = (w) => {
    if (w._edit) setWeeks(ws => ws.map(x => x.id === w.id ? { ...w, _edit: undefined } : x));
    else { setWeeks(ws => [...ws, w]); setWi(weeks.length); }
  };
  const delWeek = (id) => { setWeeks(ws => ws.filter(w => w.id !== id)); setWi(0); };
  const week = weeks[wi];
  const totalWeeklyPnl = weeks.reduce((s, w) => s + (+w.netPnl || 0), 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: C.bord, border: `1px solid ${C.bord}`, marginBottom: 24, borderRadius: 2, overflow: "hidden" }}>
        <Stat label="Weeks Reviewed" value={weeks.length} color={C.B} sub="total" />
        <Stat label="Total P&L" value={fmt(totalWeeklyPnl)} color={pc(totalWeeklyPnl)} sub="across all weeks" />
        <Stat label="Avg / Week" value={weeks.length > 0 ? fmt(totalWeeklyPnl / weeks.length) : "—"} color={C.A} sub="net P&L" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {weeks.map((w, i) => (
            <button key={w.id} onClick={() => setWi(i)} style={{
              background: i === wi ? C.A : C.surf, color: i === wi ? "#0a0c0f" : C.muted,
              border: `1px solid ${i === wi ? C.A : C.bord}`,
              padding: "4px 12px", fontSize: 10, cursor: "pointer", borderRadius: 2,
              fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
            }}>{w.label || `Week ${i + 1}`}</button>
          ))}
        </div>
        <Btn onClick={() => setModal("add")} color={C.A}>+ Add Week</Btn>
      </div>
      {weeks.length === 0
        ? <EmptyState msg="No weekly reviews yet." action="+ Add First Week" onAction={() => setModal("add")} />
        : week && <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: C.bord, border: `1px solid ${C.bord}`, marginBottom: 16, borderRadius: 2, overflow: "hidden" }}>
            <Stat label="Net P&L" value={fmt(+week.netPnl || 0)} color={pc(+week.netPnl)} sub={week.dateRange || ""} />
            <Stat label="Win Rate" value={`${week.winRate || "—"}%`} color={(+week.winRate >= 75) ? C.G : (+week.winRate >= 55) ? C.A : C.R} sub={`${week.wins || 0}W / ${week.losses || 0}L of ${week.trades || 0}`} />
            <Stat label="Best Day" value={week.bestDay?.split("·")[1]?.trim() || week.bestDay || "—"} color={C.G} sub={week.bestDay?.split("·")[0]?.trim() || ""} />
            <Stat label="Worst Day" value={week.worstDay?.split("·")[1]?.trim() || week.worstDay || "—"} color={week.worstDay && week.worstDay !== "—" ? C.R : C.muted} sub={week.worstDay?.split("·")[0]?.trim() || ""} />
          </div>
          {week.review && <div style={{ background: C.surf, padding: "16px 20px", marginBottom: 12, borderLeft: `3px solid ${C.G}` }}>
            <div style={{ fontSize: 9, letterSpacing: ".14em", color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Review · {week.dateRange}</div>
            <p style={{ fontSize: 12, lineHeight: 1.8, color: C.sub, margin: 0 }}>{week.review}</p>
          </div>}
          {week.goals && <div style={{ background: C.surf, padding: "16px 20px", marginBottom: 16, borderLeft: `3px solid ${C.A}` }}>
            <div style={{ fontSize: 9, letterSpacing: ".14em", color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Goals for Next Week</div>
            <p style={{ fontSize: 12, lineHeight: 1.8, color: C.sub, margin: 0 }}>{week.goals}</p>
          </div>}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn sm onClick={() => setModal({ ...week, _edit: true })} color={C.A}>Edit Week</Btn>
            <Btn sm danger onClick={() => setModal({ _del: true, id: week.id, label: week.label })}>Delete Week</Btn>
          </div>
        </>
      }
      {modal === "add" && <WeekForm onSave={saveWeek} onClose={() => setModal(null)} />}
      {modal?._edit && <WeekForm init={modal} onSave={saveWeek} onClose={() => setModal(null)} />}
      {modal?._del && <Confirm msg={`Delete "${modal.label}"?`} onConfirm={() => delWeek(modal.id)} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── FRAMEWORK TAB ────────────────────────────────────────────────────────────
function FrameworkTab({ fw, setFw }) {
  const [modal, setModal] = useState(null);
  const saveStep = (s) => setFw(f => ({ ...f, steps: s._edit ? f.steps.map(x => x.id === s.id ? { ...s, _edit: undefined } : x) : [...f.steps, s] }));
  const delStep = (id) => setFw(f => ({ ...f, steps: f.steps.filter(s => s.id !== id) }));
  const saveLevel = (l) => setFw(f => ({ ...f, levels: l._edit ? f.levels.map(x => x.id === l.id ? { ...l, _edit: undefined } : x) : [...f.levels, l] }));
  const delLevel = (id) => setFw(f => ({ ...f, levels: f.levels.filter(l => l.id !== id) }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 10, letterSpacing: ".14em", color: C.muted, textTransform: "uppercase", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Entry Filters</div>
        <Btn onClick={() => setModal("step-add")} color={C.G}>+ Add Filter</Btn>
      </div>
      {fw.steps.length === 0
        ? <EmptyState msg="No filters yet." action="+ Add Filter" onAction={() => setModal("step-add")} />
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 1, background: C.bord, border: `1px solid ${C.bord}`, marginBottom: 28, borderRadius: 2, overflow: "hidden" }}>
          {fw.steps.map(step => (
            <div key={step.id} style={{ background: C.surf, padding: "18px 14px" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 900, color: C.bord, marginBottom: 6, lineHeight: 1 }}>{step.num}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: step.color || C.G, marginBottom: 6 }}>{step.title}</div>
              <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.65, marginBottom: 12 }}>{step.desc}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn sm onClick={() => setModal({ ...step, _edit: true, _type: "step" })} color={C.A}>Edit</Btn>
                <Btn sm danger onClick={() => setModal({ _del: true, id: step.id, _type: "step" })}>Del</Btn>
              </div>
            </div>
          ))}
        </div>
      }
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 10, letterSpacing: ".14em", color: C.muted, textTransform: "uppercase", fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Key Level Hierarchy</div>
        <Btn onClick={() => setModal("level-add")} color={C.B}>+ Add Level</Btn>
      </div>
      {fw.levels.length === 0
        ? <EmptyState msg="No levels yet." action="+ Add Level" onAction={() => setModal("level-add")} />
        : <div style={{ background: C.surf, border: `1px solid ${C.bord}`, borderRadius: 2, overflow: "hidden" }}>
          {fw.levels.map((l, i) => (
            <div key={l.id} style={{ display: "flex", gap: 14, padding: "14px 20px", borderTop: i > 0 ? `1px solid ${C.bord}` : "none", alignItems: "flex-start" }}>
              <div style={{ width: 3, borderRadius: 2, flexShrink: 0, background: l.color, alignSelf: "stretch", minHeight: 20 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 12, color: l.color, marginBottom: 4 }}>{l.name}</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.65 }}>{l.desc}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Btn sm onClick={() => setModal({ ...l, _edit: true, _type: "level" })} color={C.A}>Edit</Btn>
                <Btn sm danger onClick={() => setModal({ _del: true, id: l.id, _type: "level" })}>Del</Btn>
              </div>
            </div>
          ))}
        </div>
      }
      {modal === "step-add" && <StepForm onSave={saveStep} onClose={() => setModal(null)} />}
      {modal?._edit && modal._type === "step" && <StepForm init={modal} onSave={saveStep} onClose={() => setModal(null)} />}
      {modal === "level-add" && <LevelForm onSave={saveLevel} onClose={() => setModal(null)} />}
      {modal?._edit && modal._type === "level" && <LevelForm init={modal} onSave={saveLevel} onClose={() => setModal(null)} />}
      {modal?._del && <Confirm msg={`Delete this ${modal._type}?`} onConfirm={() => modal._type === "step" ? delStep(modal.id) : delLevel(modal.id)} onClose={() => setModal(null)} />}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function TradingJournal() {
  const { sessions, addSession, updateSession, deleteSession, updateTrades, updateNotes } = useSessionData();
  const [weeks, setWeeks] = useLS(SK.weeks, []);
  const [fw, setFw] = useLS(SK.framework, DEFAULT_FW);
  const [settings, setSettings] = useLS(SK.settings, DEFAULT_SETTINGS);
  const [tab, setTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);

  const totalPnl = sessions.reduce((s, x) => s + (+x.netPnl || 0), 0);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ padding: "22px 32px 0", borderBottom: `1px solid ${C.bord}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: ".15em", color: C.muted, textTransform: "uppercase", fontFamily: "'Syne',sans-serif", fontWeight: 600, marginBottom: 4 }}>
              {settings.symbol} · ICT Methodology · Prop Account
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800 }}>
              Trading <span style={{ color: C.G }}>Journal</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 3 }}>
              {sessions.length} sessions · balance
            </div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: C.G }}>
              ${(+settings.balance || 0).toFixed(2)}
            </div>
            <button onClick={() => setShowSettings(true)} style={{ background: "none", border: "none", color: C.muted, fontSize: 10, cursor: "pointer", marginTop: 3, fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".08em" }}>
              ⚙ settings
            </button>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          {["overview", "trades", "notes", "weekly", "framework"].map(t => (
            <TabBtn key={t} label={t === "weekly" ? "Weekly Review" : t.charAt(0).toUpperCase() + t.slice(1)} active={tab === t} onClick={() => setTab(t)} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px" }}>
        {tab === "overview" && <OverviewTab sessions={sessions} addSession={addSession} updateSession={updateSession} deleteSession={deleteSession} settings={settings} />}
        {tab === "trades" && <TradesTab sessions={sessions} updateTrades={updateTrades} />}
        {tab === "notes" && <NotesTab sessions={sessions} updateNotes={updateNotes} />}
        {tab === "weekly" && <WeeklyTab weeks={weeks} setWeeks={setWeeks} />}
        {tab === "framework" && <FrameworkTab fw={fw} setFw={setFw} />}
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 32px", borderTop: `1px solid ${C.bord}`, display: "flex", justifyContent: "space-between", fontSize: 10, color: C.muted }}>
        <span>{settings.symbol} · Prop Account · ICT Methodology · Updated Mar 19, 2026</span>
        <span style={{ color: pc(totalPnl) }}>{fmt(totalPnl)} total</span>
      </div>

      {showSettings && <SettingsForm init={settings} onSave={s => { setSettings(s); setShowSettings(false); }} onClose={() => setShowSettings(false)} />}
    </div>
  );
}
