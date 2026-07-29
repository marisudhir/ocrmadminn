import * as ApiHelper from '../../api/ApiHelper';
import axios from "axios";
import { ENDPOINTS } from '../../api/ApiConstant';
import { getAll } from "../../api/ApiHelper";

// POST: Assign new attribute to user
export const assignAttributeToUser = async (userId, attributeId) => {
  const fullApiUrl = ENDPOINTS.ASSIGN_ATTRIBUTE_USER;
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("Authentication token not found!");
    throw new Error("Missing authentication token.");
  }
  try { 
    const response = await axios.post(
      fullApiUrl,
      { 
        userId: userId,
        attributeId: attributeId
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error(` POST failed for ${fullApiUrl}:`, err);
    throw err;
  }
};

// PUT: Update attribute status
export const updateAttributeStatus = async (iuaId, status) => {
  const fullApiUrl = `${ENDPOINTS.UPDATE_ATTRIBUTE_USER_ID}/${iuaId}/status`;
  const token = localStorage.getItem('token');

  if (!token) {
    console.error("Authentication token not found!");
    throw new Error("Missing authentication token.");
  }

  try {
    const response = await axios.put(
      fullApiUrl,
      { 
        status: status
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error(` PUT failed for ${fullApiUrl}:`, err);
    throw err;
  }
};

// Apply user attribute changes - handles both POST and PUT
export const applyUserAttributeChanges = async (targetUserId, stagedAttributes, existingUserAttributes) => {
  const promises = [];
  const existingAttrMap = new Map();
  existingUserAttributes.forEach(attr => {
    existingAttrMap.set(attr.iattribute_id, attr);
  });

  for (const [attrIdString, isChecked] of Object.entries(stagedAttributes)) {
    const attrId = parseInt(attrIdString);
    const existingAttr = existingAttrMap.get(attrId);
    
    if (existingAttr && existingAttr.iua_id) {
      // Attribute already assigned to user - UPDATE (PUT) if status changed
      if (existingAttr.bactive !== isChecked) {
        promises.push(updateAttributeStatus(existingAttr.iua_id, isChecked));
      }
    } else {
      // Attribute not assigned to user - CREATE (POST) if checked
      if (isChecked) {
        promises.push(assignAttributeToUser(targetUserId, attrId));
      }
    }
  }
  return Promise.all(promises);
};

// GET: All available attributes
export const getAllAttributes = async (companyId) => {
  try {
    let endpoint = ENDPOINTS.GET_ATTRIBUTE;
    if (companyId) {
      endpoint = `${ENDPOINTS.GET_ATTRIBUTE}?companyId=${companyId}`;
    }
    
    const response = await ApiHelper.getAll(endpoint);    
    return response.data.attribuites || [];
  } catch (err) {
    console.error(" GET: Failed to fetch all attributes:", err);
    throw err;
  }
};

// GET: User's assigned attributes
export const getUserAttributes = async (userId) => {
  try {
    const response = await ApiHelper.getById(userId, ENDPOINTS.GET_ATTRIBUTE_USER_ID);
    // Handle different response structures
    if (response.data && response.data.error === "No attribute found for this user ID !") {
      console.warn(`User ${userId} has no assigned attributes.`);
      return [];
    }
    
    if (response.data && Array.isArray(response.data.attributes)) {
      return response.data.attributes;
    }
    
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.warn("Unexpected user attributes response format:", response.data);
    return [];

  } catch (err) {
    const errorMessage = err?.response?.data?.error;
    
    if (errorMessage === "No attribute found for this user ID !") {
      console.warn(`User ${userId} has no assigned attributes.`);
      return [];
    }
    
    console.error("❌ GET: Failed to fetch user attributes:", err);
    throw err;
  }
};

export const changeUserSettingsStatus = async (settingsData) => {
  const res = await ApiHelper.update_patch_no_id(ENDPOINTS.USER_SETTINGS, settingsData);
  return res.data;
}

// to get all the company data.
export const getAllCompantData = async () => {
  // console.info("all company data api called");
  const res = await ApiHelper.getAll(ENDPOINTS.COMPANIES);
    // console.info("all company data api called", res.data);
  return res.data;
};

export const getAuditLogs = async (company_id) => {
  const res = await ApiHelper.getAll(ENDPOINTS.AUDIT_LOGS(company_id));
  return res.data;
};

export const changeSettingStatus = async (data, company_id) => {
  const res = await ApiHelper.update_patch(company_id, ENDPOINTS.COMPANY_SETTINGS, data);
  return res.data;
}

export const changeUserStatus = async (user_id) => {
  const res = await ApiHelper.deActive(user_id, ENDPOINTS.USER);
  return res.data;
};

  //PUT: to edit User details
  export const updateUserDetails = async (userId, data) => {
    let url = ENDPOINTS.USER;
    // remove the extra slash if it exists, This converts "/api/users/" to "/api/users"
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    const res = await ApiHelper.update(userId, url, data);
    return res.data;
  };

  //to add an new company.
  export const addNewCompany = async (data) => {
    return await ApiHelper.create(data, ENDPOINTS.COMPANIES);
  };

  //to add an admin user when the company is created
  export const addAdminUser = async (data) => {
    const res = await ApiHelper.create(data, ENDPOINTS.USER);
    return res.data;
  };

  export const editCompany = async (data, company_id) => {
    // Ensure we have a valid company_id
    let finalCompanyId;
    if (typeof company_id === 'object') {
      finalCompanyId = company_id.iCompany_id;
      console.warn("⚠️ Company ID was passed as object, extracting:", finalCompanyId);
    } else {
      finalCompanyId = company_id;
    }
    
    // Convert to number
    finalCompanyId = parseInt(finalCompanyId);
    
    if (isNaN(finalCompanyId)) {
      console.error("❌ Invalid company ID:", company_id);
      throw new Error("Invalid company ID");
    }
      
    try {
      const response = await ApiHelper.update(finalCompanyId, ENDPOINTS.COMPANIES, data);
      return response;
    } catch (error) {
      console.error("❌ Edit company error:", error);
      throw error;
    }
  };
  //to get an company data based on the id.
  export const getCompanyById = async (id) => {
    const res = await ApiHelper.getById(id, ENDPOINTS.COMPANIES_ID);
    return res.data.result;
  }

  // to get all the user data based on the company id.
  export const getUsersByCompanyId = async (companyId) => {
    try {
      const response = await getAll(ENDPOINTS.USER_TAB(companyId));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //To the storage details based on the company id 
  export const getStorageDetails = async (companyId) => {
    try {
      const response = await ApiHelper.getById(companyId, ENDPOINTS.GET_STORAGE_DETAILS);
      const data = response.data;
      if (data.success) return data.data;
      throw new Error(data.message)
    } catch (e) {
      return e.message
    }
  }
  export const getBussinessType = async () => {
    try {
      const res = await ApiHelper.getAll(ENDPOINTS.BUSSINESS_TYPE);
      const data = res.data;
      if (data.success) return data.data;
      throw new Error(data.message);
    } catch (error) {
      console.error("Failed to fetch business types:", error);
      throw error;
    }
  };

  export const getAllCurrencies = async () => {
    try {
      const response = await ApiHelper.getAll(ENDPOINTS.CURRENCY);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
      throw error;
    }
  };

  // GET: All pricing plans
  export const getAllPricingPlans = async () => {
    try {
      const response = await ApiHelper.getAll(ENDPOINTS.PLAN);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch pricing plans:", error);
      throw error;
    }
  };

    //  SMTP SETTINGS - POST
  export const createSmtpSettings = async (payload) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Missing authentication token");

    const response = await axios.post(
      ENDPOINTS.SMTP_SETTINGS, 
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

  //  SMTP SETTINGS - GET
  export const getSmtpSettingsByCompany = async (companyId) => { 
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Missing authentication token");

    try {
      const response = await axios.get(
      `${ENDPOINTS.SMTP_SETTINGS_BY_COMPANY}?company_id=${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("GET SMTP failed:", err);
      throw err;
    }
  };


  // UPDATE - SMTP SETTINGS
  export const updateSmtpSettings = async (id, payload) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Missing authentication token");

    try {
      const response = await axios.put(
        `${ENDPOINTS.SMTP_SETTINGS}/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("UPDATE SMTP failed:", err);
      throw err;
    }
  };
   
  // company form - industry drop down
  export const getAllIndustries = async () => {
    try {
      const res = await ApiHelper.getAll(ENDPOINTS.COMPANY_INDUSTRY);
      return res.data?.data || []; 
    } catch (err) {
      console.error("Failed to fetch industries:", err);
      return [];
    }
  };





