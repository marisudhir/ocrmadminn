import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../api/constraints";
import { useNavigate } from "react-router-dom";
import Pagination from "../../admin/context/Pagination/pagination";
import CommonSearchBar from "../../admin/context/commonsearchbar/searchbar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// ── Animated number counter ──────────────────────────────────────────────────
const AnimatedNumber = ({ value, duration = 800 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const to = parseFloat(value) || 0;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((to * eased).toFixed(typeof value === "string" && value.includes(".") ? 2 : 0));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return <>{display}</>;
};

// ── Storage bar ──────────────────────────────────────────────────────────────
const StorageBar = ({ mb }) => {
  const maxMb = 500;
  const pct = Math.min((parseFloat(mb) / maxMb) * 100, 100);
  const color = pct > 80 ? "#ef4444" : pct > 50 ? "#f59e0b" : "#2563eb";
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "#475569", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>
          Storage Used
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>
          {mb} MB
        </span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: animated ? `${pct}%` : "0%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 99,
          transition: "width 1.1s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 0 8px ${color}44`,
        }} />
      </div>
    </div>
  );
};

// ── Company card ─────────────────────────────────────────────────────────────
const CompanyCard = ({ company, index }) => {
      const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 50);
    return () => clearTimeout(t);
  }, [index]);

  const palette = ["#2563eb","#7c3aed","#0891b2","#059669","#d97706","#dc2626"];
  const accent  = palette[company.iCompany_id % palette.length] || "#2563eb";
  const initial = company.cCompany_name?.[0]?.toUpperCase() || "?";

  const stats = [
    { label: "Users", value: company.total_users,  icon: "👤" },
    { label: "Leads", value: company.total_leads,  icon: "📋" },
    { label: "Files", value: company.total_files,  icon: "📁" },
  ];

  return (
    <div
     onClick={() => navigate(`/StoragecompanyUser/${company.iCompany_id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered ? "translateY(-4px)" : "translateY(0)"
          : "translateY(16px)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        background: "#ffffff",
        border: `1px solid ${hovered ? accent + "66" : "#cbd5e1"}`,
        borderRadius: 16,
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        boxShadow: hovered
          ? `0 12px 40px ${accent}18, 0 2px 8px #0000000f`
          : "0 1px 4px #0000000a",
        cursor: "default",
      }}
    >
      {/* Left accent border */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 3,
        background: accent,
        opacity: hovered ? 1 : 0.3,
        transition: "opacity 0.3s",
        borderRadius: "16px 0 0 16px",
      }} />

      {/* Top-right soft glow */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 100, height: 100,
        background: `radial-gradient(circle, ${accent}0c, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingLeft: 8 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${accent}22, ${accent}0f)`,
          border: `1.5px solid ${accent}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 800, color: accent,
          fontFamily: "'Syne', sans-serif",
          boxShadow: hovered ? `0 4px 14px ${accent}2a` : "none",
          transition: "box-shadow 0.3s",
        }}>
          {initial}
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <h2 style={{
            margin: 0, fontSize: 18, fontWeight: 800,
            color: "#020617",
            fontFamily: "'Syne', sans-serif",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {company.cCompany_name}
          </h2>
          <div style={{
            fontSize: 13, color: "#475569", marginTop: 3, fontWeight: 600,
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
          }}>
            ID #{company.iCompany_id}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 8, paddingLeft: 8 }}>
        {stats.map(({ label, value, icon }) => (
          <div key={label} style={{
            flex: 1,
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: 10,
            padding: "10px 6px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 14, marginBottom: 4 }}>{icon}</div>
            <div style={{
              fontSize: 22, fontWeight: 800, color: "#0f172a",
              fontFamily: "'DM Mono', monospace", lineHeight: 1,
            }}>
              <AnimatedNumber value={value} />
            </div>
            <div style={{
              fontSize: 12, color: "#334155", marginTop: 6, fontWeight: 600,
              letterSpacing: "0.04em", textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace",
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingLeft: 8 }}>
        <StorageBar mb={company.storage_mb} />
      </div>
    </div>
  );
};

// ── Main StoragePage ─────────────────────────────────────────────────────────
const StoragePage = () => {
  const [companies, setCompanies]       = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [search, setSearch]             = useState("");
  const [currentPage, setCurrentPage]   = useState(1);
  const [total, setTotal]               = useState(0);
  const [loading, setLoading]           = useState(false);
  const itemsPerPage = 10;

  const fetchStorage = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${ENDPOINTS.COMPANY_STORAGE}?page=${currentPage}&limit=${itemsPerPage}&search=${search}`
      );
      setCompanies(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Storage API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCompanyStorage = async () => {
    try {
      const res = await axios.get(`${ENDPOINTS.TOP_COMPANY_STORAGE_USAGE}?limit=10`);
      setTopCompanies(res.data?.data || []);
    } catch (err) {
      console.error("Top company storage API error:", err);
    }
  };

  useEffect(() => { fetchStorage(); }, [currentPage, search]);
  useEffect(() => { fetchTopCompanyStorage(); }, []);

  const totalPages = Math.ceil(total / itemsPerPage) || 1;
  const totalStorageMb = companies.reduce((s, c) => s + parseFloat(c.storage_mb || 0), 0).toFixed(2);
  const mappedTopCompanies = topCompanies.map((c) => ({
    id: c.iCompany_id,
    name: c.cCompany_name,
    value: Number(c.storage_mb),
  }));
  const nonZeroTopCompanies = mappedTopCompanies.filter((item) => item.value > 0);
  const topChartData = nonZeroTopCompanies.length > 0 ? nonZeroTopCompanies : mappedTopCompanies;
  const chartColors = ["#2563eb", "#0ea5e9", "#14b8a6", "#22c55e", "#84cc16", "#f59e0b", "#f97316", "#ef4444", "#ec4899", "#8b5cf6"];
  const companyColorMap = Object.fromEntries(
    topChartData.map((item, index) => [item.id, chartColors[index % chartColors.length]])
  );

  return (
    <div className="storage-module min-h-screen bg-white px-7 pt-7 pb-[60px]">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');
        .storage-module, .storage-module * { font-family: 'DM Sans', sans-serif !important; font-size: 15px; }
        * { box-sizing: border-box; }
        input:focus { outline: none; }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <div className="mb-5 animate-[fadeUp_0.4s_ease_both]">
        <div className="flex flex-wrap items-center justify-between gap-3">

          {/* Title */}
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "1.875rem",
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.1,
              }}
            >
              Storage{" "}
              <span
                style={{
                  color: "#2737b8",
                  fontSize: "0.92em",
                }}
              >
                Monitor
              </span>
            </h1>
          </div>

          {/* Summary chips */}
          <div className="flex items-stretch gap-2.5 sm:gap-3">
            {[
              { label: "Companies", value: total,          color: "#2563eb" },
              { label: "Total MB",  value: totalStorageMb, color: "#7c3aed" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="w-[160px] sm:w-[180px] rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm backdrop-blur-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="text-[10px] uppercase tracking-[0.14em] text-slate-900 whitespace-nowrap text-left"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-[1.35rem] sm:text-[1.7rem] font-bold leading-none"
                    style={{ color, fontFamily: "'DM Mono', monospace" }}
                  >
                    <AnimatedNumber value={value} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
{/* TOP COMPANY STORAGE CHARTS */}
{!loading && topChartData.length > 0 && (
  <div
    style={{
      background: "#ffffff",
      borderRadius: 16,
      padding: 20,
      marginBottom: 30,
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 6px #0000000a"
    }}
    >
      <h3
      style={{
        marginBottom: 18,
        fontFamily: "'Syne', sans-serif",
        fontSize: 18,
        fontWeight: 700,
        color: "#0f172a"
      }}
    >
      Top Company Storage Usage (MB) - Bar + Pie
    </h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: 20,
        alignItems: "center",
      }}
    >
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topChartData} margin={{ top: 10, right: 10, left: 0, bottom: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} MB`, "Storage"]} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {topChartData.map((entry) => (
                <Cell key={`bar-${entry.id}`} fill={companyColorMap[entry.id]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={90}
              labelLine={false}
              label={({ value }) => `${Number(value).toFixed(2)} MB`}
            >
              {topChartData.map((entry) => (
                <Cell key={`pie-${entry.id}`} fill={companyColorMap[entry.id]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} MB`, "Storage"]} />
            <Legend
              verticalAlign="bottom"
              formatter={(name) => (name.length > 24 ? `${name.slice(0, 24)}...` : name)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
)}

      {/* ══ SEARCH ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        marginBottom: 24, flexWrap: "wrap",
        animation: "fadeUp 0.4s 0.08s ease both",
      }}>
        <div style={{ flex: 1, minWidth: 240, maxWidth: 420 }}>
          <CommonSearchBar
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search companies..."
            className="max-w-full"
            inputClassName="font-normal"
          />
        </div>

        {!loading && (
          <div style={{
            fontSize: 12, color: "#94a3b8",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.04em",
          }}>
            {total} result{total !== 1 ? "s" : ""}{search ? ` for "${search}"` : ""}
          </div>
        )}
      </div>

      {/* ══ SKELETON ════════════════════════════════════════════════════════ */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{
              height: 205, borderRadius: 16,
              background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
              backgroundSize: "600px 100%",
              animation: `shimmer 1.5s ${i * 0.04}s infinite`,
              border: "1px solid #e2e8f0",
            }} />
          ))}
        </div>
      )}

      {/* ══ GRID ════════════════════════════════════════════════════════════ */}
      {!loading && companies.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {companies.map((company, i) => (
            <CompanyCard key={company.iCompany_id} company={company} index={i} />
          ))}
        </div>
      )}

      {/* ══ EMPTY STATE ═════════════════════════════════════════════════════ */}
      {!loading && companies.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px", animation: "fadeUp 0.4s ease both" }}>
          <div style={{ fontSize: 48, marginBottom: 14, opacity: 0.25 }}>🗄️</div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 18, fontWeight: 700, color: "#94a3b8", marginBottom: 6,
          }}>
            No companies found
          </div>
          <div style={{ fontSize: 13, color: "#cbd5e1" }}>Try a different search term</div>
        </div>
      )}

      {/* ══ PAGINATION ══════════════════════════════════════════════════════ */}
      {!loading && totalPages > 1 && (
        <div style={{
          marginTop: 40,
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 12,
          animation: "fadeUp 0.4s 0.15s ease both",
        }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
          {/* <div style={{
            fontSize: 11, color: "#94a3b8",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.08em",
          }}>
            Page {currentPage} of {totalPages} · {total} companies
          </div> */}
        </div>
      )}

    </div>
  );
};

export default StoragePage;
