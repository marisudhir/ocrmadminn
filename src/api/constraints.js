export const BASE_URL = import.meta.env.VITE_API_URL;

export const ENDPOINTS = {
  BASE_URL_IS: BASE_URL,
  LOGIN: `${BASE_URL}/login`,
  FORGOT_PASSWORD: `${BASE_URL}/forgot-password`,
  UPDATE_PASSWORD: `${BASE_URL}/update-password`,
  // UPDATE_PASSWORD: `${BASE_URL}/update-password`,
  // PLAN_TYPE: `${BASE_URL}/pricing-plans`,
  // RESELLER: `${BASE_URL}/reseller`,
  // LEAD_STATUS: `${BASE_URL}/lead-status/company-lead`, // UPDATED 20/6
  // LEAD_STATUS_ACTION: `${BASE_URL}/lead-status/action-logs`,
  // LEAD: `${BASE_URL}/lead/user/`,
  // USERS: `${BASE_URL}/users`,
  ROLE: `${BASE_URL}/role`,
  COMPANY: `${BASE_URL}/company`,
  // FOLLOW_UP: `${BASE_URL}/calender-event`,
  // DASHBOARD_USER: `${BASE_URL}/lead/dashboard`,
  // CREATE_EVENT: `${BASE_URL}/calender-event`,
  // DASHBOARD_MANAGER: `${BASE_URL}/lead/manager`,
  // REMINDERS: `${BASE_URL}/reminder/get-reminder`,
  // LEAD_STATUS_UPDATE: `${BASE_URL}/lead`,
  // CONVERT_TO_DEAL: `${BASE_URL}/lead/convert-to-deal`,
  // USER_REMINDER: `${BASE_URL}/reminder/user-reminder`,
  // USER_CREATION: `${BASE_URL}/users`,
  // GET_USERS: `${BASE_URL}/users`,
  // CONVERT_TO_LOST: `${BASE_URL}/lead`,
  // EXPORT_LEADS: `${BASE_URL}/lead/download`,
  // STAGE_LEADS: `${BASE_URL}/reports/sales-stage-leads`,
  // COMPANY_GET: `${BASE_URL}/lead/company-dashboard/`,
  USER_GET: `${BASE_URL}/users`,
  COMPANY_STORAGE: `${BASE_URL}/admin-dashboard/company-stat`,
  TOP_COMPANY_STORAGE_USAGE: `${BASE_URL}/admin-dashboard/top-company-storage-usage`,
  SUPER_ADMIN_RAZORPAY_CONFIG: `${BASE_URL}/super-admin/razorpay-config`,
  SUPER_ADMIN_RAZORPAY_CONFIG_TEST: `${BASE_URL}/super-admin/razorpay-config/test`,
  LEAD_PACKS: `${BASE_URL}/lead-pack`,
  LEAD_PACKS_ACTIVE: `${BASE_URL}/lead-pack/active`,
  LEAD_PACK_REPORT_PURCHASES: `${BASE_URL}/lead-pack/report/purchases`,
  LEAD_PACK_REPORT_WALLETS: `${BASE_URL}/lead-pack/report/wallets`,
  LEAD_PACK_PURCHASE_ORDER: `${BASE_URL}/lead-pack/purchase/order`,
  LEAD_PACK_PURCHASE_VERIFY: `${BASE_URL}/lead-pack/purchase/verify`,
  LEAD_WALLET_SUMMARY: `${BASE_URL}/lead-pack/wallet/summary`,
  LEAD_WALLET_DEBIT: `${BASE_URL}/lead-pack/wallet/debit`,
  
  
};



