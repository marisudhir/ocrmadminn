import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

//to add an new lead subservice.
export const addNewLeadSubService = async (data) => {
  return await ApiHelper.create(data, ENDPOINTS.SUB_SERVICE,);
};

// to get all the lead sub service.
export const getAllLeadSubService = async (companyId) => {
  const res = await ApiHelper.getWithQueryParam(ENDPOINTS.SUB_SERVICE,{companyId});
  return res.data; 
};

//to update  lead subservice.
export const updateLeadSubService = async (subserviceId, data) => {
  return await ApiHelper.update( subserviceId, ENDPOINTS.SUB_SERVICE, data );
};

//to DELETE lead subservice.
export const deactivateLeadSubService = async (id) => {
  return await ApiHelper.patchWithQueryParams( `${ENDPOINTS.SUB_SERVICE}/${id}`, { isActive: "false" } );
};



