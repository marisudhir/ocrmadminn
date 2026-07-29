import { useState } from "react";

export default function ModuleAllocationForm({ onSubmit, moduleAllocationObj }) {
  const [moduleAllocation, setModuleAllocation] = useState({
    subscriptionId: null,
    moduleIds: [],
  });

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      subscriptionId: Number(moduleAllocation.subscriptionId),
      moduleIds: moduleAllocation.moduleIds.map(Number),
    };

    onSubmit(formattedData);
  };

  // Subscription selection
  const handleSubscriptionChange = (e) => {
    setModuleAllocation((prev) => ({
      ...prev,
      subscriptionId: Number(e.target.value),
    }));
  };

  // Checkbox handler
  const handleCheckboxChange = (id) => {
    setModuleAllocation((prev) => ({
      ...prev,
      moduleIds: prev.moduleIds.includes(id)
        ? prev.moduleIds.filter((mid) => mid !== id)
        : [...prev.moduleIds, id],
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-200 rounded-xl shadow-md flex flex-col gap-6 w-full max-w-4xl"
    >
      <h2 className="text-xl font-semibold text-gray-800 text-center">
        Allocate Modules to Subscription
      </h2>

      {/* LEFT - RIGHT layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 ">

        {/* LEFT SIDE - Subscription */}
        <div className="flex flex-col gap-2 w-48">
          <label className="font-medium text-gray-700">Select Subscription</label>
          <select
            name="subscriptionId"
            value={moduleAllocation.subscriptionId || ""}
            onChange={handleSubscriptionChange}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled>
              -- Select Subscription --
            </option>

            {moduleAllocationObj.subscription?.length > 0 ? (
              moduleAllocationObj.subscription.map((subscription) => (
                <option key={subscription.plan_id} value={subscription.plan_id}>
                  {subscription.plan_name}
                </option>
              ))
            ) : (
              <option>No active subscription found</option>
            )}
          </select>
        </div>

        {/* RIGHT SIDE - Modules (Checkbox Grid) */}
        <div className="flex flex-col gap-2 -ml-10">
          <label className="font-medium text-gray-700">Select Modules</label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2 bg-white border rounded-lg">

            {moduleAllocationObj.modules?.length > 0 ? (
              moduleAllocationObj.modules.map((module) => (
                <label
                  key={module.imodule_id}
                  className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded"
                >
                  <input
                    type="checkbox"
                    checked={moduleAllocation.moduleIds.includes(module.imodule_id)}
                    onChange={() => handleCheckboxChange(module.imodule_id)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{module.cmodule_name}</span>
                </label>
              ))
            ) : (
              <p>No active module found</p>
            )}

          </div>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-4">

        <button
          type="button"
          onClick={() =>
            setModuleAllocation({
              subscriptionId: null,
              moduleIds: [],
            })
          }
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          Reset
        </button>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>

        
      </div>
    </form>
  );
}