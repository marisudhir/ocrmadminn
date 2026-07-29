// leadStatusController.js
import { useEffect, useState } from 'react';
import * as leadStatusModel from './leadStatusModel';

export const useLeadStatusController = () => {
  const [leadStatus, setLeadStatus] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all lead statuses
  const fetchLeadStatus = async () => {
    setLoading(true);
    try {
      const data = await leadStatusModel.getAllLeadStatus();
      setLeadStatus(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch lead status:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Create a new lead status
  const createLeadStatus = async (formData) => {
    setLoading(true);
    try {
      await leadStatusModel.addNewLeadStatus(JSON.stringify(formData));
      await fetchLeadStatus();
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to create lead status:', err);
      setError(err.message || 'Could not create lead status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update lead status
  const updateLeadStatus = async (id, formData) => {
    setLoading(true);
    try {
      await leadStatusModel.updateLeadStatus(id, formData);
      await fetchLeadStatus();
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to update lead status:', err);
      setError(err.message || 'Could not update lead status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete lead status
  const deleteLeadStatus = async (id) => {
    setLoading(true);
    try {
      await leadStatusModel.deleteLeadStatus(id);
      await fetchLeadStatus();
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to delete lead status:', err);
      setError(err.message || 'Could not delete lead status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    leadStatus,
    loading,
    error,
    fetchLeadStatus,
    createLeadStatus,
    updateLeadStatus,
    deleteLeadStatus,
  };
};