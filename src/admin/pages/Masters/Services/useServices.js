import { useState } from 'react';
import * as leadServiceModel from './leadServiceModel';
import { getCompanyIdFromToken, getUserIdFromToken } from '../../../utils/tokenUtils';

export const useServices = () => {
  const [leadServices, setLeadServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);

  // Fetch ALL lead services
  const fetchLeadServices = async (companyId = null) => {
    setLoading(true);
    setError(null);
    setCurrentCompanyId(companyId);
    
    try {
      // Use getAllLeadServices instead of getAllLeadServicesByCompanyId
      const data = await leadServiceModel.getAllLeadServices();
      setLeadServices(data || []);
    } catch (err) {
      console.error('Failed to fetch lead services:', err);
      setError(err.message || 'Something went wrong');
      setLeadServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new lead service
  const createLeadServices = async (formData) => {
    setError(null);
    
    try {
      // Get user ID from token
      const userId = getUserIdFromToken();
      
      if (!userId) {
        throw new Error('User ID not found in token');
      }

      const companyId = formData.icompany_id;
      
      if (!companyId) {
        throw new Error('Company ID is required');
      }

      const dataWithCompanyId = {
        ...formData,
        icompany_id: companyId,
        created_by: userId,
        dcreated_dt: new Date().toISOString()
      };
      await leadServiceModel.addNewLeadService(dataWithCompanyId);
      await fetchLeadServices(currentCompanyId);
      
      return true;
    } catch (err) {
      console.error('Failed to create lead services:', err);
      setError(err.message || 'Could not create lead service');
      return false;
    }
  };

  // Update an existing lead service
  const updateLeadService = async (serviceId, formData) => {
    setError(null);
    
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User ID not found in token');
      }

      const updateData = {
        ...formData,
        updated_by: userId,
        dupdated_dt: new Date().toISOString()
      };
      await leadServiceModel.updateLeadService(serviceId, updateData);
      
      // Refresh the list - fetch ALL services again
      await fetchLeadServices(currentCompanyId);
      
      return true;
    } catch (err) {
      console.error('Failed to update lead service:', err);
      setError(err.message || 'Could not update lead service');
      return false;
    }
  };

  // Delete (soft delete) a lead service
  const deleteLeadService = async (serviceId) => {
    setError(null);
    
    try {
      await leadServiceModel.deleteLeadService(serviceId);
      // Refresh the list with current company filter
      await fetchLeadServices(currentCompanyId);
      
      return true;
    } catch (err) {
      console.error('Failed to delete lead service:', err);
      setError(err.message || 'Could not delete lead service');
      return false;
    }
  };

  return {
    leadServices,
    loading,
    createLeadServices,
    updateLeadService,
    deleteLeadService,
    fetchLeadServices,
    error,
    currentCompanyId
  };
};