// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

// to get all the lead status (only active ones)
export const getAllIndustry = async () => {
  const res = await ApiHelper.getAll(ENDPOINTS.INDUSTRIES);
  // Filter only active industries if backend doesn't do it
  return res.data.filter(industry => industry.bactive !== false); 
};

// to add a new lead status
export const addNewIndustry = async (data) => {
  return await ApiHelper.create(data, ENDPOINTS.INDUSTRIES);
};

// to update an existing lead status
export const updateIndustry = async (industryId, data) => {
  const cleanIndustryId = String(industryId).replace(/[^0-9]/g, '');
  return await ApiHelper.update(cleanIndustryId, ENDPOINTS.INDUSTRIES, data);
};

// to delete (soft delete) a lead status
export const deleteIndustry = async (industryId) => {
  // Clean the industryId to ensure it's a proper number/string
  const cleanIndustryId = String(industryId).replace(/[^0-9]/g, '');
  return await ApiHelper.deactive(cleanIndustryId, ENDPOINTS.INDUSTRIES);
};