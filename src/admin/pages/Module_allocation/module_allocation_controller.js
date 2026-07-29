    import { useEffect, useState } from "react";
    import * as ModuleALlocationModel from "./module_allocation_model"
    //MODULE ALLOCATION CONTROLLER 
    export  function moduleAllocationController() {
        //VARIABLES 
        const[moduleAllocation,setModuleAllocation]=useState([]);
        const[activeModules,setActiveModules]=useState([]);
        const [activeSubscription,setActiveSubscription]=useState([]);
        const [subscriptionModuleAllocation,setSubscriptionModuleAllocation]=useState([])
        const [error,setError]=useState(null)
        const [loading,setLoading]=useState(true)
        //FUNCTION TO FETCH ALL MODULE ALLOCATIONS 
        async  function getAllModuleAllocation() {
            try {
                setLoading(true)
                //CALLING MODEL FUCNTION 
                const data= await ModuleALlocationModel.getAllAllocatedModules();
                setModuleAllocation(data)
            } catch (e) {
                setError(e.message)
            }finally{
                setLoading(false)
            }
            
        }
        //FETCHING ACTIVE MODULE 
        async function getActiveModules() {
        try {
        const data=await ModuleALlocationModel.getActiveModules();
        //assign the active modules in activeModules
        setActiveModules(data)
        
        } catch (e) {
        setError(e.message)
        }
        }
        //FETCHING ACTIVE SUBSCRIPTION 
        async function getActivSubscription() {
        try {
        const data=await ModuleALlocationModel.getActiveSubscription();
        //assign the active subscription in activeSubscription
        setActiveSubscription(data)
        
        } catch (e) {
        setError(e.message)
        }
        }
        //CREATE MODULE ALLOCATION 
        async function createModuleAllocation(requestData) {
        try {
     await ModuleALlocationModel.moduleAllocationCreate(requestData);
        getAllModuleAllocation()
        } catch (e) {
        setError(e.message)
        }
        
        }
        //CHANGE MODULE ALLOCATION STATUS 
        async function changeAllocationSts(id,status) {
            try {
                await ModuleALlocationModel.moduleAllocationChangSts(id,{status:status})
                
            } catch (e) {
                setError(e.message)
            }
        }
        //GET ALLOCATED MODULES BY SUBSCRIPTION 
        async function getAllocatedModulesBySubsId(subscriptionId,type) {
            try {
                const result=await ModuleALlocationModel.getModuleAllocationBySubscriptionId(subscriptionId,type);
                setSubscriptionModuleAllocation(result)
            } catch (e) {
                setError(e.message)
            }
        }
    // EDIT ALLOCATED MODULES AND ALLOCATE NEW MODULES 
async function editModuleAllocationController(reqBody) {
    try {
        await ModuleALlocationModel.editAllocatedModules(reqBody);
        // Refresh the data after successful update
        await getAllModuleAllocation();
        // Also refresh the allocated modules for the current subscription
        if (reqBody.subscriptionId) {
            await getAllocatedModulesBySubsId(reqBody.subscriptionId.toString(), "allocatedModules");
        }
    } catch (e) {
        setError(e.message);
    }
}

    useEffect(()=>{
        getAllModuleAllocation();
        getActiveModules();
        getActivSubscription()
    },[]);


    return {
        moduleAllocation,
        subscriptionModuleAllocation,
        activeModules,
        activeSubscription,
        error,
        loading,
        getActiveModules,
        getActivSubscription,
        createModuleAllocation,
        changeAllocationSts,
        getAllModuleAllocation,
        editModuleAllocationController,
        getAllocatedModulesBySubsId
    }
    }