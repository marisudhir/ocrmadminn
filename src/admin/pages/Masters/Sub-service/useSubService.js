import { useReducer, useCallback } from 'react';
import * as subServiceModel from './subServiceModel';

const initialState = {
  subService: [],
  loading: false,
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };

    case 'FETCH_SUCCESS':
      return { ...state, loading: false, subService: action.payload };

    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };

    case 'ADD_SUCCESS':
      return { ...state, subService: [action.payload, ...state.subService] };

    case 'UPDATE_SUCCESS':
      return {
        ...state,
        subService: state.subService.map(item =>
          item.isubservice_id === action.payload.isubservice_id
            ? action.payload
            : item
        )
      };

    case 'RESET_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

export const useSubService = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // CREATE 
  const createLeadSubService = useCallback(async (formData) => {
    try {
      const created = await subServiceModel.addNewLeadSubService(formData);
      if (created) {
        dispatch({ type: 'ADD_SUCCESS', payload: created });
      }
      return true;
    } catch (e) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: e?.message || 'Could not create'
      });
      return false;
    }
  }, []);

  // FETCH
  const fetchLeadSubService = useCallback(async (companyId) => {
    if (!companyId && companyId !== 0) return;

    dispatch({ type: 'FETCH_START' });
    try {
      const res = await subServiceModel.getAllLeadSubService(companyId);
      const rows = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: rows
      });
    } catch (e) {
      const status = e?.response?.status;
      const message =
        e?.response?.data?.message || e?.message || 'Failed to fetch';

      if (
        status === 404 &&
        typeof message === 'string' &&
        message.toLowerCase().includes('no sub-services found')
      ) {
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: []
        });
        return;
      }

      dispatch({
        type: 'FETCH_FAILURE',
        payload: message
      });
    }
  }, []);

  // UPDATE
  const updateLeadSubService = useCallback(async (id, formData) => {
    try {
      const updated = await subServiceModel.updateLeadSubService(id, formData);
      if (updated) {
        dispatch({ type: 'UPDATE_SUCCESS', payload: updated });
      }
      return true;
    } catch (e) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: e?.message || 'Could not update'
      });
      return false;
    }
  }, []);

  
 // DELETE (Soft Delete)
 const deleteLeadSubService = useCallback(async (id) => {
  try {
    await subServiceModel.deactivateLeadSubService(id);
      
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: state.subService.filter((item) => item.isubservice_id !== id),
      });
      
      return true;
    } catch (e) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: e?.message || 'Could not delete'
      });
      return false;
    }
 }, [state.subService]);


  const resetError = useCallback(() => {
    dispatch({ type: 'RESET_ERROR' });
  }, []);

  return {
    ...state,
    fetchLeadSubService,
    createLeadSubService,
    updateLeadSubService,
    deleteLeadSubService,
    resetError
  };
};
