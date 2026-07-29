import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../api/constraints";

const decodeToken = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
};

const isSuperAdmin = (decoded) =>
  String(decoded?.roleType || "").toLowerCase() === "super_admin" ||
  Number(decoded?.role_id) === 1 ||
  Number(decoded?.role_id) === 6;

const getApiErrorMessage = (err, fallback) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.status) return `${fallback} (HTTP ${err.response.status})`;
  if (err?.request) {
    return `Cannot reach API (${ENDPOINTS.BASE_URL_IS}). Check backend server and VITE_API_URL.`;
  }
  return fallback;
};

const RazorpaySettings = () => {
  const token = localStorage.getItem("token");
  const decoded = useMemo(() => decodeToken(token), [token]);
  const canManage = isSuperAdmin(decoded);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    razorpay_enabled: false,
    razorpay_key_id: "",
    razorpay_key_secret: "",
    razorpay_webhook_secret: "",
  });
  const [existingFlags, setExistingFlags] = useState({
    has_razorpay_key_secret: false,
    has_razorpay_webhook_secret: false,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      if (!token || !canManage) return;
      setLoading(true);
      setError("");
      setMessage("");
      try {
        const res = await axios.get(ENDPOINTS.SUPER_ADMIN_RAZORPAY_CONFIG, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res?.data?.data || {};
        setForm((prev) => ({
          ...prev,
          razorpay_enabled: !!data.razorpay_enabled,
          razorpay_key_id: data.razorpay_key_id || "",
          razorpay_key_secret: "",
          razorpay_webhook_secret: "",
        }));
        setExistingFlags({
          has_razorpay_key_secret: !!data.has_razorpay_key_secret,
          has_razorpay_webhook_secret: !!data.has_razorpay_webhook_secret,
        });
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load Razorpay config"));
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [token, canManage]);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token || !canManage) {
      setError("Only Super Admin can manage Razorpay settings.");
      return;
    }

    if (
      form.razorpay_enabled &&
      !form.razorpay_webhook_secret.trim() &&
      !existingFlags.has_razorpay_webhook_secret
    ) {
      setError("Webhook Secret is required when Razorpay is enabled.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        razorpay_enabled: !!form.razorpay_enabled,
        razorpay_key_id: form.razorpay_key_id.trim(),
      };

      if (form.razorpay_key_secret.trim()) {
        payload.razorpay_key_secret = form.razorpay_key_secret.trim();
      }
      if (form.razorpay_webhook_secret.trim()) {
        payload.razorpay_webhook_secret = form.razorpay_webhook_secret.trim();
      }

      const res = await axios.patch(ENDPOINTS.SUPER_ADMIN_RAZORPAY_CONFIG, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res?.data?.data || {};
      setForm((prev) => ({
        ...prev,
        razorpay_enabled: !!data.razorpay_enabled,
        razorpay_key_id: data.razorpay_key_id || "",
        razorpay_key_secret: "",
        razorpay_webhook_secret: "",
      }));
      setExistingFlags({
        has_razorpay_key_secret: !!data.has_razorpay_key_secret,
        has_razorpay_webhook_secret: !!data.has_razorpay_webhook_secret,
      });
      setMessage(res?.data?.message || "Razorpay settings saved successfully");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to save Razorpay settings"));
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!token || !canManage) return;
    setTesting(true);
    setError("");
    setMessage("");
    try {
      const res = await axios.post(
        ENDPOINTS.SUPER_ADMIN_RAZORPAY_CONFIG_TEST,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res?.data?.message || "Razorpay connection test passed.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Razorpay connection test failed."));
    } finally {
      setTesting(false);
    }
  };

  if (!canManage) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Super Admin Razorpay Settings
          </h2>
          <div className="text-sm font-medium text-red-600">
            Only Super Admin can access this page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-700">
          Super Admin Razorpay Settings
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          This config is separate from Company Admin Razorpay config.
        </p>

        {loading && <div className="mb-4 text-sm text-gray-600">Loading...</div>}
        {error && <div className="mb-4 text-sm font-medium text-red-600">{error}</div>}
        {message && <div className="mb-4 text-sm font-medium text-green-600">{message}</div>}

        <form onSubmit={handleSave} className="space-y-5">
        <label className="flex items-center justify-between border rounded-lg px-4 py-3">
          <span className="text-sm font-semibold text-gray-700">Enable Razorpay</span>
          <input
            type="checkbox"
            name="razorpay_enabled"
            checked={form.razorpay_enabled}
            onChange={handleInput}
            className="h-4 w-4"
          />
        </label>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Key ID<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="razorpay_key_id"
            value={form.razorpay_key_id}
            onChange={handleInput}
            required={form.razorpay_enabled}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="rzp_test_xxxxx"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Key Secret
            <span className="text-red-600">{form.razorpay_enabled ? "*" : ""}</span>
          </label>
          <input
            type="password"
            name="razorpay_key_secret"
            value={form.razorpay_key_secret}
            onChange={handleInput}
            className="w-full border rounded-lg px-4 py-2"
            placeholder={
              existingFlags.has_razorpay_key_secret
                ? "Already saved. Leave blank to keep unchanged."
                : "Enter Razorpay key secret"
            }
          />
          {existingFlags.has_razorpay_key_secret && (
            <p className="text-xs text-gray-500 mt-1">A key secret is already configured.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Webhook Secret
            <span className="text-red-600">{form.razorpay_enabled ? "*" : ""}</span>
          </label>
          <input
            type="password"
            name="razorpay_webhook_secret"
            value={form.razorpay_webhook_secret}
            onChange={handleInput}
            required={form.razorpay_enabled && !existingFlags.has_razorpay_webhook_secret}
            className="w-full border rounded-lg px-4 py-2"
            placeholder={
              existingFlags.has_razorpay_webhook_secret
                ? "Already saved. Leave blank to keep unchanged."
                : "Enter webhook secret"
            }
          />
          {existingFlags.has_razorpay_webhook_secret && (
            <p className="text-xs text-gray-500 mt-1">A webhook secret is already configured.</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Razorpay Settings"}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || loading}
            className="flex-1 bg-gray-700 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default RazorpaySettings;
