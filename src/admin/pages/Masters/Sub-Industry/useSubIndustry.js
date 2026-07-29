import { useEffect, useState, useCallback } from 'react';
import * as subIndustryModel from './subIndustryModel';

export const useSubIndustry = (companyId) => {
  const [subIndustry, setSubIndustry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubIndustry = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const res = await subIndustryModel.getAllSubIndustry();
      const rawData = Array.isArray(res) ? res : (res?.data || []);
      const filteredData = rawData.filter(item => 
        Number(item.indsutry?.icompany_id) === Number(companyId) && item.bactive === true
      );
      
      setSubIndustry(filteredData);
    } catch (err) {
      console.error('Failed to fetch sub industry:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const createSubIndustry = async (formData) => {
    try {
      await subIndustryModel.addNewSubIndustry(formData);
      await fetchSubIndustry();
      return true;
    } catch (err) { return false; }
  };

  const updateSubIndustry = async (formData) => {
    try {
      await subIndustryModel.editSubIndustryData(formData);
      await fetchSubIndustry();
      return true;
    } catch (err) { return false; }
  };

  const deleteSubIndustry = async (id, isActive) => {
    try {
      await subIndustryModel.deactivateSubIndustry(id, isActive);
      await fetchSubIndustry();
      return true;
    } catch (err) { return false; }
  };

  useEffect(() => {
    fetchSubIndustry();
  }, [fetchSubIndustry]);

  return { subIndustry, loading, error, fetchSubIndustry, createSubIndustry, updateSubIndustry, deleteSubIndustry };
};