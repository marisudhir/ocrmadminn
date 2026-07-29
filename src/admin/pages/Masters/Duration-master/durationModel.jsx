import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// GET ALL
export const getAllDuration = async () => {
  const res = await ApiHelper.getAll(ENDPOINTS.PLAN_DURATION);
  return res.data?.data || []; 
};

// CREATE
export const addNewDuartion = async (data) => {
  try {
    const payload = {
      duration_in_months: data.duration_in_months,
      bactive: true,
    };

    const res = await ApiHelper.create(payload, ENDPOINTS.PLAN_DURATION);
    return res.data?.data;
  } catch (error) {
    console.error("Error Creating plan Duration", error);
    throw error;
  }
};

// UPDATE
export const updateDuration = async (id, data) => {
  try {
    const payload = { duration_in_months: data.duration_in_months };

    const res = await ApiHelper.update(id, ENDPOINTS.PLAN_DURATION, payload);
    return res.data?.data;
  } catch (error) {
    console.error("Update duration error:", error);
    throw error;
  }
};

// DEACTIVATE
export const deleteDuration = async (id) => {
  try {
    const res = await ApiHelper.deactive(id, ENDPOINTS.PLAN_DURATION);
    return res.data?.data; 
  } catch (error) {
    console.error("Delete duration error:", error);
    throw error;
  }
};
