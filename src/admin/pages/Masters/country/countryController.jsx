// src/components/useCountryController.js
import { useState, useCallback } from 'react';
import {
  getAllCountry,
  addNewCountry as modelAddNewCountry,
  updateCountry as modelUpdateCountry,
  deleteCountry as modelDeleteCountry
} from './countryModel'; 

const useCountryController = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCountry();
      
      // Handle different response formats
      let countriesData = [];
      if (Array.isArray(data)) {
        countriesData = data;
      } else if (data && Array.isArray(data.data)) {
        countriesData = data.data;
      } else if (data && Array.isArray(data.d)) {
        countriesData = data.d;
      } else if (data && data.success && Array.isArray(data.result)) {
        countriesData = data.result;
      }
      
      setCountries(countriesData);
      return countriesData;
    } catch (err) {
      console.error('Fetch countries error:', err);
      setError(err);
      setCountries([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCountry = async (countryData) => {
    setLoading(true);
    setError(null);
    try {
      const newCountry = await modelAddNewCountry(countryData);
      setCountries(prev => [...prev, newCountry]);
      return newCountry;
    } catch (err) {
      console.error('Create country error:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCountry = async (id, countryData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCountry = await modelUpdateCountry(id, countryData);
      
      if (!updatedCountry) {
        throw new Error('No data returned from update');
      }

      setCountries(prev => prev.map(c => 
        c.iCountry_id === id ? { ...c, ...updatedCountry } : c
      ));
      
      return updatedCountry;
    } catch (err) {
      console.error('Update failed:', {
        error: err.message,
        countryId: id,
        data: countryData
      });
      
      setError({
        message: err.message || 'Failed to update country',
        isNotFound: err.message.includes('not found')
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCountry = async (countryId) => {
    setLoading(true);
    setError(null);
    try {
      await modelDeleteCountry(countryId);
      setCountries(prev => prev.filter(c => c.iCountry_id !== countryId));
      return true;
    } catch (err) {
      console.error('Failed to delete country:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    countries,
    fetchCountries,
    addNewCountry: createCountry, // Alias createCountry as addNewCountry
    updateCountry,
    deleteCountry,
    loading,
    error,
  };
};

export default useCountryController;