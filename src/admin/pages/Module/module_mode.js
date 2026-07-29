import { BASE_URL, ENDPOINTS } from "../../api/ApiConstant";
import * as ApiHelper from "../../api/ApiHelper"

//FUNCTION TO GET ALL MODULES 
export async function getALlModules() {
    //calling getAll() function to fetch all modules
    const data=await ApiHelper.getAll(ENDPOINTS.GET_ALL_MODULES);
    if(data.data?.success){
    return data.data?.data;
    }
    throw new Error(data.message)
}

//FUNCTION TO CREATE NEW MODULE
export async function addNewModule(requestData) {
    //calling getAll() function to fetch all modules
    const data=await ApiHelper.create(requestData,ENDPOINTS.CREATE_MODULE);
    if(data.data?.sucess){
    return data.data;
    }
    throw new Error(data.message)
}

//FUNCTION TO EDIT MODULE
export async function editModule(id,requestData) {
    //calling getAll() function to fetch all modules
    const data=await ApiHelper.update(id,ENDPOINTS.EDIT_MODULE,requestData);
    if(data.data?.sucess){
    return data.data;
    }
    throw new Error(data.message)
}

// FUNCTION TO UPDATE  MODULE STATUS
export async function changeModuleStatus(id, requestData) {
    const data = await ApiHelper.updateWithQueryParams({ moduleId: id }, ENDPOINTS.CHANGE_MODULE_STATUS, requestData);
    if (data.data?.success) { 
        return data.data;
    }
    throw new Error(data.message);
}





