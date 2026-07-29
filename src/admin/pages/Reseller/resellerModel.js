// models/UserModel.js
import * as ApiHelper from '../../api/ApiHelper';
import { ENDPOINTS } from '../../api/ApiConstant';


// to get all the company data.
export const getAllResellerData = async () => {
  const res = await ApiHelper.getAll(ENDPOINTS.RESELLER);
  return res.data; 
};

//to add an new company.
export const addNewReseller = async (data) => {
  return await ApiHelper.create(data, ENDPOINTS.RESELLER);
};


//to get an company data based on the id.
export const getResellerById = async (id) =>{
  const res = await ApiHelper.getById(id, ENDPOINTS.RESELLERS);
  return res.data;
}


