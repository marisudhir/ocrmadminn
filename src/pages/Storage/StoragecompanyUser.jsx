import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../../api/constraints";
import Pagination from "../../admin/context/Pagination/pagination";
import CommonBackButton from "../../admin/context/commonbutton/CommonBackButton";

// ── Storage bar ──────────────────────────────────────────────────────────────
const StorageBar = ({ mb }) => {
  const pct = Math.min((parseFloat(mb) / 100) * 100, 100);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  const barColor =
    pct > 80 ? "bg-red-500" : pct > 40 ? "bg-amber-400" : "bg-blue-500";
  const textColor =
    pct > 80 ? "text-red-500" : pct > 40 ? "text-amber-500" : "text-blue-600";

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm uppercase tracking-wide text-slate-600 font-semibold">
          Storage
        </span>
        <span className={`text-base font-bold font-mono ${textColor}`}>
          {mb} MB
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: animated ? `${Math.max(pct, parseFloat(mb) > 0 ? 3 : 0)}%` : "0%" }}
        />
      </div>
    </div>
  );
};

// ── User card ────────────────────────────────────────────────────────────────
const UserCard = ({ user, index }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 50);
    return () => clearTimeout(t);
  }, [index]);

  const avatarColors = [
    "bg-blue-100 text-blue-600 border-blue-200",
    "bg-violet-100 text-violet-600 border-violet-200",
    "bg-cyan-100 text-cyan-600 border-cyan-200",
    "bg-emerald-100 text-emerald-600 border-emerald-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-rose-100 text-rose-600 border-rose-200",
  ];
  const avatarClass = avatarColors[user.user_id % avatarColors.length];
  const initial = user.name?.[0]?.toUpperCase() || "?";

  return (
    <div
      className={`
        bg-white border border-slate-300 rounded-2xl p-5 relative overflow-hidden
        shadow-sm hover:shadow-md hover:-translate-y-1
        transition-all duration-300 ease-out cursor-default
        hover:border-blue-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
      style={{ transition: `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s, box-shadow 0.2s, border-color 0.2s` }}
    >
      {/* Left accent */}
      <div className="absolute top-0 left-0 bottom-0 w-0.5 bg-blue-500 rounded-l-2xl opacity-20 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pl-2">
        <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center text-base font-bold shrink-0 ${avatarClass}`}>
          {initial}
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-900 truncate">
              {user.name}
            </h2>
            <span className={`
              text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide
              ${user.active
                ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                : "bg-red-100 text-red-700 border border-red-300"
              }
            `}>
              {user.active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-sm text-slate-600 truncate mt-0.5 font-medium">
            {user.email}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-2 pl-2">
        {[
          { label: "Leads", value: user.total_leads, icon: "📋" },
          { label: "Files", value: user.total_files, icon: "📁" },
        ].map(({ label, value, icon }) => (
          <div
            key={label}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl p-3 text-center"
          >
            <div className="text-base mb-1">{icon}</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono leading-none">
              {value}
            </div>
            <div className="text-xs text-slate-700 mt-1 uppercase tracking-wide font-semibold">
              {label}
            </div>
          </div>
        ))}
      </div>

      <div className="pl-2">
        <StorageBar mb={user.storage_mb} />
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const StoragecompanyUser = () => {
  const { userId }  = useParams();

  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [focused, setFocused]         = useState(false);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${ENDPOINTS.BASE_URL_IS}/admin-dashboard/company-user-stats/${userId}`
      );
      setUsers(res.data || []);
    } catch (err) {
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [userId]);

  const filtered   = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalMb    = users.reduce((s, u) => s + parseFloat(u.storage_mb || 0), 0).toFixed(2);
  const activeCount = users.filter(u => u.active).length;

  return (
    <div className="storage-module p-7 pb-16">
      <style>{`
        .storage-module, .storage-module * { font-family: 'DM Sans', sans-serif !important; font-size: 15px; }
      `}</style>

      {/* ══ HEADER ════════════════════════════════════════════════════════ */}
      <div className="mb-7 animate-[fadeUp_0.4s_ease_both]">

        {/* Back + Title */}
        <div className="flex items-center gap-4 mb-5">
          <CommonBackButton className="mb-0" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-blue-600 font-medium font-mono mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              Storage Monitor · Company Users
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              User <span className="text-blue-600">Storage</span>
            </h1>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex gap-3 flex-wrap mb-5">
          {[
            { label: "Total Users", value: users.length,  color: "text-blue-600"    },
            { label: "Active",      value: activeCount,   color: "text-emerald-600" },
            { label: "Total MB",    value: totalMb,       color: "text-violet-600"  },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-center shadow-xs min-w-[80px]">
              <div className={`text-xl font-bold font-mono leading-none ${color}`}>{value}</div>
              <div className="text-xs text-slate-700 mt-1.5 uppercase tracking-wide font-semibold">{label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-blue-200 via-slate-200 to-transparent" />
      </div>

      {/* ══ SEARCH ════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-60 max-w-md">
          <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-colors ${focused ? "text-blue-500" : "text-slate-300"}`}>
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className={`
              w-full bg-white rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-800
              border transition-all duration-200 placeholder:text-slate-300
              ${focused
                ? "border-blue-400 ring-3 ring-blue-50 shadow-sm"
                : "border-slate-200 shadow-xs"
              }
            `}
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setCurrentPage(1); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-xs flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              ×
            </button>
          )}
        </div>
        {!loading && (
          <p className="text-xs text-slate-400 font-mono">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            {search ? ` for "${search}"` : ""}
          </p>
        )}
      </div>

      {/* ══ SKELETON ══════════════════════════════════════════════════════ */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl border border-slate-100 animate-pulse bg-slate-50"
            />
          ))}
        </div>
      )}

      {/* ══ GRID ══════════════════════════════════════════════════════════ */}
      {!loading && paginated.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginated.map((user, i) => (
            <UserCard key={user.user_id} user={user} index={i} />
          ))}
        </div>
      )}

      {/* ══ EMPTY ═════════════════════════════════════════════════════════ */}
      {!loading && paginated.length === 0 && (
        <div className="text-center py-24">
          <div className="text-5xl mb-4 opacity-20">👤</div>
          <p className="text-lg font-bold text-slate-300 mb-1">No users found</p>
          <p className="text-sm text-slate-300">Try a different search term</p>
        </div>
      )}

      {/* ══ PAGINATION ════════════════════════════════════════════════════ */}
      {!loading && totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
          <p className="text-[11px] text-slate-400 font-mono tracking-wide">
            Page {currentPage} of {totalPages} · {filtered.length} users
          </p>
        </div>
      )}

    </div>
  );
};

export default StoragecompanyUser;

