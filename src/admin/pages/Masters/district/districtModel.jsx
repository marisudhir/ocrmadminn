import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// stateModel.js
export const getAllDistrict = async () => {
  try {
    const response = await ApiHelper.getAll(ENDPOINTS.DISTRICT);
    return response.data.data || [];
    
  } catch (error) {
    console.error("District API Error:", error);
    throw error;
  }
};
export const addNewDistrict = async (data) => {
  try {
    const payload = {
      iState_id: data.iState_id,
      cDistrict_name: data.cDistrict_name,
      bactive: true
    };
    const response = await ApiHelper.create(payload, ENDPOINTS.DISTRICT);
    return response.data;
  } catch (error) {
    console.error("Error creating state:", error);
    throw error;
  }
};

export const updateDistrict = async (id, districtData) => {
  try {
    const payload = {
      cDistrict_name : districtData.cDistrict_name
    };
    const response = await ApiHelper.update(id, ENDPOINTS.DISTRICT, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating district:", error);
    throw error;
  }
};

export const deleteDistrict = async (id) => {
  try {
    const response = await ApiHelper.deActive(id, ENDPOINTS.DISTRICT_ID);
    return response;
  } catch (error) {
    console.error("Error deactivating district:", error);
    throw error;
  }
};