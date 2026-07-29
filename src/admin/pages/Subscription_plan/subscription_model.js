import * as ApiHelper from '../../api/ApiHelper';
import { ENDPOINTS } from '../../api/ApiConstant';

// Fetch all subscriptions
export async function getAllSubscriptionModel() {
  const res = await ApiHelper.getAll(ENDPOINTS.ALL_SUBSCRIPTION_GET);
  if (res.status===200) return res.data.data;   
  throw new Error(res.data?.message || "Failed to fetch subscriptions");
}

// Add subscription
export async function addSubscription(requestData) {
  const res = await ApiHelper.create(requestData, ENDPOINTS.SUBSCRIPTION_CREATE);
  if (res.status===201) return res.data.data;
  throw new Error(res.data?.message || "Failed to add subscription");
}

// Edit subscription
export async function editSubscription(id, requestData) {
  const res = await ApiHelper.update(id, ENDPOINTS.EDIT_SUBSCRIPTION,requestData);
  if (res.status===200) return res.data.data;
  throw new Error(res.data?.message || "Failed to edit subscription");
}

// Change subscription status
export async function changeSubscriptionStatus(id, requestData) {
  const res = await ApiHelper.update(id, ENDPOINTS.SUBSCRIPTION_STATUS_CHANGE,requestData);
  if (res.status===200) return res.data.data;
  throw new Error(res.data?.message || "Failed to change status");
}