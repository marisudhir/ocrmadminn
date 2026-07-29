

// models/UserModel.js
import * as ApiHelper from '../../api/ApiHelper';
import { ENDPOINTS } from '../../api/ApiConstant';


// to get all the dashobard data.
export const getDasgboardData = async (id) => {
  const res = await ApiHelper.getById(id,ENDPOINTS.ADMIN_DASHBOARD);
  return res.data; 
};

export const getActiveUsers = async () => {
  const res = await ApiHelper.getAll(ENDPOINTS.SESSION_ACTIVE_USERS);
  return res.data;
};

export const logoutCurrentUserSessions = async () => {
  const res = await ApiHelper.create({}, ENDPOINTS.SESSION_LOGOUT);
  return res.data;
};


