import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../../../api/constraints";
import CommonTable from "../../context/TableStructure/CommonTable";
import Pagination from "../../context/Pagination/pagination";
import usePagination from "../../hooks/usePagination";
import CommonBackButton from "../../context/commonbutton/CommonBackButton";

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

const initialForm = {
  cpack_name: "",
  ileads_count: "",
  nbase_amount: "",
  ngst_percent: "",
  boffer_active: false,
  coffer_type: "PERCENT",
  noffer_value: "0",
  bhot: false,
  bfeatured: false,
  coffer_text: "",
  idisplay_order: "0",
  bactive: true,
};

const money = (value) => Number(value || 0).toFixed(2);

export default function LeadPackPage() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const decoded = useMemo(() => decodeToken(token), [token]);
  const canManage = isAdmin(decoded);
  const packType = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("type") === "gst" ? "gst" : "lead";
  }, [location.search]);
  const packLabel = packType === "gst" ? "GST Packs" : "Lead Packs";
  const creditsLabel = packType === "gst" ? "GST Checks" : "Leads";

  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  const sortedPacks = useMemo(
    () =>
      [...packs].sort((a, b) => {
        const orderA = Number(a.idisplay_order ?? 0);
        const orderB = Number(b.idisplay_order ?? 0);
        if (orderA !== orderB) return orderA - orderB;
        return b.ilead_pack_id - a.ilead_pack_id;
      }),
    [packs]
  );

  const itemsPerPage = 10;
  const { currentPage, setCurrentPage, totalPages, paginatedData } = usePagination(
    sortedPacks,
    itemsPerPage
  );

  const withAuth = { headers: { Authorization: `Bearer ${token}` } };

  const loadPacks = async () => {
    if (!token || !canManage) return;
    setLoading(true);
    setError("");
    try {
      const url = `${ENDPOINTS.LEAD_PACKS}?type=${packType}`;
      const res = await axios.get(url, withAuth);
      setPacks(res?.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load lead packs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, canManage, packType]);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowForm(false);
  };

  const fillEditForm = (row) => {
    setEditingId(row.ilead_pack_id);
    setShowForm(true);
    setForm({
      cpack_name: row.cpack_name || "",
      ileads_count: String(row.ileads_count ?? ""),
      nbase_amount: String(row.nbase_amount ?? ""),
      ngst_percent: String(row.ngst_percent ?? ""),
      boffer_active: Boolean(row.boffer_active),
      coffer_type: row.coffer_type || "PERCENT",
      noffer_value: String(row.noffer_value ?? 0),
      bhot: Boolean(row.bhot),
      bfeatured: Boolean(row.bfeatured),
      coffer_text: row.coffer_text || "",
      idisplay_order: String(row.idisplay_order ?? 0),
      bactive: Boolean(row.bactive),
    });
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buildPayload = () => ({
    cpack_name: String(form.cpack_name || "").trim(),
    cpack_type: packType,
    ileads_count: Number(form.ileads_count),
    nbase_amount: Number(form.nbase_amount),
    ngst_percent: Number(form.ngst_percent),
    boffer_active: Boolean(form.boffer_active),
    coffer_type: form.boffer_active ? String(form.coffer_type || "").toUpperCase() : null,
    noffer_value: form.boffer_active ? Number(form.noffer_value || 0) : 0,
    bhot: Boolean(form.bhot),
    bfeatured: Boolean(form.bfeatured),
    coffer_text: String(form.coffer_text || "").trim(),
    idisplay_order: Number(form.idisplay_order || 0),
    bactive: Boolean(form.bactive),
  });

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canManage) return;
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = buildPayload();
      if (editingId) {
        await axios.patch(`${ENDPOINTS.LEAD_PACKS}/${editingId}`, payload, withAuth);
        setMessage("Lead pack updated successfully");
      } else {
        await axios.post(ENDPOINTS.LEAD_PACKS, payload, withAuth);
        setMessage("Lead pack created successfully");
      }
      resetForm();
      await loadPacks();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save lead pack");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (row) => {
    if (!canManage) return;
    setError("");
    setMessage("");
    try {
      await axios.patch(
        `${ENDPOINTS.LEAD_PACKS}/${row.ilead_pack_id}`,
        { bactive: !row.bactive },
        withAuth
      );
      setMessage("Lead pack status updated");
      await loadPacks();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update pack status");
    }
  };

  const columns = [
    { header: "Pack Name", render: (row) => <span className="font-medium">{row.cpack_name}</span> },
    { header: creditsLabel, render: (row) => row.ileads_count },
    { header: "Base Amount", render: (row) => money(row.nbase_amount) },
    { header: "GST %", render: (row) => money(row.ngst_percent) },
    { header: "Final Amount", render: (row) => money(row.nfinal_amount) },
    {
      header: "Discount",
      render: (row) =>
        row.boffer_active
          ? `${row.coffer_type || "-"} ${money(row.noffer_value)}`
          : "-",
    },
    { header: "Order", render: (row) => Number(row.idisplay_order || 0) },
    {
      header: "Tags",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.bhot ? (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
              Hot
            </span>
          ) : null}
          {row.bfeatured ? (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
              Featured
            </span>
          ) : null}
          {!row.bhot && !row.bfeatured ? <span className="text-xs text-gray-500">-</span> : null}
        </div>
      ),
    },
    {
      header: "Offer Text",
      render: (row) => row.coffer_text || "-",
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`font-semibold ${row.bactive ? "text-green-600" : "text-red-600"}`}>
          {row.bactive ? "Active" : "Inactive"}
        </span>
      ),
    },
    { header: "Created By", render: (row) => row.created_by_name || "-" },
    { header: "Updated By", render: (row) => row.updated_by_name || "-" },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fillEditForm(row);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(row);
            }}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            {row.bactive ? "Disable" : "Enable"}
          </button>
        </div>
      ),
    },
  ];

  if (!canManage) {
    return (
      <div className="p-6">
        <CommonBackButton to="/packspage" title={packLabel} className="mb-2" titleClassName="text-3xl font-extrabold text-slate-800" />
        <p className="text-red-600 font-medium">Only Admin can access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CommonBackButton to="/packspage" title={packLabel} className="mb-0" titleClassName="text-3xl font-extrabold text-slate-800" />
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm(initialForm);
            setShowForm(true);
          }}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 self-start sm:self-auto"
        >
          + Add Pack
        </button>
      </div>

      {error && <div className="mb-3 text-red-600 font-medium">{error}</div>}
      {message && <div className="mb-3 text-green-600 font-medium">{message}</div>}

      {showForm && (
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={resetForm}
      >
      <form onSubmit={submitForm} className="w-full max-w-4xl bg-white border rounded-xl p-6 mb-0" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-5 text-2xl font-bold text-gray-900">
          {editingId ? "Edit Pack" : "Create Pack"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="cpack_name"
            value={form.cpack_name}
            onChange={handleInput}
            placeholder="Pack Name"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="ileads_count"
            value={form.ileads_count}
            onChange={handleInput}
            placeholder={creditsLabel}
            min="1"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="nbase_amount"
            value={form.nbase_amount}
            onChange={handleInput}
            placeholder="Base Amount"
            min="1"
            step="0.01"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="ngst_percent"
            value={form.ngst_percent}
            onChange={handleInput}
            placeholder="GST %"
            min="0"
            step="0.01"
            className="border rounded px-3 py-2"
            required
          />
          <label className="flex items-center gap-2 border rounded px-3 py-2">
            <input
              type="checkbox"
              name="boffer_active"
              checked={form.boffer_active}
              onChange={handleInput}
            />
            Offer Active
          </label>
          <select
            name="coffer_type"
            value={form.coffer_type}
            onChange={handleInput}
            className="border rounded px-3 py-2"
            disabled={!form.boffer_active}
          >
            <option value="PERCENT">Percent</option>
            <option value="FLAT">Flat</option>
          </select>
          <input
            type="number"
            name="noffer_value"
            value={form.noffer_value}
            onChange={handleInput}
            placeholder={form.coffer_type === "FLAT" ? "Offer Value (₹)" : "Offer Value (%)"}
            min="0"
            step="0.01"
            className="border rounded px-3 py-2"
            disabled={!form.boffer_active}
          />
          <input
            type="number"
            name="idisplay_order"
            value={form.idisplay_order}
            onChange={handleInput}
            placeholder="Display Order"
            min="0"
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            name="coffer_text"
            value={form.coffer_text}
            onChange={handleInput}
            placeholder="Offer Text (optional)"
            maxLength={255}
            className="border rounded px-3 py-2 md:col-span-2"
          />
          <label className="flex items-center gap-2 border rounded px-3 py-2">
            <input
              type="checkbox"
              name="bhot"
              checked={form.bhot}
              onChange={handleInput}
            />
            Hot
          </label>
          <label className="flex items-center gap-2 border rounded px-3 py-2">
            <input
              type="checkbox"
              name="bfeatured"
              checked={form.bfeatured}
              onChange={handleInput}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 border rounded px-3 py-2">
            <input
              type="checkbox"
              name="bactive"
              checked={form.bactive}
              onChange={handleInput}
            />
            Active
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2 flex-wrap">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {submitting ? "Saving..." : editingId ? "Update Pack" : "Create Pack"}
          </button>
        </div>
      </form>
      </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <>
          <CommonTable
            columns={columns}
            data={paginatedData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
