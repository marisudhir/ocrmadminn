import { useState, useEffect } from "react";
import * as moduleModel from "../Module/module_mode";

export function moduleController() {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(null);

  async function fetchModules() {
    try {
      setLoading(true);
      const data = await moduleModel.getALlModules();
      setModules(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function addNewModule(requestData) {
    try {
      await moduleModel.addNewModule(requestData);
      await fetchModules();
    } catch (e) {
      setError(e.message);
    }
  }

  async function updateModule(requestData) {
    try {
      const { id, ...body } = requestData;
      await moduleModel.editModule(id, body);
      await fetchModules();
    } catch (e) {
      setError(e.message);
    }
  }

  async function toggleModuleStatus(id, currentStatus) {
  try {
    setLoading(true);
    await moduleModel.changeModuleStatus(id, { status: !currentStatus });
    await fetchModules();
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    fetchModules();
  }, []);

  return {
    modules,
    error,
    loading,
    addNewModule,
    updateModule,
    fetchModules,
    toggleModuleStatus
  };
}

