import { ENDPOINTS } from "../../api/ApiConstant"
import * as ApiHelper from "../../api/ApiHelper"
//MODULE ALLOCATION API REQUEST AND RESPONSE 
//FETCHING ALL ALLOCATED MODULES 
export async function getAllAllocatedModules() {
    const res=await ApiHelper.getAll(ENDPOINTS.GET_ALL_ALLOCATED_MODULES);
    const returnData=res.data
    if(returnData.success) return returnData.data;
    throw new Error (returnData.message)
}
//FETCHING ALL ACTIVE MODULES 
export async function getActiveModules() {
    const res=await ApiHelper.getAll(ENDPOINTS.GET_ACTIVE_MODULES);
    const returnData=res.data
    if(returnData.success) return returnData.data;
    throw new Error (returnData.message)
}
//FETCHING ALL ACTIVE SUBSCRIPTION PLAN  
export async function getActiveSubscription() {
    const res=await ApiHelper.getAll(ENDPOINTS.GET_ACTIVE_SUBSCRIPTION);
    const returnData=res.data;
    if(returnData.success) return returnData.data;
    throw new Error (returnData.message)
}
//CREATE MODULE ALLOCATION 
export async function moduleAllocationCreate(data) {
  const res = await ApiHelper.create(data, ENDPOINTS.CREATE_MODULE_ALLOCATION);

  if (res.data?.success) {
    return res.data; // Return entire response if needed
  } else {
    // Throw with readable message
    console.error("res :::",res.data?.message)
    throw new Error(res.data?.message || "Failed to create module allocation");
  }
}
//EDIT MODULE ALLOCATION
export async function moduleAllocationEdit() {
    const res=await ApiHelper.update(ENDPOINTS.GET_ACTIVE_SUBSCRIPTION);
    //RETURN SUCCESS TRUE IF API RESPONSE IS SUCCEED
    if(res.data?.success) return res.data?.success;
    throw new Error (res.data?.message)
}
//CHANGE MODULE ALLOCATIONS STATUS 
export async function moduleAllocationChangSts(id,reqBody) {
    const res=await ApiHelper.update(id,ENDPOINTS.CHANGE_MODULE_ALLOCATION_STATUS,reqBody);
    //RETURN SUCCESS TRUE IF API RESPONSE IS SUCCEED
    if(res.data?.success) {
        return res.data?.success
    }
    else{
          throw new Error (res.data?.message)
    }
  
}
//GET ALLOCATED MODULES BY SUSBCRIPTION ID 
export async function getModuleAllocationBySubscriptionId(susbcriptionId,type) {
    const res=await ApiHelper.getByIdAndType(susbcriptionId,type,ENDPOINTS.GET_ALLOCATED_MODULES_BY_SUBSC_ID);
    //RETURN SUCCESS TRUE IF API RESPONSE IS SUCCEED
    if(res.data?.success) return res.data?.data ;
    throw new Error (res.data?.message)
}
// EDIT ALLOCATED MODULES 
export async function editAllocatedModules(requestData) {
    const subscriptionId = requestData.moduleAllocations.subscriptionId;

    // const res = await ApiHelper.editWithReqBody(`${ENDPOINTS.EDIT_MODULE_ALLOCATION}`,requestData);
    const res = await ApiHelper.editWithReqBody(ENDPOINTS.EDIT_MODULE_ALLOCATION, requestData);


    if (res.data?.success) return res.data;
    throw new Error(res.data?.message);
}


// export async function editAllocatedModules(requestData) {
//     try {
//         console.log("🚀 Making API call to:", ENDPOINTS.EDIT_MODULE_ALLOCATION);
//         console.log("📦 Full Request Data:", requestData);
//         console.log("📋 Stringified Request:", JSON.stringify(requestData, null, 2));
        
//         const res = await ApiHelper.editWithReqBody(ENDPOINTS.EDIT_MODULE_ALLOCATION, requestData);
        
//         console.log("✅ API Response:", res.data);
        
//         if (res.data?.success) {
//             return res.data;
//         } else {
//             throw new Error(res.data?.message || "Failed to update module allocation");
//         }
//     } catch (error) {
//         console.error("❌ API Error:", error);
//         console.error("❌ Error Message:", error.message);
//         throw error;
//     }
// }