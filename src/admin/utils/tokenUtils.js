// utils/tokenUtils.js
export const decodeToken = () => {
  try {
    // Try different possible storage locations
    const token = 
      localStorage.getItem('authToken') || 
      localStorage.getItem('token') ||
      sessionStorage.getItem('authToken') ||
      sessionStorage.getItem('token') ||
      localStorage.getItem('userToken') ||
      sessionStorage.getItem('userToken');

    if (!token) {
      console.warn("No authentication token found");
      return null;
    }


    // JWT tokens have 3 parts separated by dots
    if (token.split('.').length !== 3) {
      console.warn("Token doesn't appear to be a valid JWT");
      return null;
    }

    // Decode the payload (second part of JWT)
    const payload = token.split('.')[1];
    
    // Add padding if necessary for base64 decoding
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    switch (base64.length % 4) {
      case 2: base64 += '=='; break;
      case 3: base64 += '='; break;
    }

    const decodedPayload = JSON.parse(atob(base64));

    return decodedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getCompanyIdFromToken = () => {
  try {
    const decodedToken = decodeToken();
    
    if (!decodedToken) {
      return null;
    }

    // Try different possible property names for company ID
    const companyId = 
      decodedToken.company_id ||      // Most common
      decodedToken.companyId ||       // camelCase
      decodedToken.iCompany_id ||     // Hungarian notation
      decodedToken.companyID ||       // Alternative camelCase
      decodedToken.comp_id ||         // Short form
      decodedToken.cid ||             // Very short form
      decodedToken.organization_id || // Alternative naming
      decodedToken.org_id;            // Short alternative


    if (!companyId) {
      console.warn("Company ID not found in token. Available properties:", Object.keys(decodedToken));
    }

    return companyId;
  } catch (error) {
    console.error("Error getting company ID from token:", error);
    return null;
  }
};


export const getUserIdFromToken = () => {
  try {
    const decodedToken = decodeToken();
    
    if (!decodedToken) {
      return null;
    }

    // Try different possible property names for user ID
    const userId = 
      decodedToken.user_id ||      // Most common
      decodedToken.userId ||       // camelCase
      decodedToken.id ||           // Simple id
      decodedToken.sub ||          // JWT standard subject
      decodedToken.userID ||       // Alternative camelCase
      decodedToken.uid ||          // Short form
      decodedToken.iUser_id ||     // Hungarian notation
      decodedToken.employee_id ||  // Alternative naming
      decodedToken.emp_id;         // Short alternative


    if (!userId) {
      console.warn("User ID not found in token. Available properties:", Object.keys(decodedToken));
    }

    return userId;
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return null;
  }
};
// Alternative method using try-catch for each possible property
export const getCompanyIdFromTokenAlternative = () => {
  const decodedToken = decodeToken();
  
  if (!decodedToken) return null;

  // List all possible property names for company ID
  const possibleKeys = [
    'company_id', 'companyId', 'iCompany_id', 'companyID', 
    'comp_id', 'cid', 'organization_id', 'org_id',
    'tenant_id', 'tenantId', 'account_id', 'accountId'
  ];

  for (const key of possibleKeys) {
    if (decodedToken[key] !== undefined && decodedToken[key] !== null) {
      return decodedToken[key];
    }
  }

  console.warn("Company ID not found in any known property. Token structure:", decodedToken);
  return null;
};