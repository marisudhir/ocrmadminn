import React, { useEffect, useState } from "react";
import * as resellerModel from './resellerModel';


export const useResellerController = () =>{

    const [resellerData, setResellerData] = useState([]);
    const [error, setError] = useState(null);

    //Function to fetch all the company details
    const fetchAllResellerData = async () => {
        try{
            const data = await resellerModel.getAllResellerData();
            setResellerData(data);
        } catch(err){
            console.error('Failed to fetch company data:', err);
            setError(err.message || 'Something went wrong');
        }
    }


    //Function to fetch all the company details
    const fetchResellerDataById = async (id) => {
        try{
            const data = await resellerModel.getResellerById(id);
            return data;
        } catch(err){
            console.error('Failed to fetch company data:', err);
            setError(err.message || 'Something went wrong');
        }
    }

    //Function to add an new company
 
    const createReseller = async (data)=>{
        try {
            const res = await resellerModel.addNewReseller(data);
            await fetchAllResellerData();
            return true;
        } catch(err) {
            console.error('Failed to create company:', err);
            setError(err.message || 'Could not create company');
            return false;
        }
    }



 useEffect(() => {
    fetchAllResellerData();
  }, []);

    return {
    resellerData,
    fetchResellerDataById,
    fetchAllResellerData, // for component reload once create API hits
    error, // Optional: expose to show in UI
  };

}


