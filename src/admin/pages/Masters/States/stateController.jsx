import { useState, useCallback } from 'react';
import {
  getAllState,
  addNewState,
  updateState as modelUpdateState,
  deleteState as modelDeleteState
} from './stateModel';

const useStateController = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStates = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await getAllState();    
    if (data.length === 0) {
      console.warn('No states found in response');
      // Optional: Set a special empty state message
      setError({ 
        message: 'No states available', 
        isEmpty: true 
      });
    }
    
    setStates(data);
  } catch (err) {
    console.error('Fetch states error:', err);
    setError(err);
    setStates([]);
  } finally {
    setLoading(false);
  }
}, []);

  const createState = async (stateData) => {
    setLoading(true);
    setError(null);
    try {
      const newState = await addNewState(stateData);
      setStates(prev => [...prev, newState]);
      return true;
    } catch (err) {
      console.error('Create state error:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // In stateController.js
const updateState = async (stateData) => {  // Accept single object
  setLoading(true);
  setError(null);
  try {
    const updatedState = await modelUpdateState(stateData.iState_id, stateData);
    setStates(prev => prev.map(s => 
      s.iState_id === stateData.iState_id ? { ...s, ...updatedState } : s
    ));
    return true;
  } catch (err) {
    console.error('Update state error:', err);
    setError(err);
    return false;
  } finally {
    setLoading(false);
  }
};
  const deleteState = async (stateId) => {
    setLoading(true);
    setError(null);
    try {
      await modelDeleteState(stateId);
      setStates(prev => prev.filter(s => s.iState_id !== stateId));
      return true;
    } catch (err) {
      console.error('Delete state error:', err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    states,
    loading,
    error,
    fetchStates,
    createState,
    updateState,
    deleteState
  };
};

export default useStateController;