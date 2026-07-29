import * as ApiHelper from "../../../api/ApiHelper";
import { ENDPOINTS } from "../../../api/ApiConstant";

// Fetches all active sub-sources, optionally filtered by companyId
export const getAllSubSources = async (companyId) => {
  const endpoint = `${ENDPOINTS.SUB_SOURCE}/getAllActiveSubSrc`;
  
  if (companyId) {
    const response = await ApiHelper.getWithQueryParam(endpoint, { companyId });
    return response.data;
  }
  
  const response = await ApiHelper.getAll(endpoint);
  return response.data;
};

// Creates  new sub-source

export const addNewSubSource = async (data) => {
  const response = await ApiHelper.create(data, `${ENDPOINTS.SUB_SOURCE}/createSubSrc`);
  return response.data;
};

// Updates - sub-source
 
export const editSubSourceData = async (data) => {
  const response = await ApiHelper.editWithReqBody(`${ENDPOINTS.SUB_SOURCE}/editSubSrc`, data);
  return response.data;
};

// Deactivates - sub-source by ID (Path Parameter)
 
export const deactivateSubSource = async (id) => {
  const response = await ApiHelper.deactive(id, `${ENDPOINTS.SUB_SOURCE}/changeSubSrcSts`);
  return response.data;
};



// import axios from "axios";
// import { ENDPOINTS } from "../../../api/ApiConstant";

// const getAuthHeaders = () => ({
//   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
// });

// export const getAllSubSources = async (companyId) => {
//   const url = companyId 
//     ? `${ENDPOINTS.SUB_SOURCE}/getAllActiveSubSrc?companyId=${companyId}` 
//     : `${ENDPOINTS.SUB_SOURCE}/getAllActiveSubSrc`;

//   const response = await axios.get(url, getAuthHeaders());
//   return response.data; 
// };

// export const addNewSubSource = async (data) => {
//   const response = await axios.post(`${ENDPOINTS.SUB_SOURCE}/createSubSrc`, data, getAuthHeaders());
//   return response.data;
// };

// export const editSubSourceData = async (data) => {
//   const response = await axios.put(`${ENDPOINTS.SUB_SOURCE}/editSubSrc`, data, getAuthHeaders());
//   return response.data;
// };

// export const deactivateSubSource = async (id) => {
//   const response = await axios.delete(`${ENDPOINTS.SUB_SOURCE}/changeSubSrcSts/${id}`, getAuthHeaders());
//   return response.data;
// };

