import * as ApiHelper from "../../../api/ApiHelper"; 
import { ENDPOINTS } from "../../../api/ApiConstant";

export const getAllSubIndustry = async () => {
  const res = await ApiHelper.getAll(`${ENDPOINTS.SUB_INDUSTRY}/getAllActiveSubIndustries`);
  return res.data;
};

export const addNewSubIndustry = async (data) => {
  const res = await ApiHelper.create(data, `${ENDPOINTS.SUB_INDUSTRY}/`);
  return res.data;
};

export const editSubIndustryData = async (data) => {
  const res = await ApiHelper.editWithReqBody(`${ENDPOINTS.SUB_INDUSTRY}/`, data);
  return res.data;
};


export const deactivateSubIndustry = async (id, isActive) => {
  const queryParams = {
    subindustryId: id,
    isActive: String(isActive) 
  };

  const response = await ApiHelper.deleteWithQueryParams(`${ENDPOINTS.SUB_INDUSTRY}/`, queryParams);
  return response.data;
};

