import { useEffect, useState } from 'react';
import * as leadSourceModel from './leadSourceModel';

export const useLeadSourceController = () => {
  const [leadSource, setLeadSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to extract the most descriptive error message from the API response
  const getErrorMessage = (err) => {
    return (
        err.response?.data?.message || // Common structure for backend error messages
        err.response?.data?.error ||   // Another common structure
        err.message ||                 // Standard JavaScript error message (e.g., network error)
        'An unknown error occurred'
    );
  };


  // Fetch all lead sources (only active ones)
  const fetchLeadSource = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await leadSourceModel.getAllLeadSource();
      // Filter only active lead sources
      const activeSources = data.filter(source => source.is_active === true);
      setLeadSource(activeSources);
    } catch (err) {
      console.error('Failed to fetch lead sources:', err);
      setError(getErrorMessage(err)); // Use the helper to capture backend error
    } finally {
      setLoading(false);
    }
  };

  // Create a new lead source
  const createLeadSource = async (formData) => {
    setError(null);
    try {
      await leadSourceModel.addNewLeadSource(formData);
      await fetchLeadSource(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Failed to create lead source:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update an existing lead source
  const updateLeadSource = async (sourceId, formData) => {
    setError(null);
    try {
      await leadSourceModel.updateLeadSource(sourceId, formData);
      await fetchLeadSource(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Failed to update lead source:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete a lead source (soft delete by setting is_active to false)
  const deleteLeadSource = async (sourceId) => {
    setError(null);
    try {
      await leadSourceModel.deleteLeadSource(sourceId);
      await fetchLeadSource(); // Refresh the list
      return { success: true };
    } catch (err) {
      console.error('Failed to delete lead source:', err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear error manually
  const clearError = () => {
    setError(null);
  };

  return {
    leadSource,
    loading,
    error,
    createLeadSource,
    updateLeadSource,
    deleteLeadSource,
    fetchLeadSource,
    clearError,
  };
};