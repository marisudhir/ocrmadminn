import { useState, useEffect } from "react";

export default function ModuleForm({ onSubmit, module }) {
  const [moduleName, setModuleName] = useState("");

  // whenever "module" changes (Edit button clicked), update the field
  useEffect(() => {
    if (module) {
      setModuleName(module.cmodule_name || "");
    } else {
      setModuleName("");
    }
  }, [module]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!moduleName.trim()) return;

    // send only the name (id is already in module object in parent)
    onSubmit(moduleName);

    // reset only if creating new
    if (!module) {
      setModuleName("");
    }
  };

  return (
    <div className="p-0">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-end gap-2">
        <input
          type="text"
          value={moduleName}
          className="border border-black p-2 rounded min-w-[220px]"
          onChange={(e) => setModuleName(e.target.value)}
          placeholder="Enter module name"
        />
        <button type="submit" className="bg-black rounded text-white p-2">
          {module ? "Update Module" : "Create Module"}
        </button>
        <button className="bg-black rounded m-1 text-white p-2">Cancel</button>
      </form>
    </div>
  );
}
