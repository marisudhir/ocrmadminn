  // leadPotentialController.js
  import { useEffect, useState } from 'react';
  import * as leadPotentialModel from './leadPotentialModel';

  export const useLeadPotentialController = () => {  // Make sure you have 'export' here
    const [leadPotential, setLeadPotential] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch all lead potentials
    const fetchLeadPotential = async () => {
      setLoading(true);
      try {
        const data = await leadPotentialModel.getAllLeadPotential();
        setLeadPotential(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch lead potential:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    // Create a new lead potential
    const createLeadPotential = async (formData) => {
      setLoading(true);
      try {
        await leadPotentialModel.addNewLeadPotential(formData);
        await fetchLeadPotential();
        setError(null);
        return true;
      } catch (err) {
        console.error('Failed to create lead potential:', err);
        setError(err.message || 'Could not create lead potential');
        return false;
      } finally {
        setLoading(false);
      }
    };

    // Update lead potential
    const updateLeadPotential = async (id, formData) => {
      setLoading(true);
      try {
        await leadPotentialModel.updatePotential(id, formData);
        await fetchLeadPotential();
        setError(null);
        return true;
      } catch (err) {
        console.error('Failed to update lead potential:', err);
        setError(err.message || 'Could not update lead potential');
        return false;
      } finally {
        setLoading(false);
      }
    };

    // Delete lead potential (soft delete)
    const deletePotential = async (id) => {
      setLoading(true);
      try {
        await leadPotentialModel.deletePotentialStatus(id);
        await fetchLeadPotential();
        setError(null);
        return true;
      } catch (err) {
        console.error('Failed to delete lead potential:', err);
        setError(err.message || 'Could not delete lead potential');
        return false;
      } finally {
        setLoading(false);
      }
    };

    return {
      leadPotential,
      createLeadPotential,
      fetchLeadPotential, 
      updateLeadPotential,
      deletePotential,
      error,
      loading,
    };
  };

  // Make sure this is the only export or it's properly named
  export default useLeadPotentialController; // If you're using default export