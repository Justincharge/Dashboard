import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  bg: "#3d4535",
  card: "#6b7254",
  cardDark: "#555e43",
  accent: "#d4a96a",
  accentDim: "#b8864a",
  text: "#f0ece2",
  muted: "#b8b49a",
  green: "#7ec87e",
  red: "#e07070",
  header: "#2e3328",
  border: "rgba(212,169,106,0.25)",
};

// ─── DEMO DATA ───────────────────────────────────────────────────────────────
const WEEKS = ["S-5", "S-4", "S-3", "S-2", "S-1", "Cette sem."];
const MONTHS = ["Oct", "Nov", "Déc", "Jan", "Fév", "Mars"];

const demoData = {
  week: {
    ventes: [
      { label: "S-5", ca: 3200, commandes: 41, panier: 78, retours: 3, nouveaux: 18, fideles: 23 },
      { label: "S-4", ca: 3750, commandes: 48, panier: 78, retours: 2, nouveaux: 21, fideles: 27 },
      { label: "S-3", ca: 4100, commandes: 52, panier: 79, retours: 4, nouveaux: 24, fideles: 28 },
      { label: "S-2", ca: 3900, commandes: 50, panier: 78, retours: 2, nouveaux: 20, fideles: 30 },
      { label: "S-1", ca: 4400, commandes: 57, panier: 77, retours: 3, nouveaux: 26, fideles: 31 },
      { label: "Cette sem.", ca: 4850, commandes: 63, panier: 77, retours: 2, nouveaux: 29, fideles: 34 },
    ],
    pub: [
      { label: "S-5", depenses: 480, roas: 6.7, cpc: 0.82, ctr: 2.1, impressions: 58500, conversions: 41 },
      { label: "S-4", depenses: 510, roas: 7.4, cpc: 0.79, ctr: 2.3, impressions: 64500, conversions: 48 },
      { label: "S-3", depenses: 540, roas: 7.6, cpc: 0.77, ctr: 2.4, impressions: 70200, conversions: 52 },
      { label: "S-2", depenses: 520, roas: 7.5, cpc: 0.78, ctr: 2.3, impressions: 66700, conversions: 50 },
      { label: "S-1", depenses: 580, roas: 7.6, cpc: 0.76, ctr: 2.5, impressions: 76300, conversions: 57 },
      { label: "Cette sem.", depenses: 620, roas: 7.8, cpc: 0.74, ctr: 2.7, impressions: 83800, conversions: 63 },
    ],
    reseaux: [
      { label: "S-5", abonnes: 4200, portee: 12400, engagement: 3.2, partages: 87, stories: 5, mentions: 14 },
      { label: "S-4", abonnes: 4380, portee: 13800, engagement: 3.5, partages: 102, stories: 6, mentions: 18 },
      { label: "S-3", abonnes: 4510, portee: 15200, engagement: 3.7, partages: 118, stories: 7, mentions: 22 },
      { label: "S-2", abonnes: 4620, portee: 14600, engagement: 3.6, partages: 109, stories: 6, mentions: 19 },
      { label: "S-1", abonnes: 4790, portee: 16800, engagement: 3.9, partages: 134, stories: 8, mentions: 27 },
      { label: "Cette sem.", abonnes: 4950, portee: 18200, engagement: 4.1, partages: 148, stories: 9, mentions: 31 },
    ],
    emails: [
      { label: "S-5", envoyes: 2400, ouvertures: 31.2, clics: 4.8, desabos: 0.3, revenus: 680, listes: 2400 },
      { label: "S-4", envoyes: 2600, ouvertures: 32.5, clics: 5.1, desabos: 0.2, revenus: 780, listes: 2590 },
      { label: "S-3", envoyes: 2800, ouvertures: 33.8, clics: 5.4, desabos: 0.2, revenus: 890, listes: 2780 },
      { label: "S-2", envoyes: 2750, ouvertures: 33.2, clics: 5.2, desabos: 0.3, revenus: 840, listes: 2740 },
      { label: "S-1", envoyes: 3000, ouvertures: 34.5, clics: 5.7, desabos: 0.2, revenus: 980, listes: 2980 },
      { label: "Cette sem.", envoyes: 3200, ouvertures: 35.8, clics: 6.0, desabos: 0.1, revenus: 1100, listes: 3175 },
    ],
    lancements: [
      { label: "S-5", inscrits: 0, ventes: 0, taux: 0, panier: 0, emails: 0, live: 0 },
      { label: "S-4", inscrits: 120, ventes: 0, taux: 0, panier: 0, emails: 3, live: 0 },
      { label: "S-3", inscrits: 340, ventes: 0, taux: 0, panier: 0, emails: 5, live: 1 },
      { label: "S-2", inscrits: 480, ventes: 18, taux: 3.8, panier: 297, emails: 4, live: 2 },
      { label: "S-1", inscrits: 510, ventes: 42, taux: 8.2, panier: 312, emails: 6, live: 2 },
      { label: "Cette sem.", inscrits: 512, ventes: 68, taux: 13.3, panier: 318, emails: 7, live: 3 },
    ],
  },
  month: {
    ventes: [
      { label: "Oct", ca: 13800, commandes: 178, panier: 78, retours: 11, nouveaux: 72, fideles: 106 },
      { label: "Nov", ca: 16200, commandes: 209, panier: 78, retours: 14, nouveaux: 87, fideles: 122 },
      { label: "Déc", ca: 22400, commandes: 288, panier: 78, retours: 21, nouveaux: 128, fideles: 160 },
      { label: "Jan", ca: 14600, commandes: 190, panier: 77, retours: 10, nouveaux: 78, fideles: 112 },
      { label: "Fév", ca: 15800, commandes: 203, panier: 78, retours: 9, nouveaux: 84, fideles: 119 },
      { label: "Mars", ca: 18200, commandes: 237, panier: 77, retours: 10, nouveaux: 98, fideles: 139 },
    ],
    pub: [
      { label: "Oct", depenses: 1920, roas: 7.2, cpc: 0.81, ctr: 2.2, impressions: 237000, conversions: 178 },
      { label: "Nov", depenses: 2100, roas: 7.7, cpc: 0.78, ctr: 2.4, impressions: 269000, conversions: 209 },
      { label: "Déc", depenses: 2800, roas: 8.0, cpc: 0.74, ctr: 2.7, impressions: 378000, conversions: 288 },
      { label: "Jan", depenses: 2000, roas: 7.3, cpc: 0.80, ctr: 2.2, impressions: 250000, conversions: 190 },
      { label: "Fév", depenses: 2150, roas: 7.4, cpc: 0.78, ctr: 2.3, impressions: 263000, conversions: 203 },
      { label: "Mars", depenses: 2380, roas: 7.6, cpc: 0.76, ctr: 2.5, impressions: 310000, conversions: 237 },
    ],
    reseaux: [
      { label: "Oct", abonnes: 3800, portee: 48200, engagement: 3.1, partages: 342, stories: 22, mentions: 58 },
      { label: "Nov", abonnes: 4100, portee: 54800, engagement: 3.4, partages: 398, stories: 26, mentions: 72 },
      { label: "Déc", abonnes: 4620, portee: 71200, engagement: 3.9, partages: 512, stories: 34, mentions: 98 },
      { label: "Jan", abonnes: 4700, portee: 58400, engagement: 3.5, partages: 418, stories: 24, mentions: 79 },
      { label: "Fév", abonnes: 4820, portee: 64600, engagement: 3.7, partages: 445, stories: 27, mentions: 86 },
      { label: "Mars", abonnes: 4950, portee: 72800, engagement: 4.1, partages: 498, stories: 31, mentions: 102 },
    ],
    emails: [
      { label: "Oct", envoyes: 9600, ouvertures: 30.8, clics: 4.6, desabos: 0.4, revenus: 2720, listes: 2400 },
      { label: "Nov", envoyes: 10400, ouvertures: 32.1, clics: 5.0, desabos: 0.3, revenus: 3120, listes: 2600 },
      { label: "Déc", envoyes: 14200, ouvertures: 34.6, clics: 5.8, desabos: 0.2, revenus: 5480, listes: 3050 },
      { label: "Jan", envoyes: 10800, ouvertures: 32.4, clics: 5.0, desabos: 0.3, revenus: 3240, listes: 2750 },
      { label: "Fév", envoyes: 11200, ouvertures: 33.5, clics: 5.3, desabos: 0.2, revenus: 3640, listes: 2980 },
      { label: "Mars", envoyes: 12400, ouvertures: 34.8, clics: 5.8, desabos: 0.1, revenus: 4280, listes: 3175 },
    ],
    lancements: [
      { label: "Oct", inscrits: 0, ventes: 0, taux: 0, panier: 0, emails: 0, live: 0 },
      { label: "Nov", inscrits: 0, ventes: 0, taux: 0, panier: 0, emails: 0, live: 0 },
      { label: "Déc", inscrits: 890, ventes: 0, taux: 0, panier: 0, emails: 12, live: 3 },
      { label: "Jan", inscrits: 1200, ventes: 124, taux: 10.3, panier: 287, emails: 18, live: 5 },
      { label: "Fév", inscrits: 1380, ventes: 178, taux: 12.9, panier: 302, emails: 21, live: 6 },
      { label: "Mars", inscrits: 512, ventes: 68, taux: 13.3, panier: 318, emails: 7, live: 3 },
    ],
  },
};

// ─── KPI DEFINITIONS ─────────────────────────────────────────────────────────
const KPI_DEFS = {
  ventes: [
    { key: "ca", label: "CA Total", icon: "💰", fmt: (v) => `${v.toLocaleString("fr-FR")}€`, chartKey: "ca" },
    { key: "commandes", label: "Commandes", icon: "📦", fmt: (v) => v, chartKey: "commandes" },
    { key: "panier", label: "Panier Moyen", icon: "🛒", fmt: (v) => `${v}€`, chartKey: "panier" },
    { key: "retours", label: "Retours", icon: "↩️", fmt: (v) => v, chartKey: "retours" },
    { key: "nouveaux", label: "Nouveaux Clients", icon: "✨", fmt: (v) => v, chartKey: "nouveaux" },
    { key: "fideles", label: "Clients Fidèles", icon: "❤️", fmt: (v) => v, chartKey: "fideles" },
  ],
  pub: [
    { key: "depenses", label: "Dépenses Pub", icon: "💸", fmt: (v) => `${v}€`, chartKey: "depenses" },
    { key: "roas", label: "ROAS", icon: "📈", fmt: (v) => `×${v}`, chartKey: "roas" },
    { key: "cpc", label: "CPC", icon: "🖱️", fmt: (v) => `${v}€`, chartKey: "cpc" },
    { key: "ctr", label: "CTR", icon: "🎯", fmt: (v) => `${v}%`, chartKey: "ctr" },
    { key: "impressions", label: "Impressions", icon: "👁️", fmt: (v) => `${(v / 1000).toFixed(0)}k`, chartKey: "impressions" },
    { key: "conversions", label: "Conversions", icon: "⚡", fmt: (v) => v, chartKey: "conversions" },
  ],
  reseaux: [
    { key: "abonnes", label: "Abonnés", icon: "👥", fmt: (v) => `${(v / 1000).toFixed(1)}k`, chartKey: "abonnes" },
    { key: "portee", label: "Portée", icon: "📡", fmt: (v) => `${(v / 1000).toFixed(0)}k`, chartKey: "portee" },
    { key: "engagement", label: "Engagement", icon: "💬", fmt: (v) => `${v}%`, chartKey: "engagement" },
    { key: "partages", label: "Partages", icon: "🔁", fmt: (v) => v, chartKey: "partages" },
    { key: "stories", label: "Stories", icon: "📸", fmt: (v) => v, chartKey: "stories" },
    { key: "mentions", label: "Mentions", icon: "🏷️", fmt: (v) => v, chartKey: "mentions" },
  ],
  emails: [
    { key: "envoyes", label: "Envoyés", icon: "📨", fmt: (v) => `${(v / 1000).toFixed(1)}k`, chartKey: "envoyes" },
    { key: "ouvertures", label: "Taux d'ouv.", icon: "📬", fmt: (v) => `${v}%`, chartKey: "ouvertures" },
    { key: "clics", label: "Taux de clics", icon: "🖱️", fmt: (v) => `${v}%`, chartKey: "clics" },
    { key: "desabos", label: "Désabos", icon: "🚪", fmt: (v) => `${v}%`, chartKey: "desabos" },
    { key: "revenus", label: "Revenus Email", icon: "💵", fmt: (v) => `${v}€`, chartKey: "revenus" },
    { key: "listes", label: "Taille Liste", icon: "📋", fmt: (v) => `${(v / 1000).toFixed(1)}k`, chartKey: "listes" },
  ],
  lancements: [
    { key: "inscrits", label: "Inscrits", icon: "📝", fmt: (v) => v, chartKey: "inscrits" },
    { key: "ventes", label: "Ventes", icon: "🏆", fmt: (v) => v, chartKey: "ventes" },
    { key: "taux", label: "Taux Convers.", icon: "📊", fmt: (v) => `${v}%`, chartKey: "taux" },
    { key: "panier", label: "Panier Moyen", icon: "💰", fmt: (v) => v > 0 ? `${v}€` : "—", chartKey: "panier" },
    { key: "emails", label: "Emails Séquence", icon: "📧", fmt: (v) => v, chartKey: "emails" },
    { key: "live", label: "Lives / Webinaires", icon: "🎥", fmt: (v) => v, chartKey: "live" },
  ],
};

const TABS = [
  { id: "ventes", label: "Ventes", icon: "💰" },
  { id: "pub", label: "Pub", icon: "📣" },
  { id: "reseaux", label: "Réseaux", icon: "📱" },
  { id: "emails", label: "Emails", icon: "📧" },
  { id: "lancements", label: "Lancements", icon: "🚀" },
  { id: "ia", label: "IA", icon: "🤖" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function trend(data, key, idx) {
  if (idx === 0) return null;
  const curr = data[idx][key];
  const prev = data[idx - 1][key];
  if (prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

function calcHealth(weekData) {
  // Simple health: avg trend across all tabs at last period
  let total = 0, count = 0;
  Object.keys(demoData.week).forEach((tab) => {
    if (tab === "ia") return;
    const d = weekData[tab];
    const kpis = KPI_DEFS[tab];
    kpis.forEach((k) => {
      const t = trend(d, k.key, d.length - 1);
      if (t !== null) { total += t; count++; }
    });
  });
  const avg = count > 0 ? total / count : 0;
  return Math.min(100, Math.max(0, Math.round(72 + avg * 2)));
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function HealthScore({ score }) {
  const color = score >= 80 ? C.green : score >= 60 ? C.accent : C.red;
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 7, color: C.muted, letterSpacing: 0.5 }}>SANTÉ</span>
      </div>
    </div>
  );
}

function KpiCard({ label, icon, value, trendVal, active, onClick }) {
  const isPos = trendVal > 0, isNeg = trendVal < 0;
  const tColor = isPos ? C.green : isNeg ? C.red : C.muted;
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? `linear-gradient(135deg, ${C.accent}22, ${C.card})` : C.card,
        border: active ? `1.5px solid ${C.accent}` : `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "12px 10px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: active ? "scale(1.02)" : "scale(1)",
        boxShadow: active ? `0 4px 20px ${C.accent}30` : "0 2px 8px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        minHeight: 80,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        {trendVal !== null && (
          <span style={{ fontSize: 10, fontWeight: 700, color: tColor, background: `${tColor}20`, borderRadius: 6, padding: "2px 5px" }}>
            {isPos ? "+" : ""}{trendVal.toFixed(1)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: C.muted, letterSpacing: 0.3, lineHeight: 1.2 }}>{label}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.header, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "8px 12px", fontSize: 12, color: C.text,
    }}>
      <div style={{ color: C.accent, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: C.muted }}>
          {p.value?.toLocaleString("fr-FR")}
        </div>
      ))}
    </div>
  );
}

function TabContent({ tabId, period, periodIdx }) {
  const [activeKpi, setActiveKpi] = useState(0);
  const kpis = KPI_DEFS[tabId];
  const data = demoData[period][tabId];
  const currentData = data[periodIdx];
  const health = calcHealth(demoData.week);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {kpis.map((kpi, i) => {
          const t = trend(data, kpi.key, periodIdx);
          return (
            <KpiCard
              key={kpi.key}
              label={kpi.label}
              icon={kpi.icon}
              value={kpi.fmt(currentData[kpi.key])}
              trendVal={t}
              active={activeKpi === i}
              onClick={() => setActiveKpi(i)}
            />
          );
        })}
      </div>
      {/* Chart */}
      <div style={{
        background: C.card, borderRadius: 16, padding: "16px 8px 8px",
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, paddingLeft: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>{kpis[activeKpi].icon}</span>
          <span style={{ color: C.accent, fontWeight: 700 }}>{kpis[activeKpi].label}</span>
          <span>— évolution</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.accent} stopOpacity={0.4} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={kpis[activeKpi].chartKey}
              stroke={C.accent}
              strokeWidth={2.5}
              fill="url(#grad)"
              dot={{ fill: C.accent, r: 3, strokeWidth: 0 }}
              activeDot={{ fill: C.accent, r: 5, stroke: C.text, strokeWidth: 1.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function IaTab({ period, periodIdx }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function analyser() {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const snap = {};
      Object.entries(demoData[period]).forEach(([tab, rows]) => {
        const row = rows[periodIdx];
        snap[tab] = row;
      });
      const periodLabel = period === "week"
        ? ["S-5", "S-4", "S-3", "S-2", "S-1", "Cette sem."][periodIdx]
        : ["Oct", "Nov", "Déc", "Jan", "Fév", "Mars"][periodIdx];

      const prompt = `Tu es une assistante virtuelle experte en e-commerce et marketing digital. Analyse ces KPI d'une boutique e-commerce pour la période "${periodLabel}" :

VENTES: CA=${snap.ventes?.ca}€, Commandes=${snap.ventes?.commandes}, Panier moyen=${snap.ventes?.panier}€, Nouveaux clients=${snap.ventes?.nouveaux}
PUBLICITÉ: Dépenses=${snap.pub?.depenses}€, ROAS=${snap.pub?.roas}x, CTR=${snap.pub?.ctr}%, CPC=${snap.pub?.cpc}€
RÉSEAUX SOCIAUX: Abonnés=${snap.reseaux?.abonnes}, Engagement=${snap.reseaux?.engagement}%, Portée=${snap.reseaux?.portee}
EMAILS: Liste=${snap.emails?.listes}, Taux d'ouv.=${snap.emails?.ouvertures}%, Revenus=${snap.emails?.revenus}€
LANCEMENTS: Inscrits=${snap.lancements?.inscrits}, Ventes=${snap.lancements?.ventes}, Conversion=${snap.lancements?.taux}%

Fournis une analyse concise (max 200 mots) avec :
1. 🌟 Points forts (2-3)
2. ⚠️ Points d'attention (2-3)
3. 🎯 Actions prioritaires (3 actions concrètes et actionnables)

Sois direct, précis et orienté résultats. Utilise des emojis pour structurer.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      setResult(text);
    } catch (e) {
      setError("Erreur lors de l'analyse. Vérifie ta connexion.");
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{
        background: C.card, borderRadius: 16, padding: 16,
        border: `1px solid ${C.border}`, textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🤖</div>
        <div style={{ color: C.text, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Analyse IA FlowBoard</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>
          L'IA analyse tous tes KPI et génère des recommandations personnalisées pour booster ta performance.
        </div>
        <button
          onClick={analyser}
          disabled={loading}
          style={{
            background: loading ? C.cardDark : `linear-gradient(135deg, ${C.accent}, ${C.accentDim})`,
            color: loading ? C.muted : "#1a1a0a",
            border: "none",
            borderRadius: 12,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: 0.5,
            transition: "all 0.2s",
            boxShadow: loading ? "none" : `0 4px 16px ${C.accent}50`,
          }}
        >
          {loading ? "⏳ Analyse en cours…" : "✨ Analyser mes KPI"}
        </button>
      </div>

      {error && (
        <div style={{
          background: `${C.red}20`, border: `1px solid ${C.red}50`,
          borderRadius: 12, padding: 14, color: C.red, fontSize: 13,
        }}>{error}</div>
      )}

      {result && (
        <div style={{
          background: C.card, borderRadius: 16, padding: 16,
          border: `1px solid ${C.accent}40`,
          boxShadow: `0 4px 24px ${C.accent}20`,
        }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, marginBottom: 12, letterSpacing: 1 }}>
            ANALYSE IA
          </div>
          <div style={{
            color: C.text, fontSize: 13, lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}>{result}</div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [period, setPeriod] = useState("week");
  const [periodIdx, setPeriodIdx] = useState(5);
  const [activeTab, setActiveTab] = useState("ventes");
  const [csvStatus, setCsvStatus] = useState(null);

  const maxIdx = period === "week" ? 5 : 5;
  const labels = period === "week" ? WEEKS : MONTHS;
  const health = calcHealth(demoData.week);

  useEffect(() => {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTtx37DOJLm4rWMB86Ynu6uxN2eyhFmThqXv-P6csvqXZi45pmVj4niQTqeOSDEUQ/pub?output=csv";
    fetch(url)
      .then((r) => r.ok ? r.text() : Promise.reject("HTTP " + r.status))
      .then(() => setCsvStatus("✅ Données CSV chargées"))
      .catch(() => setCsvStatus("📊 Données de démo actives"));
  }, []);

  const handlePrev = () => setPeriodIdx((i) => Math.max(0, i - 1));
  const handleNext = () => setPeriodIdx((i) => Math.min(maxIdx, i + 1));

  const styles = {
    root: {
      minHeight: "100dvh",
      background: C.bg,
      maxWidth: 430,
      margin: "0 auto",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      color: C.text,
      position: "relative",
    },
    header: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: C.header,
      borderBottom: `1px solid ${C.border}`,
      padding: "10px 14px",
      backdropFilter: "blur(12px)",
    },
    headerTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 10,
    },
    clientInfo: {
      flex: 1,
      minWidth: 0,
    },
    clientName: {
      fontSize: 15,
      fontWeight: 800,
      color: C.text,
      letterSpacing: -0.3,
      lineHeight: 1.1,
    },
    clientSub: {
      fontSize: 10,
      color: C.muted,
      marginTop: 1,
    },
    headerNav: {
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    periodToggle: {
      display: "flex",
      background: C.bg,
      borderRadius: 10,
      overflow: "hidden",
      border: `1px solid ${C.border}`,
    },
    periodBtn: (active) => ({
      padding: "5px 10px",
      fontSize: 11,
      fontWeight: active ? 700 : 400,
      color: active ? "#1a1a0a" : C.muted,
      background: active ? C.accent : "transparent",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
    }),
    navRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    navArrow: (disabled) => ({
      width: 32,
      height: 32,
      borderRadius: 10,
      background: disabled ? "transparent" : `${C.accent}20`,
      border: `1px solid ${disabled ? "transparent" : C.border}`,
      color: disabled ? C.cardDark : C.accent,
      fontSize: 16,
      cursor: disabled ? "default" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.2s",
    }),
    periodLabel: {
      flex: 1,
      textAlign: "center",
      fontSize: 13,
      fontWeight: 700,
      color: C.text,
    },
    tabBar: {
      display: "flex",
      overflowX: "auto",
      gap: 4,
      padding: "12px 14px 0",
      scrollbarWidth: "none",
    },
    tab: (active) => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      padding: "7px 10px",
      borderRadius: "12px 12px 0 0",
      background: active ? C.card : "transparent",
      border: `1px solid ${active ? C.border : "transparent"}`,
      borderBottom: active ? `2px solid ${C.accent}` : "1px solid transparent",
      cursor: "pointer",
      flexShrink: 0,
      transition: "all 0.2s",
    }),
    tabIcon: { fontSize: 16 },
    tabLabel: (active) => ({
      fontSize: 9,
      fontWeight: active ? 700 : 400,
      color: active ? C.accent : C.muted,
      letterSpacing: 0.3,
      whiteSpace: "nowrap",
    }),
    content: {
      padding: "16px 14px 90px",
    },
    csvBadge: {
      margin: "0 14px 12px",
      padding: "6px 10px",
      background: `${C.accent}15`,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      fontSize: 10,
      color: C.muted,
    },
  };

  return (
    <div style={styles.root}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <HealthScore score={health} />
          <div style={styles.clientInfo}>
            <div style={styles.clientName}>Boutique Lumière</div>
            <div style={styles.clientSub}>E-commerce · Mode & Accessoires</div>
          </div>
          <div style={styles.periodToggle}>
            <button style={styles.periodBtn(period === "week")} onClick={() => { setPeriod("week"); setPeriodIdx(5); }}>Sem.</button>
            <button style={styles.periodBtn(period === "month")} onClick={() => { setPeriod("month"); setPeriodIdx(5); }}>Mois</button>
          </div>
        </div>
        <div style={styles.navRow}>
          <button style={styles.navArrow(periodIdx === 0)} onClick={handlePrev} disabled={periodIdx === 0}>‹</button>
          <div style={styles.periodLabel}>{labels[periodIdx]}</div>
          <button style={styles.navArrow(periodIdx === maxIdx)} onClick={handleNext} disabled={periodIdx === maxIdx}>›</button>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={styles.tabBar}>
        {TABS.map((t) => (
          <button key={t.id} style={styles.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            <span style={styles.tabIcon}>{t.icon}</span>
            <span style={styles.tabLabel(activeTab === t.id)}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* CSV BADGE */}
      {csvStatus && <div style={styles.csvBadge}>{csvStatus}</div>}

      {/* CONTENT */}
      <div style={styles.content}>
        {activeTab === "ia" ? (
          <IaTab period={period} periodIdx={periodIdx} />
        ) : (
          <TabContent key={activeTab + period} tabId={activeTab} period={period} periodIdx={periodIdx} />
        )}
      </div>
    </div>
  );
}
