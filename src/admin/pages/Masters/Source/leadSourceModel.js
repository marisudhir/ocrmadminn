import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

export const companyLeadSrcModel = async () => {
  const endpoint = `${ENDPOINTS.LEAD_SOURCE}company-src`;
  return await ApiHelper.getAll(endpoint);
};

// to get all the lead sources
export const getAllLeadSource = async () => {
  const res = await ApiHelper.getAll(ENDPOINTS.LEAD_SOURCE);
  return res.data; 
};

// to add a new lead source
export const addNewLeadSource = async (data) => {
  return await ApiHelper.create(data, ENDPOINTS.LEAD_SOURCE);
};

// to update a lead source
export const updateLeadSource = async (sourceId, data) => {
  const cleanSourceId = String(sourceId).replace(/[^0-9]/g, '');
  return await ApiHelper.updateHelper(cleanSourceId, ENDPOINTS.LEAD_SOURCE, data);
};

// to delete a lead source (soft delete)
export const deleteLeadSource = async (sourceId) => {
  const cleanSourceId = String(sourceId).replace(/[^0-9]/g, '');
  return await ApiHelper.deActive(cleanSourceId, ENDPOINTS.LEAD_SOURCE);
};