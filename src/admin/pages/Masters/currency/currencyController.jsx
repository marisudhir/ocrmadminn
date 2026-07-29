import { useState, useCallback } from 'react';
import {
  getAllCurrency,
  addNewCurrency,
  updateCurrency as modelUpdateCurrency,
  deleteCurrency as modelDeleteCurrency
} from './currencyModel';
const useCurrencyController = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchCurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCurrency({adminSide:true});
      setCurrencies(data);
    } catch (err) {
      console.error('Fetch currencies error:', err);
      setError(err);
      setCurrencies([]);
    } finally {
      setLoading(false);
    }
  }, []);
  const createCurrency = async (currencyData) => {
    setLoading(true);
    setError(null);
    try {
      const newCurrency = await addNewCurrency(currencyData);
      setCurrencies(prev => [...prev, newCurrency]);
      return true;
    } catch (err) {
      console.error('Create currency error:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const updateCurrency = async (currencyData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCurrency = await modelUpdateCurrency(currencyData.icurrency_id, currencyData);
      setCurrencies(prev => prev.map(c =>
        c.icurrency_id === currencyData.icurrency_id ? { ...c, ...updatedCurrency } : c
      ));
      return true;
    } catch (err) {
      console.error('Update currency error:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const deleteCurrency = async (currencyId) => {
    setLoading(true);
    setError(null);
    try {
      await modelDeleteCurrency(currencyId);
      
      setCurrencies(prev => prev.map(c =>
        c.icurrency_id === currencyId ? { ...c, bactive: false } : c
      ));
      return true;
    } catch (err) {
      console.error('Delete currency error:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    currencies,
    loading,
    error,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency
  };
};
export default useCurrencyController;