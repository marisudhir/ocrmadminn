import { useState } from "react";
import * as proposalSentModeModel from "./proposalSentModeModel";

export const useProposalSentMode = () => {
  const [proposalSentMode, setProposalSentMode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchProposalSentMode = async () => {
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await proposalSentModeModel.getAllProposalSentMode();
            if (result.data && result.data.data) {
        setProposalSentMode(result.data.data);
      } else if (result.data) {
        setProposalSentMode(result.data);
      } else {
        setProposalSentMode(result);
      }
    } catch (error) {
      console.error("Error fetching proposal sent mode:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Other functions remain the same...
  const updateProposalSentMode = async (proposalData, id) => {
    setLoading(true);
    try {
      const data = await proposalSentModeModel.editProposalSentMode(id, proposalData);
      
      if (data.status === 200) {
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.error("Error updating proposal sent mode:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addProposalSentMode = async (proposalData) => {
    setLoading(true);
    try {
      const data = await proposalSentModeModel.createProposalSentMode(proposalData);
      
      if (data.status === 201) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error creating proposal sent mode:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProposalSentMode,
    addProposalSentMode,
    updateProposalSentMode,
    proposalSentMode,
    loading,
    error
  };
};