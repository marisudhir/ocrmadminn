import React, { useState, useEffect } from "react";
import useDurationController from "../Masters/Duration-master/durationController";

export default function SubscriptionForm({ onSubmit, initialData, currencyList, onCancel }) {
  const { durations, fetchDuration } = useDurationController();

  const [form, setForm] = useState({
    planName: "",
    maxUserCount: "",
    price: "",
    currencyId: "",
    durationId: "",
    storageLimit: 0
  });

  useEffect(() => {
    fetchDuration();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        planName: initialData.planName ?? "",
        maxUserCount: initialData.maxUserCount ?? "",
        price: initialData.price ?? "",
        currencyId: initialData.currencyId ? String(initialData.currencyId) : "",
        durationId: initialData.durationId ? String(initialData.durationId) : "",
        storageLimit: initialData.storageLimit ?? 0,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      maxUserCount: Number(form.maxUserCount),
      price: Number(form.price),
      currencyId: Number(form.currencyId),
      durationId: Number(form.durationId)
    });
  };

  // Helper component for labels with star
  const Label = ({ text }) => (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {text} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <div className="flex justify-start"> 
      <form 
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 w-full max-w-2xl" 
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-2">
          {initialData ? "Edit Subscription Plan" : "Create New Subscription"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          
          {/* PLAN NAME */}
          <div className="flex flex-col">
            <Label text="Plan Name" />
            <input
              name="planName"
              type="text"
              value={form.planName}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* MAX USERS */}
          <div className="flex flex-col">
            <Label text="Max Users" />
            <input
              name="maxUserCount"
              type="number"
              value={form.maxUserCount}
              onChange={handleChange}
              placeholder="0"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* PRICE */}
          <div className="flex flex-col">
            <Label text="Price" />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* CURRENCY */}
          <div className="flex flex-col">
            <Label text="Currency" />
            <select
              name="currencyId"
              value={form.currencyId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
              required
            >
              <option value="">Select Currency</option>
              {currencyList.map((c) => (
                <option key={c.icurrency_id} value={String(c.icurrency_id)}>
                  {c.currency_code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* DURATION */}
          <div className="flex flex-col">
            <Label text="Plan Duration" />
            <select
              name="durationId"
              value={form.durationId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
              required
            >
              <option value="">Select Duration</option>
              {durations
                .filter((d) => d.bactive)
                .map((d) => (
                  <option key={d.plan_duration_id} value={String(d.plan_duration_id)}>
                    {d.duration_in_months} Months
                  </option>
                ))}
            </select>
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-3 flex-wrap">
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-5 py-2 rounded transition"
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded transition shadow-sm"
          >
            {initialData ? "Update Plan" : "Save Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}


