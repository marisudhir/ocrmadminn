import { BASE_URL, ENDPOINTS } from "../../api/ApiConstant";
import * as ApiHelper from "../../api/ApiHelper";

// FUNCTION TO GET ALL ATTRIBUTES
export async function getAllAttributes() {
    const response = await ApiHelper.getAll(ENDPOINTS.ATTRIBUTE);

    if (response && response.data && response.data.attribuites) {
        //  Filter attributes to only return 'Active' ones (bactive: true)
        const activeAttributes = response.data.attribuites.filter(
            (attr) => attr.bactive === true
        );
        return activeAttributes; 
    }

    console.error("Unexpected API response structure:", response);
    throw new Error("Failed to fetch attributes - invalid response structure");
}

// FUNCTION TO CREATE NEW ATTRIBUTE
export async function addNewAttribute(requestData) {
    try {
        const response = await ApiHelper.create(requestData, ENDPOINTS.ATTRIBUTE);
        // Assuming success if response.data exists or status is 201
        if (response && response.data) {
            return response.data;
        }
        // If response is missing data, use the response message or a generic error
        throw new Error(response.message || "Failed to create attribute due to unknown API error.");
    } catch (error) {
        // Pass the specific error message from the API or catch block
        throw new Error(error.message || "Failed to create attribute");
    }
}

// FUNCTION TO EDIT ATTRIBUTE
export async function editAttribute(id, requestData) {
    try {
        const response = await ApiHelper.update(id, ENDPOINTS.ATTRIBUTE, requestData);
        if (response && response.data) {
            return response.data;
        }
        throw new Error(response.message || "Failed to update attribute due to unknown API error.");
    } catch (error) {
        throw new Error(error.message || "Failed to update attribute");
    }
}

// FUNCTION TO DELETE/DEACTIVATE ATTRIBUTE
export async function deactivateAttribute(id) {
    try {
        const response = await ApiHelper.deactive(id, ENDPOINTS.ATTRIBUTE);
        
        // If the API sends back a success object, use it. Otherwise, assume success for no-content response.
        if (response && (response.data || response.status === 204)) {
            return response.data || { success: true, message: "Attribute deactivated successfully" };
        }
        throw new Error(response.message || "Failed to delete attribute due to unexpected API response.");

    } catch (error) {
        throw new Error(error.message || "Failed to delete attribute");
    }
}

// FUNCTION TO GET ALL MODULES FOR DROPDOWN (No change needed here based on prompt)
export async function getAllModules() {
    const response = await ApiHelper.getAll(ENDPOINTS.GET_ALL_MODULES);

    if (response && response.data && response.data.success) {
        return response.data.data || [];
    }

    console.error("Unexpected modules API response structure:", response);
    throw new Error("Failed to fetch modules");
}