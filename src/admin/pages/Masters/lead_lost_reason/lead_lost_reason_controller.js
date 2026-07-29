import { useState } from "react";
import * as leadLostReasonModel from "./lead_lost_reason_model";

export function useLeadLostReason() {
  const [leadLostReasons, setLeadLostReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);

  // CREATE LEAD LOST REASON - UPDATED
  const createLeadLostReasonController = async (formData) => {
    try {
        setError(null);
        setMessage(null);
        const result = await leadLostReasonModel.createLeadLostReason(formData);

        if (result?.success === false || result?.Message?.includes("Error") || result?.Message?.includes("Failed")) {
            const errorMsg = result?.Message || result?.message || "Failed to create reason";
            setError(errorMsg);
            throw new Error(errorMsg);
        }

        setMessage(result?.Message || result?.message || "Reason created successfully");

        await getLeadLostReasonByCompanyId(currentCompanyId);

        return true;
    } catch (err) {
        console.error("Create error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to create reason";
        setError(errorMsg);
        throw new Error(errorMsg);
    }
  };

  // GET ALL REASONS OR BY COMPANY ID
  const getLeadLostReasonByCompanyId = async (companyId = null) => {
    setCurrentCompanyId(companyId);
    try {
      setLoading(true);
      setError(null);
      const result = await leadLostReasonModel.getLeadLostReasonsByCompanyId(companyId);

      if (result?.success === false) {
        setError(result?.Message || "Failed to load reasons");
        setLeadLostReasons([]);
        return;
      }

      const data = result?.data || result?.body || result || [];
      setLeadLostReasons(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error in controller:', e);
      setError(e.message);
      setLeadLostReasons([]);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE LEAD LOST REASON - UPDATED
  const updateLeadLostReasonController = async (id, formData) => {
      try {
          setError(null);
          const dataToSend = { 
              ...formData, 
              lostReasonId: id 
          };
          
          const result = await leadLostReasonModel.updateLeadLostReason(dataToSend);
          
          if (result?.success === false) {
              setError(result.Message);
              return false;
          }
          return true;
      } catch (err) {
          setError(err.message);
          return false;
      }
  };

  // DELETE LEAD LOST REASON
  const deleteLeadLostReasonController = async (id, targetCompanyId) => {
    try {
        setError(null);
        setMessage(null);
        const result = await leadLostReasonModel.deleteLeadLostReason(id, targetCompanyId);
        setMessage("Reason deleted successfully");
        await getLeadLostReasonByCompanyId(targetCompanyId); 

        return true;
    } catch (e) {
        const errorMsg = e.response?.data?.message || e.message || "Failed to delete";
        setError(errorMsg);
        return false;
    }
};


  return {
    leadLostReasons,
    loading,
    error,
    message,
    getLeadLostReasonByCompanyId,
    createLeadLostReasonController,
    updateLeadLostReasonController,
    deleteLeadLostReasonController,
    currentCompanyId
  };
}