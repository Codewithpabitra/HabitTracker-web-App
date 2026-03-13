import { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { getEmotionalDashboard } from "../services/journal.service";

// config 
const MOOD_CFG = {
  happy:      { emoji: "😊", color: "#f59e0b", label: "Happy",      bg: "rgba(245,158,11,0.12)"  },
  productive: { emoji: "⚡", color: "#10b981", label: "Productive",  bg: "rgba(16,185,129,0.12)"  },
  neutral:    { emoji: "😐", color: "#94a3b8", label: "Neutral",     bg: "rgba(148,163,184,0.12)" },
  stressed:   { emoji: "😤", color: "#f43f5e", label: "Stressed",    bg: "rgba(244,63,94,0.12)"   },
  sad:        { emoji: "😢", color: "#6366f1", label: "Sad",         bg: "rgba(99,102,241,0.12)"  },
};

const SENT_CFG = {
  Positive:  { color: "#10b981", icon: "↑" },
  Neutral:   { color: "#94a3b8", icon: "→" },
  Anxious:   { color: "#f43f5e", icon: "!" },
  Lethargic: { color: "#6366f1", icon: "↓" },
};

const MOOD_NUM = { happy: 5, productive: 4, neutral: 3, stressed: 2, sad: 1 };
const NUM_MOOD = { 5: "happy", 4: "productive", 3: "neutral", 2: "stressed", 1: "sad" };

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="eld-spinner-wrap">
      <div className="eld-spinner" />
    </div>
  );
}

function StatCard({ label, children, accent = "#6366f1", delay = 0 }) {
  return (
    <div className="eld-stat-card" style={{ "--accent": accent, animationDelay: `${delay}ms` }}>
      <span className="eld-stat-label">{label}</span>
      {children}
    </div>
  );
}

function MoodCalendar({ calendarMap, days }) {
  const cells = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().split("T")[0];
    return {
      key,
      entry: calendarMap[key] || null,
      label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
      num: d.getDate(),
      isToday: i === days - 1,
    };
  });

  return (
    <div className="eld-cal-grid">
      {cells.map(({ key, entry, label, num, isToday }) => {
        const cfg = entry ? MOOD_CFG[entry.mood] : null;
        return (
          <div
            key={key}
            className={`eld-cal-cell${isToday ? " is-today" : ""}${entry ? " has-entry" : ""}`}
            style={cfg ? { "--cell-color": cfg.color, "--cell-bg": cfg.bg } : {}}
            title={entry ? `${key} · ${cfg?.label}` : key}
          >
            <span className="eld-cal-day">{label}</span>
            <span className="eld-cal-emoji">{cfg?.emoji ?? "·"}</span>
            <span className="eld-cal-num">{num}</span>
          </div>
        );
      })}
    </div>
  );
}

function MoodTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const mood = NUM_MOOD[Math.round(payload[0].value)];
  const cfg = MOOD_CFG[mood];
  return (
    <div className="eld-tooltip">
      <span style={{ color: cfg?.color }}>{cfg?.emoji} {cfg?.label ?? "—"}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="eld-empty">
      <span className="eld-empty-icon">📓</span>
      <p>No entries in this period</p>
      <small>Start writing to see your emotional trends here.</small>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmotionalDashboard() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getEmotionalDashboard(days);
      setData(res.data.data);
    } catch (err) {
      setError(true);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load dashboard";
      toast.error(msg, {
        style: { fontFamily: "Sora, sans-serif", fontSize: "14px", background: "#1e1e26", color: "#e2e8f0", border: "1px solid #2a2a35" },
        icon: "💔",
      });
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const chartData = data?.moodTimeline?.map((e) => ({
    date: fmtDate(e.date),
    value: MOOD_NUM[e.mood] ?? 3,
  })) ?? [];

  const pieData = data
    ? Object.entries(data.moodCounts)
        .filter(([, v]) => v > 0)
        .map(([mood, count]) => ({ name: mood, value: count, color: MOOD_CFG[mood].color }))
    : [];

  const domCfg  = data ? MOOD_CFG[data.dominantMood]      : null;
  const sentCfg = data ? SENT_CFG[data.dominantSentiment] : null;
  const hasData = !loading && !error && data && data.totalEntries > 0;

  const PILL_COLORS = ["#f59e0b","#10b981","#f43f5e","#6366f1","#06b6d4","#a855f7"];

  return (
    <>
      <Toaster position="top-right" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap');
        *{box-sizing:border-box;}
        .eld-root{min-height:100vh;background:#0c0c0f;color:#e2e8f0;font-family:'Sora',sans-serif;padding:36px 24px 60px;}
        .eld-inner{max-width:980px;margin:0 auto;}

        /* Header */
        .eld-header{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:20px;margin-bottom:36px;animation:eldUp .5s ease both;}
        .eld-eyebrow{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#f59e0b;margin:0 0 6px;}
        .eld-title{font-family:'Playfair Display',serif;font-size:38px;font-style:italic;margin:0;line-height:1.1;color:#fff;}
        .eld-sub{color:#64748b;font-size:13px;margin:6px 0 0;}

        /* Toggle */
        .eld-toggle{display:flex;gap:6px;background:#17171c;border:1px solid #2a2a35;border-radius:12px;padding:4px;}
        .eld-toggle-btn{padding:8px 22px;border-radius:9px;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-weight:700;font-size:13px;transition:all .2s;background:transparent;color:#64748b;}
        .eld-toggle-btn.active{background:#f59e0b;color:#0c0c0f;}

        /* Spinner */
        .eld-spinner-wrap{display:flex;justify-content:center;align-items:center;height:360px;}
        .eld-spinner{width:36px;height:36px;border-radius:50%;border:3px solid #2a2a35;border-top-color:#f59e0b;animation:eldSpin .7s linear infinite;}
        @keyframes eldSpin{to{transform:rotate(360deg);}}

        /* Stats */
        .eld-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-bottom:16px;}
        .eld-stat-card{background:#17171c;border:1px solid #2a2a35;border-radius:18px;padding:20px 22px;display:flex;flex-direction:column;gap:6px;animation:eldUp .5s ease both;transition:border-color .2s,box-shadow .2s;}
        .eld-stat-card:hover{border-color:var(--accent,#6366f1);box-shadow:0 0 20px -4px var(--accent,#6366f1);}
        .eld-stat-label{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#475569;}
        .eld-stat-val{font-size:34px;font-weight:800;line-height:1;color:#fff;}
        .eld-stat-sub{font-size:12px;color:#475569;}
        .eld-stat-emoji{font-size:32px;line-height:1;}
        .eld-stat-mood{font-size:15px;font-weight:700;}

        /* Panels */
        .eld-panel{background:#17171c;border:1px solid #2a2a35;border-radius:20px;padding:26px;animation:eldUp .5s ease both;transition:border-color .2s;}
        .eld-panel:hover{border-color:#3a3a45;}
        .eld-panel-title{font-size:15px;font-weight:700;color:#fff;margin:0 0 3px;}
        .eld-panel-sub{font-size:12px;color:#475569;margin:0 0 20px;}
        .eld-row{display:flex;flex-direction:column;gap:16px;}
        .eld-two-col{display:grid;grid-template-columns:1fr 220px;gap:16px;align-items:start;}
        @media(max-width:700px){.eld-two-col{grid-template-columns:1fr;}}

        /* Calendar */
        .eld-cal-grid{display:flex;flex-wrap:wrap;gap:7px;}
        .eld-cal-cell{width:46px;height:58px;border-radius:12px;background:#1e1e26;border:1.5px solid #2a2a35;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;cursor:default;transition:transform .15s;position:relative;}
        .eld-cal-cell.has-entry{background:var(--cell-bg);border-color:var(--cell-color);}
        .eld-cal-cell.is-today{outline:2px solid #f59e0b;outline-offset:2px;}
        .eld-cal-cell:hover{transform:scale(1.1);z-index:2;}
        .eld-cal-day{font-size:8px;color:#475569;font-weight:700;text-transform:uppercase;}
        .eld-cal-emoji{font-size:18px;line-height:1;}
        .eld-cal-num{font-size:9px;color:#64748b;font-weight:700;}
        .eld-legend{display:flex;gap:14px;flex-wrap:wrap;margin-top:16px;}
        .eld-legend-item{display:flex;align-items:center;gap:5px;font-size:11px;color:#64748b;font-weight:600;}
        .eld-legend-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0;}

        /* Tooltip */
        .eld-tooltip{background:#1e1e26;border:1px solid #2a2a35;border-radius:10px;padding:8px 14px;font-size:13px;font-family:'Sora',sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4);}

        /* Pie */
        .eld-pie-rows{display:flex;flex-direction:column;gap:8px;margin-top:12px;}
        .eld-pie-row{display:flex;align-items:center;gap:8px;font-size:12px;}
        .eld-pie-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
        .eld-pie-name{flex:1;color:#94a3b8;text-transform:capitalize;}
        .eld-pie-count{font-weight:700;color:#fff;}

        /* Themes */
        .eld-themes{display:flex;gap:10px;flex-wrap:wrap;}
        .eld-theme-pill{border-radius:30px;padding:7px 18px;display:flex;align-items:center;gap:8px;border:1.5px solid transparent;cursor:default;transition:transform .15s;}
        .eld-theme-pill:hover{transform:translateY(-2px);}
        .eld-theme-name{font-size:13px;font-weight:700;text-transform:capitalize;}
        .eld-theme-count{font-size:10px;font-weight:800;border-radius:20px;padding:1px 7px;}

        /* Empty / Error */
        .eld-empty,.eld-error{display:flex;flex-direction:column;align-items:center;justify-content:center;height:240px;gap:8px;color:#475569;}
        .eld-empty-icon{font-size:40px;}
        .eld-empty p,.eld-error p{margin:0;font-size:15px;font-weight:600;color:#64748b;}
        .eld-empty small{font-size:12px;}
        .eld-retry-btn{padding:10px 28px;border-radius:10px;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-weight:700;font-size:13px;background:#f59e0b;color:#0c0c0f;transition:opacity .2s;}
        .eld-retry-btn:hover{opacity:.85;}

        @keyframes eldUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      <div>
        <div className="eld-inner">

          {/* Header */}
          <div className="eld-header">
            <div>
              <p className="eld-eyebrow">Emotional Intelligence</p>
              <h1 className=" text-primary text-3xl font-semibold ">Mood Dashboard</h1>
              <p className="text-lg ">Visualising your inner weather over time</p>
            </div>
            <div className="eld-toggle">
              {[7, 14].map((d) => (
                <button
                  key={d}
                  className={`eld-toggle-btn${days === d ? " active" : ""}`}
                  onClick={() => setDays(d)}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {loading && <Spinner />}

          {!loading && error && (
            <div className="eld-error">
              <span style={{ fontSize: 40 }}>⚠️</span>
              <p style={{ color: "#f43f5e" }}>Could not load dashboard</p>
              <button className="eld-retry-btn" onClick={fetchDashboard}>Retry</button>
            </div>
          )}

          {!loading && !error && data && (
            <div className="eld-row">

              {/* Stat cards */}
              <div className="eld-stats">
                <StatCard label="Total Entries" accent="#f59e0b" delay={0}>
                  <span className="eld-stat-val">{data.totalEntries}</span>
                  <span className="eld-stat-sub">in {days} days</span>
                </StatCard>

                <StatCard label="Dominant Mood" accent={domCfg?.color} delay={80}>
                  <span className="eld-stat-emoji">{domCfg?.emoji}</span>
                  <span className="eld-stat-mood" style={{ color: domCfg?.color }}>{domCfg?.label}</span>
                </StatCard>

                <StatCard label="AI Sentiment" accent={sentCfg?.color} delay={160}>
                  <span className="eld-stat-val" style={{ color: sentCfg?.color, fontSize: 26 }}>
                    {sentCfg?.icon} {data.dominantSentiment}
                  </span>
                  <span className="eld-stat-sub">overall tone</span>
                </StatCard>

                <StatCard label="Positive Streak" accent="#10b981" delay={240}>
                  <span className="eld-stat-val">{data.currentPositiveStreak}d</span>
                  <span className="eld-stat-sub">happy / productive</span>
                </StatCard>
              </div>

              {/* Timeline */}
              <div className="eld-panel" style={{ animationDelay: "320ms" }}>
                <p className="eld-panel-title">Mood Timeline</p>
                <p className="eld-panel-sub">How your emotional state shifted each day</p>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <defs>
                        <linearGradient id="eldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#475569", fontFamily: "Sora,sans-serif" }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1,5]} ticks={[1,2,3,4,5]} tickFormatter={(v) => MOOD_CFG[NUM_MOOD[v]]?.emoji ?? ""} tick={{ fontSize: 14 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<MoodTooltip />} />
                      <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2.5} fill="url(#eldGrad)" dot={{ fill: "#f59e0b", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <EmptyState />}
              </div>

              {/* Calendar + Donut */}
              <div className="eld-two-col">
                <div className="eld-panel" style={{ animationDelay: "400ms" }}>
                  <p className="eld-panel-title">Mood Calendar</p>
                  <p className="eld-panel-sub">Each tile is one day — hover to inspect</p>
                  {hasData ? (
                    <>
                      <MoodCalendar calendarMap={data.calendarMap} days={days} />
                      <div className="eld-legend">
                        {Object.entries(MOOD_CFG).map(([k, cfg]) => (
                          <span key={k} className="eld-legend-item">
                            <span className="eld-legend-dot" style={{ background: cfg.color }} />
                            {cfg.label}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : <EmptyState />}
                </div>

                <div className="eld-panel" style={{ animationDelay: "460ms" }}>
                  <p className="eld-panel-title">Breakdown</p>
                  <p className="eld-panel-sub">Mood share</p>
                  {pieData.length > 0 ? (
                    <>
                      <PieChart width={168} height={168}>
                        <Pie data={pieData} cx={80} cy={80} innerRadius={46} outerRadius={74} dataKey="value" paddingAngle={3}>
                          {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                      <div className="eld-pie-rows">
                        {pieData.map(({ name, value, color }) => (
                          <div key={name} className="eld-pie-row">
                            <span className="eld-pie-dot" style={{ background: color }} />
                            <span className="eld-pie-name">{MOOD_CFG[name]?.label}</span>
                            <span className="eld-pie-count">{value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : <EmptyState />}
                </div>
              </div>

              {/* Themes */}
              {data.topThemes?.length > 0 && (
                <div className="eld-panel" style={{ animationDelay: "520ms" }}>
                  <p className="eld-panel-title">Recurring Themes</p>
                  <p className="eld-panel-sub">Topics your AI insights flagged most often</p>
                  <div className="eld-themes">
                    {data.topThemes.map(({ theme, count }, i) => {
                      const c = PILL_COLORS[i % PILL_COLORS.length];
                      return (
                        <div key={theme} className="eld-theme-pill" style={{ background: `${c}14`, borderColor: `${c}44` }}>
                          <span className="eld-theme-name" style={{ color: c }}>{theme}</span>
                          <span className="eld-theme-count" style={{ background: `${c}22`, color: c }}>{count}×</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
}