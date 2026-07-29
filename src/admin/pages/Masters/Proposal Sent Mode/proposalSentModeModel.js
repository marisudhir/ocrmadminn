// models/UserModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

export const getAllProposalSentMode = async () => {
  try {    
    // No company ID needed - fetch all proposal send modes
    const res = await ApiHelper.getAll(ENDPOINTS.PROPOSAL_SENT_MODE);
        return res.data; 
  } catch (error) {
    console.error("Error in getAllProposalSentMode:", error);
    throw error;
  }
};

export const createProposalSentMode = async (data) => {
  try {
    const res = await ApiHelper.create(data, ENDPOINTS.PROPOSAL_SENT_MODE);
    return res;
  } catch (error) {
    console.error("Error creating proposal sent mode:", error);
    throw error;
  }
};

export const editProposalSentMode = async (proposalSentModeId, data) => {
  try {
    const res = await ApiHelper.update(proposalSentModeId, ENDPOINTS.PROPOSAL_SENT_MODE, data);
    return res;
  } catch (error) {
    console.error("Error updating proposal sent mode:", error);
    throw error;
  }
};

export const deleteProposalSentMode = async (proposalSentModeId) => {
  try {
    const res = await ApiHelper.deActive(proposalSentModeId, ENDPOINTS.PROPOSAL_SENT_MODE);
    return res.data;
  } catch (error) {
    console.error("Error deleting proposal sent mode:", error);
    throw error;
  }
};