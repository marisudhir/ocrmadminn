import { useState, useEffect } from "react";
import * as attributeModel from "../Attributes/attributesModel";

export function attributeController() {
  const [attributes, setAttributes] = useState([]);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); 

  async function fetchAttributes() {
    try {
      setLoading(true);
      const data = await attributeModel.getAllAttributes();
      
      // Data should now be the direct array of attributes
      if (Array.isArray(data)) {
        setAttributes(data);
      } else {
        console.error("Expected array but got:", data);
        setAttributes([]);
      }
    } catch (e) {
      setError(e.message);
      console.error("Error in fetchAttributes:", e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchModules() {
    try {
      const data = await attributeModel.getAllModules();
      
      if (Array.isArray(data)) {
        setModules(data);
      } else {
        console.error("Expected modules array but got:", data);
        setModules([]);
      }
    } catch (e) {
      console.error("Error fetching modules:", e.message);
    }
  }

  async function addNewAttribute(requestData) {
    try {
      await attributeModel.addNewAttribute(requestData);
      setSuccessMessage("Attribute created successfully!"); 
      await fetchAttributes(); 
    } catch (e) {
      setError(e.message);
    }
  }

  async function updateAttribute(requestData) {
    try {
      const { id, ...body } = requestData;
      await attributeModel.editAttribute(id, body);
      setSuccessMessage("Attribute Updated successfully!"); 
      await fetchAttributes(); 
    } catch (e) {
      setError(e.message);
    }
  }

  async function deactivateAttribute(id) {
    try {
      await attributeModel.deactivateAttribute(id);
      setSuccessMessage("Attribute Deleted successfully!"); 
      await fetchAttributes(); 
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    fetchAttributes();
    fetchModules();
  }, []);

  return {
    attributes,
    modules,
    error,
    loading,
    addNewAttribute,
    updateAttribute,
    deactivateAttribute,
    fetchAttributes
  };
}