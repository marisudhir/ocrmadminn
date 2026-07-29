import { useState, useCallback } from 'react';
import {
  getAllCities,
  addNewCities,
  updateCities as modelUpdateCities,
  deleteCities as modelDeleteCities
} from './cityModel.jsx';

const useCitiesController = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCities();      
      if (data.length === 0) {
        console.warn('No Cities found in response');
        setError({ 
          message: 'No Cities available', 
          isEmpty: true 
        });
      }
      
      setCities(data);
    } catch (err) {
      console.error('Fetch cities error:', err);
      setError(err);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCities = async (citiesData) => {
    setLoading(true);
    setError(null);
    try {
      const newCities = await addNewCities(citiesData);
      setCities(prev => [...prev, newCities]);
      return true;
    } catch (err) {
      console.error('Create city error:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCities = async (citiesData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCities = await modelUpdateCities(citiesData.icity_id, citiesData);
      setCities(prev => prev.map(s => 
        s.icity_id === citiesData.icity_id ? { ...s, ...updatedCities } : s
      ));
      return true;
    } catch (err) {
      console.error('Update city error:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCities = async (citiesId) => {
    setLoading(true);
    setError(null);
    try {
      await modelDeleteCities(citiesId);
      setCities(prev => prev.filter(s => s.icity_id !== citiesId));
      return true;
    } catch (err) {
      console.error('Delete cities error:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    cities,
    loading,
    error,
    fetchCities,
    createCities,
    updateCities,
    deleteCities
  };
};

export default useCitiesController;