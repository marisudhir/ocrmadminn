import { useReducer, useCallback } from 'react';
import * as subSourceModel from './subSourceModel';

const initialState = {
  subSources: [],
  loading: false,
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START': return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { ...state, loading: false, subSources: action.payload };
    case 'FETCH_FAILURE': return { ...state, loading: false, error: action.payload };
    case 'ADD_SUCCESS': return { ...state, subSources: [action.payload, ...state.subSources] };
    default: return state;
  }
}

export const useSubSource = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchSubSources = useCallback(async (companyId) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await subSourceModel.getAllSubSources(companyId);
      dispatch({ 
        type: 'FETCH_SUCCESS', 
        payload: Array.isArray(res.data) ? res.data : [] 
      });
    } catch (e) {
      dispatch({ type: 'FETCH_FAILURE', payload: e?.message || 'Failed to fetch' });
    }
  }, []);

  const createSubSource = useCallback(async (formData) => {
    try {
      await subSourceModel.addNewSubSource(formData);
      await fetchSubSources(formData.icompany_id); 
      return true;
    } catch (e) {
      console.error("Hook Error:", e);
      return false;
    }
  }, [fetchSubSources]);

const updateSubSource = useCallback(async (formData) => {
  try {
    await subSourceModel.editSubSourceData(formData);
    await fetchSubSources(formData.icompany_id); 
    return true;
  } catch (e) {
    console.error("Update Error:", e);
    return false;
  }
}, [fetchSubSources]);

  const deleteSubSource = useCallback(async (id, currentCompanyId) => {
    if (!window.confirm("Are you sure you want to deactivate this sub-source?")) return;
    try {
      await subSourceModel.deactivateSubSource(id);
      await fetchSubSources(currentCompanyId);
      return true;
    } catch (e) {
      return false;
    }
  }, [fetchSubSources]);

  return { ...state, fetchSubSources, createSubSource, updateSubSource, deleteSubSource };
};