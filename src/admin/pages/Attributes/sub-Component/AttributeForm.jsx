import { useState, useEffect } from "react";

export default function AttributeForm({ onSubmit, attribute, modules }) {
  const [formData, setFormData] = useState({
    attributeName: "",
    moduleId: ""
  });

  // Reset form when attribute changes (for edit)
  useEffect(() => {
    if (attribute) {
      setFormData({
        attributeName: attribute.cattribute_name || "",
        moduleId: attribute.imodule_id || ""
      });
    } else {
      setFormData({
        attributeName: "",
        moduleId: ""
      });
    }
  }, [attribute]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.attributeName.trim() || !formData.moduleId) {
      alert("Please fill in both attribute name and module");
      return;
    }

    onSubmit(formData);
    
    // Reset only if creating new
    if (!attribute) {
      setFormData({
        attributeName: "",
        moduleId: ""
      });
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attribute Name *
          </label>
          <input
            type="text"
            value={formData.attributeName}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange('attributeName')}
            placeholder="Enter attribute name"
            required
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module *
          </label>
          <select
            value={formData.moduleId}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange('moduleId')}
            required
          >
            <option value="">Select Module</option>
            {modules.map((module) => (
              <option key={module.imodule_id} value={module.imodule_id}>
                {module.cmodule_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            {attribute ? "Update Attribute" : "Create Attribute"}
          </button>
          <button 
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
