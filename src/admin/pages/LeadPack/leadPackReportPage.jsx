import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../../api/constraints";
import CommonTable from "../../context/TableStructure/CommonTable";
import Pagination from "../../context/Pagination/pagination";
import usePagination from "../../hooks/usePagination";
import CommonBackButton from "../../context/commonbutton/CommonBackButton";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

const decodeToken = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

const isAdmin = (decoded) =>
  Number(decoded?.role_id) === 1 || Number(decoded?.role_id) === 6;

const money = (value) => Number(value || 0).toFixed(2);
const BAR_COLORS = {
  balance: "#2563eb",
  used: "#f59e0b",
};
const SPEEDOMETER_MAX = 280;

const polarPoint = (cx, cy, r, angleDeg) => {
  const rad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const arcPath = (cx, cy, r, startAngle, endAngle) => {
  const start = polarPoint(cx, cy, r, startAngle);
  const end = polarPoint(cx, cy, r, endAngle);
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const SpeedMeter = ({ speed, max, paidCount, failedCount, totalCount }) => {
  const safeMax = Number(max) > 0 ? Number(max) : 1;
  const clamped = Math.max(0, Math.min(Number(speed || 0), safeMax));
  const [animatedSpeed, setAnimatedSpeed] = useState(0);
  const startAngle = -210;
  const endAngle = 30;
  const needleAngle = startAngle + (animatedSpeed / safeMax) * (endAngle - startAngle);
  const meterCx = 160;
  const meterCy = 138;
  const needleTip = polarPoint(meterCx, meterCy, 96, 0);

  useEffect(() => {
    let frameId;
    let startTime;
    const from = animatedSpeed;
    const to = clamped;
    const duration = 900;

    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (to - from) * eased;
      setAnimatedSpeed(next);
      if (progress < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [clamped]);

  return (
    <div className="h-72 flex items-center justify-center">
      <svg viewBox="0 0 320 220" className="w-full max-w-[360px]">
        <defs>
          <linearGradient id="meterBlueBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <filter id="needleGlow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="320" height="220" rx="10" fill="url(#meterBlueBg)" />
        <path
          d={arcPath(meterCx, meterCy, 116, startAngle, endAngle)}
          stroke="#f8fafc"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={arcPath(meterCx, meterCy, 116, startAngle, needleAngle)}
          stroke="#bfdbfe"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
        />

        {[...Array(25)].map((_, idx) => {
          const angle = startAngle + idx * 10;
          const outer = polarPoint(meterCx, meterCy, 129, angle);
          const inner = polarPoint(meterCx, meterCy, idx % 2 === 0 ? 106 : 112, angle);
          return (
            <line
              key={idx}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#1e3a8a"
              strokeWidth={idx % 2 === 0 ? 2 : 1}
            />
          );
        })}

        {[...Array(15)].map((_, idx) => {
          const mark = idx * 20;
          const angle = startAngle + (mark / safeMax) * (endAngle - startAngle);
          const pos = polarPoint(meterCx, meterCy, 146, angle);
          return (
            <text
              key={mark}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="#eff6ff"
              fontWeight="500"
            >
              {mark}
            </text>
          );
        })}

        <g
          transform={`rotate(${needleAngle} ${meterCx} ${meterCy})`}
          filter="url(#needleGlow)"
        >
          <line
            x1={meterCx}
            y1={meterCy}
            x2={needleTip.x}
            y2={needleTip.y}
            stroke="#ef4444"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <polygon points="252,138 238,132 238,144" fill="#ef4444" />
        </g>
        <circle cx={meterCx} cy={meterCy} r="10" fill="#0f172a" />
        <circle cx={meterCx} cy={meterCy} r="5" fill="#1e293b" stroke="#f8fafc" strokeWidth="1.2" />

        <text x="160" y="166" textAnchor="middle" fontSize="30" fontWeight="700" fill="#ffffff">
          {Math.round(animatedSpeed)}
        </text>
        <text x="160" y="186" textAnchor="middle" fontSize="11" fill="#94a3b8">
          km/h
        </text>
        <text x="160" y="206" textAnchor="middle" fontSize="10" fill="#dbeafe">
          Paid: {paidCount} | Failed: {failedCount} | Total: {totalCount}
        </text>
      </svg>
    </div>
  );
};

export default function LeadPackReportPage() {
  const token = localStorage.getItem("token");
  const decoded = useMemo(() => decodeToken(token), [token]);
  const canView = isAdmin(decoded);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    companyId: "",
    status: "",
  });

  const withAuth = { headers: { Authorization: `Bearer ${token}` } };
  const normalizePurchaseRows = (rows = []) =>
    (Array.isArray(rows) ? rows : [])
      .filter((row) => ["paid", "failed"].includes(String(row?.status || "").toLowerCase()))
      .map((row) => {
        const status = String(row?.status || "").toLowerCase();
        const paidAmount =
          row?.paid_amount_inr !== undefined && row?.paid_amount_inr !== null
            ? Number(row.paid_amount_inr || 0)
            : status === "paid"
            ? Number(row?.order_amount_inr || row?.amount_inr || 0)
            : 0;
        return {
          ...row,
          paid_amount_inr: paidAmount,
        };
      });

  const companyOptions = useMemo(() => {
    const map = new Map();
    purchases.forEach((row) => {
      if (row.icompany_id && row.company_name && !map.has(row.icompany_id)) {
        map.set(row.icompany_id, row.company_name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [purchases]);

  const loadReport = async () => {
    if (!token || !canView) return;
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams();
      if (filters.companyId) query.set("companyId", String(filters.companyId));
      if (filters.status) query.set("status", String(filters.status));
      if (filters.fromDate) query.set("fromDate", filters.fromDate);
      if (filters.toDate) query.set("toDate", filters.toDate);

      const [purchaseRes, walletRes] = await Promise.all([
        axios.get(
          `${ENDPOINTS.LEAD_PACK_REPORT_PURCHASES}${
            query.toString() ? `?${query.toString()}` : ""
          }`,
          withAuth
        ),
        axios.get(ENDPOINTS.LEAD_PACK_REPORT_WALLETS, withAuth),
      ]);

      setPurchases(normalizePurchaseRows(purchaseRes?.data?.data));
      setWallets(Array.isArray(walletRes?.data?.data) ? walletRes.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load lead pack report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, canView]);

  const resetFilters = async () => {
    setFilters({ fromDate: "", toDate: "", companyId: "", status: "" });
    setLoading(true);
    setError("");
    try {
      const [purchaseRes, walletRes] = await Promise.all([
        axios.get(ENDPOINTS.LEAD_PACK_REPORT_PURCHASES, withAuth),
        axios.get(ENDPOINTS.LEAD_PACK_REPORT_WALLETS, withAuth),
      ]);
      setPurchases(normalizePurchaseRows(purchaseRes?.data?.data));
      setWallets(Array.isArray(walletRes?.data?.data) ? walletRes.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset report filters");
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    const paidRows = purchases.filter((p) => String(p.status).toLowerCase() === "paid");
    const totalPurchases = paidRows.length;
    const totalPaidAmount = paidRows.reduce((sum, row) => sum + Number(row.paid_amount_inr || 0), 0);
    const totalCreditsSold = paidRows.reduce((sum, row) => sum + Number(row.pack_leads_count || 0), 0);
    const totalWalletBalance = wallets.reduce((sum, row) => sum + Number(row.ibalance_credits || 0), 0);
    return { totalPurchases, totalPaidAmount, totalCreditsSold, totalWalletBalance };
  }, [purchases, wallets]);

  const statusChartData = useMemo(() => {
    const counts = purchases.reduce(
      (acc, row) => {
        const key = String(row.status || "").toLowerCase();
        if (key === "paid") acc.paid += 1;
        else if (key === "failed") acc.failed += 1;
        return acc;
      },
      { paid: 0, failed: 0 }
    );
    return [
      { name: "Paid", value: counts.paid, key: "paid" },
      { name: "Failed", value: counts.failed, key: "failed" },
    ];
  }, [purchases]);
  const paidCount = Number(statusChartData.find((x) => x.key === "paid")?.value || 0);
  const failedCount = Number(statusChartData.find((x) => x.key === "failed")?.value || 0);
  const totalStatusCount = paidCount + failedCount;
  const successRate = useMemo(() => {
    const total = statusChartData.reduce((sum, x) => sum + Number(x.value || 0), 0);
    const paid = Number(statusChartData.find((x) => x.key === "paid")?.value || 0);
    return total > 0 ? Math.round((paid / total) * 100) : 0;
  }, [statusChartData]);

  const walletChartData = useMemo(() => {
    return wallets
      .slice()
      .sort((a, b) => Number(b.ibalance_credits || 0) - Number(a.ibalance_credits || 0))
      .slice(0, 8)
      .map((row) => ({
        name: row.company_name || `Company ${row.icompany_id}`,
        balance: Number(row.ibalance_credits || 0),
        used: Number(row.itotal_credits_used || 0),
      }));
  }, [wallets]);
  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm text-xs">
        {label ? <div className="font-semibold text-slate-800 mb-1">{label}</div> : null}
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2 text-slate-700">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const purchaseColumns = [
    { header: "Date", width: "130px", render: (row) => new Date(row.dcreated_at).toLocaleString() },
    { header: "Company", width: "110px", render: (row) => row.company_name || "-" },
    { header: "Buyer", width: "100px", render: (row) => row.buyer_name || "-" },
    { header: "Pack", width: "120px", render: (row) => row.pack_name || "-" },
    { header: "Leads", width: "70px", render: (row) => row.pack_leads_count || "-" },
    { header: "Paid Amount", width: "90px", render: (row) => money(row.paid_amount_inr) },
    { header: "Payment Status", width: "100px", render: (row) => row.status || "-" },
    {
      header: "Order ID",
      width: "180px",
      align: "left",
      render: (row) => (
        <span className="block break-all text-xs leading-5" title={row.razorpay_order_id || "-"}>
          {row.razorpay_order_id || "-"}
        </span>
      ),
    },
    {
      header: "Payment ID",
      width: "180px",
      align: "left",
      render: (row) => (
        <span className="block break-all text-xs leading-5" title={row.razorpay_payment_id || "-"}>
          {row.razorpay_payment_id || "-"}
        </span>
      ),
    },
  ];

  const walletColumns = [
    { header: "Company", render: (row) => row.company_name || "-" },
    { header: "Credits Added", render: (row) => row.itotal_credits_added || 0 },
    { header: "Credits Used", render: (row) => row.itotal_credits_used || 0 },
    { header: "Balance", render: (row) => row.ibalance_credits || 0 },
    { header: "Updated At", render: (row) => new Date(row.dupdated_at).toLocaleString() },
  ];

  const {
    currentPage: purchasePage,
    setCurrentPage: setPurchasePage,
    totalPages: purchaseTotalPages,
    paginatedData: purchaseRows,
  } = usePagination(purchases, 10);

  const {
    currentPage: walletPage,
    setCurrentPage: setWalletPage,
    totalPages: walletTotalPages,
    paginatedData: walletRows,
  } = usePagination(wallets, 10);

  if (!canView) {
    return (
      <div className="p-6">
        <CommonBackButton to="/reportpage" title="Lead Pack Report" className="mb-2" titleClassName="text-3xl font-extrabold text-slate-800" />
        <p className="text-red-600 font-medium">Only Admin can access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <CommonBackButton to="/reportpage" title="Lead Pack Report" className="mb-2" titleClassName="text-3xl font-extrabold text-slate-800" />
        <p className="text-sm text-gray-600">
          Purchases, payment status, and company wallet balances.
        </p>
      </div>

      {error && <div className="text-red-600 font-medium">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <div className="text-xs text-gray-500">Total Purchases</div>
          <div className="text-xl font-semibold">{totals.totalPurchases}</div>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <div className="text-xs text-gray-500">Paid Amount</div>
          <div className="text-xl font-semibold">{money(totals.totalPaidAmount)}</div>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <div className="text-xs text-gray-500">Credits Sold</div>
          <div className="text-xl font-semibold">{totals.totalCreditsSold}</div>
        </div>
        <div className="bg-white border rounded-lg p-3">
          <div className="text-xs text-gray-500">Wallet Balance Total</div>
          <div className="text-xl font-semibold">{totals.totalWalletBalance}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 border border-emerald-200 rounded-2xl p-4">
          <h3 className="font-semibold mb-3 text-slate-800">Payment Success Meter</h3>
          <SpeedMeter
            speed={Math.round((successRate / 100) * SPEEDOMETER_MAX)}
            max={SPEEDOMETER_MAX}
            paidCount={paidCount}
            failedCount={failedCount}
            totalCount={totalStatusCount}
          />
        </div>

        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100/60 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-semibold mb-3 text-slate-800">Top Company Wallet Balances</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={walletChartData} margin={{ left: 8, right: 16, top: 8, bottom: 26 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={52}
                />
                <YAxis allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="balance" name="Balance Credits" fill={BAR_COLORS.balance} radius={[8, 8, 0, 0]}>
                  <LabelList dataKey="balance" position="top" />
                </Bar>
                <Bar dataKey="used" name="Used Credits" fill={BAR_COLORS.used} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, fromDate: e.target.value }))}
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, toDate: e.target.value }))}
            className="border rounded px-3 py-2"
          />
          <select
            value={filters.companyId}
            onChange={(e) => setFilters((prev) => ({ ...prev, companyId: e.target.value }))}
            className="border rounded px-3 py-2"
          >
            <option value="">All Companies</option>
            {companyOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="border rounded px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="paid">paid</option>
            <option value="failed">failed</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadReport}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={resetFilters}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Purchase History</h3>
        <CommonTable
          columns={purchaseColumns}
          data={purchaseRows}
          currentPage={purchasePage}
          itemsPerPage={10}
        />
        <Pagination
          currentPage={purchasePage}
          totalPages={purchaseTotalPages}
          setCurrentPage={setPurchasePage}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Company Wallets</h3>
        <CommonTable
          columns={walletColumns}
          data={walletRows}
          currentPage={walletPage}
          itemsPerPage={10}
        />
        <Pagination
          currentPage={walletPage}
          totalPages={walletTotalPages}
          setCurrentPage={setWalletPage}
        />
      </div>
    </div>
  );
}
