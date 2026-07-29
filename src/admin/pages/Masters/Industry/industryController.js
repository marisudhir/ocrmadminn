import { useState } from 'react';
import * as industryModel from './industryModel';

export const useIndustryController = () => {
  const [industries, setIndustries] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all lead statuses (only active ones)
  const fetchIndustryData = async () => {
    try {
      setError(null);
      const data = await industryModel.getAllIndustry();
      setIndustries(data);
    } catch (err) {
      console.error('Failed to fetch industries:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Something went wrong';
      setError(errorMessage);
      throw err; 
    }
  };

  // Create a new lead status
  const createIndustry = async (formData) => {
    try {
      setError(null);
      await industryModel.addNewIndustry(formData);
      await fetchIndustryData();
      return true;
    } catch (err) {
      console.error('Failed to create industry:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Could not create industry';
      setError(errorMessage);
      throw err; 
    }
  };

  // Update an existing lead status
  const updateIndustry = async (industryId, formData) => {
    try {
      setError(null);
      await industryModel.updateIndustry(industryId, formData);
      await fetchIndustryData();
      return true;
    } catch (err) {
      console.error('Failed to update industry:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Could not update industry';
      setError(errorMessage);
      throw err; 
    }
  };

  // Delete (soft delete) a lead status
  const deleteIndustry = async (industryId, formData) => {
    try {
      setError(null);
      await industryModel.deleteIndustry(industryId, formData);
      await fetchIndustryData();
      return true;
    } catch (err) {
      console.error('Failed to delete industry:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Could not delete industry';
      setError(errorMessage);
      throw new Error(errorMessage); 
    }
  };

  return {
    industries,
    createIndustry,
    updateIndustry,
    deleteIndustry,
    fetchIndustryData,
    error,
  };
};