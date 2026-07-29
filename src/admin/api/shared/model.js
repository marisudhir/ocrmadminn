// models/UserModel.js
import * as ApiHelper from '../ApiHelper';
import { ENDPOINTS } from '../ApiConstant';

// to get all the companies.
export const getAllCompanies = async () => {
  const res = await ApiHelper.getAll(ENDPOINTS.COMPANIES);
  return res.data; 
};

export const getAllBussiness = async () => {
  try {
    const res = await ApiHelper.getAll(ENDPOINTS.BUSSINESS_TYPE);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching business types:", error);
    return [];
  }
};
export const getPlan = async () => {
  try {
    const res = await ApiHelper.getAll(ENDPOINTS.PLAN);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching plan types:", error);
    return [];
  }
};
export const getAllCurrencies = async () => {
  try {
    const res = await ApiHelper.getAll(ENDPOINTS.CURRENCY);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching plan types:", error);
    return [];
  }
}

export const  getAllCities  = async ()=>{
  const res = await ApiHelper.getAll(ENDPOINTS.CITY);
  return res.data.cities;
}

export const  getAllRoles  = async ()=>{
  const res = await ApiHelper.getAll(ENDPOINTS.ROLE);
  return res.data;
}

// Get all industries
export const getAllIndustries = async () => {
  try {
    const res = await ApiHelper.getAll(ENDPOINTS.COMPANY_INDUSTRY);
    // Filter only active
    const activeIndustries = res.data?.data?.filter(ind => ind.bactive) || [];
    return activeIndustries;
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
};



