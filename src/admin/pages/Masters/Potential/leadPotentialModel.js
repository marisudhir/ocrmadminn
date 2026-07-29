import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead potential
export const getAllLeadPotential = async () => {
  const res = await ApiHelper.getAll(ENDPOINTS.LEAD_POTENTIAL);
  return res.data; 
};

// to add a new lead potential
export const addNewLeadPotential = async (data) => {
  const payload = {
    clead_name: data.clead_name,
    icompany_id: data.icompany_id,
    bactive: true,
    createdBy: data.updatedBy , // Backend expects createdBy
    // updatedBy: data.updatedBy 
  };
  return await ApiHelper.create(payload, ENDPOINTS.LEAD_POTENTIAL);
};

// leadPotentialModel.js - Update the updatePotential function
export const updatePotential = async (id, data) => {
  try {
    if(!id || !data?.clead_name){
      throw new Error("Invalid Id or Missing potential name")
    }

    // Match exactly what your backend expects from the model
    const payload = {
      clead_name: data.clead_name,
      icompany_id: data.icompany_id,
      // bactive: true,
      // dupdated_dt: new Date().toISOString(),
      // updatedBy:  // Hardcode this for now to test
    };
    
    const res = await ApiHelper.updateHelper(id, ENDPOINTS.LEAD_POTENTIAL, payload);
    return res.data;
  } catch (error) {
    console.error(" Error updating lead potential:", error.response?.data || error.message);
    throw error;
  }
};
// to delete (soft delete) lead potential
export const deletePotentialStatus = async (id) => {
  try {
    if (!id) {
      throw new Error("Invalid ID");
    }
    
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    
    if (isNaN(numericId) || numericId <= 0) {
      throw new Error(`Invalid ID format: ${id}`);
    }

    const res = await ApiHelper.deActive(numericId, ENDPOINTS.LEAD_POTENTIAL); 
    return res.data;
  } catch (error) {
    console.error("Error deleting lead potential:", error);
    throw error;
  }
};