import { ENDPOINTS } from '../../../api/ApiConstant';
import * as ApiHelper from '../../../api/ApiHelper';

// CREATE LEAD LOST REASON
export async function createLeadLostReason(formData) {    
    const payload = {
        lostReason: formData.lostReason,
        companyId: formData.companyId 
    };
    const response = await ApiHelper.create(payload, ENDPOINTS.LEAD_LOST_REASON);
    return response.data;
}

// GET ALL LEAD LOST REASONS
export async function getAllLeadLostReasons() {
    const response = await ApiHelper.getAll(ENDPOINTS.LEAD_LOST_REASON);
    return response.data;
}

// GET LEAD LOST REASONS BY COMPANY ID
export async function getLeadLostReasonsByCompanyId(companyId) {    
    if (!companyId) return { data: [] };

    const response = await ApiHelper.getById( companyId, ENDPOINTS.LEAD_LOST_REASON );
    return response.data;
}

// UPDATE LEAD LOST REASON
export async function updateLeadLostReason(formData) {    
    const id = formData.lostReasonId || formData.ilead_lost_reason_id;
    const payload = {
        lostReason: formData.lostReason,
        companyId: formData.companyId 
    };

    const response = await ApiHelper.update(
        id, 
        ENDPOINTS.LEAD_LOST_REASON, 
        payload
    );
    
    return response.data;
}


// DELETE LEAD LOST REASON
export async function deleteLeadLostReason(id, companyId) {    
    const params = {
        lostReasonId: Number(id),
        isActive: false,
        icompany_id: Number(companyId) 
    };

    const response = await ApiHelper.deleteWithQueryParams(
        ENDPOINTS.LEAD_LOST_REASON,
        params
    );

    return response.data;
}

