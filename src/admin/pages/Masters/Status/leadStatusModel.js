// models/leadStatusModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead status.
export const getAllLeadStatus = async () => {
  const res = await ApiHelper.getAll(ENDPOINTS.LEAD_STATUS);
  return res.data; 
};

// to add a new lead status.
export const addNewLeadStatus = async (data) => {
  return await ApiHelper.create(data, ENDPOINTS.LEAD_STATUS);
};

// to update lead status
export const updateLeadStatus = async (id, data) => {
  try {
    if (!id || !data?.clead_name) {
      throw new Error("Invalid ID or missing status name");
    }
    
    const payload = {
      clead_name: data.clead_name,
      bactive: true,
      imodified_by: data.imodified_by, // Default user ID or get from auth
      dmodified_dt: new Date().toISOString(),
      orderId: data.orderId || 0,
      icompany_id: data.icompany_id
    };

const res = await ApiHelper.updateHelper(id, ENDPOINTS.LEAD_STATUS, payload);
    return res.data;
  } catch (error) {
    console.error("Error updating lead status:", error);
    throw error;
  }
};

// to delete (soft delete) lead status
export const deleteLeadStatus = async (id) => {
  try {
    if (!id) {
      throw new Error("Invalid ID");
    }
    
    const res = await ApiHelper.deActive(id, ENDPOINTS.LEAD_STATUS); 
    return res.data;
  } catch (error) {
    console.error("Error deleting lead status:", error);
    throw error;
  }
};
