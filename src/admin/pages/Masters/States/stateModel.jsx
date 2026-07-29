import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// stateModel.js
export const getAllState = async () => {
  try {
    const response = await ApiHelper.getAll(ENDPOINTS.STATE);
    // Transform data to include both state and country info
    const transformedData = response.data.data.map(state => ({
      iState_id: state.iState_id,
      iCountry_id: state.iCountry_id,
      cState_name: state.cState_name,
      bactive: state.bactive,
      country: {
        iCountry_id: state.iCountry_id,  
        cCountry_name: state.country.cCountry_name
      }
    }));

    return transformedData;
  } catch (error) {
    console.error("State API Error:", error);
    throw error;
  }
};
export const addNewState = async (data) => {
  try {
    const payload = {
      iCountry_id: data.iCountry_id,
      cState_name: data.cState_name,
      bactive: true
    };
    const response = await ApiHelper.create(payload, ENDPOINTS.STATE);
    return response.data;
  } catch (error) {
    console.error("Error creating state:", error);
    throw error;
  }
};

export const updateState = async (id, stateData) => {
  try {
    const payload = {
      cState_name : stateData.cState_name
    };
    const response = await ApiHelper.update(id, ENDPOINTS.STATE, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating state:", error);
    throw error;
  }
};

export const deleteState = async (id) => {
  try {
    const response = await ApiHelper.deActive(id, ENDPOINTS.STATE_ID);
    return response;
  } catch (error) {
    console.error("Error deactivating country:", error);
    throw error;
  }
};