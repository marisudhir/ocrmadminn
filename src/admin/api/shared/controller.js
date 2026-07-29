// controllers/UserController.js
import { useEffect, useState } from 'react';
import * as model from './model';

export const useSharedController = () => {
  const [companies, setCompanies] = useState([]);
  const [bussinessType, setBussinessType] = useState([]);
  const [cities, setCities] = useState([]);
  const [roles, setRoles] = useState([]); 
  const [plan, setPlan] = useState([]);
  //  const [roles, setRoles] = useState([]);
  const [bussiness, setBussiness] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [industries, setIndustries] = useState([]);

  //Contains the business logic to fetch all the companies
  const fetchCompanies = async () => {
      const data = await model.getAllCompanies();
    setCompanies(data);
    };

   // function to fetch all the plans
    const fetchPlan = async () => {
  try {
    const data = await model.getPlan();
    setPlan(Array.isArray(data) ? data : data.data || []);
  } catch (err) {
    console.error("Error fetching plans:", err);
    setPlan([]);
  }
};

  // fetch all the cities    
    const fetchAllCities = async () => {
      const data = await model.getAllCities();
      setCities(data);
    };

    // fetch all currencies
    const fetchCurrencies = async () => {
        try {
            const rawData = await model.getAllCurrencies();
            const currencyArray = Array.isArray(rawData)  ? rawData : rawData?.data || [];
            const activeCurrencies = currencyArray.filter(currency => currency.bactive === true);
            setCurrencies(activeCurrencies);
        } 
        catch (err) {
            console.error("Error fetching currencies:", err);
            setCurrencies([]); 
        }
    };

    const fetchBussiness = async () => {
    try {
      const data = await model.getAllBussiness();
      setBussiness(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setBussiness([]); 
    }
  };

    // function to fetch the roles for an company
    const fetchRoles = async () => {
      try {
        const data = await model.getAllRoles();
        setRoles(data);
        return data;
      } catch (err) {
        console.error("Failed to fetch company data:", err);
        setError(err.message || "Something went wrong");
      }
    };

  const fetchIndustries = async () => {
    try {
      const data = await model.getAllIndustries();
      setIndustries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching industries:", err);
      setIndustries([]);
    }
  };

  //Use effect initially runs.
  useEffect(() => {
    fetchCompanies();
    fetchAllCities(); 
    fetchCurrencies();  
    fetchBussiness();   
    fetchPlan();  
    fetchIndustries();
    // fetchBussinessType();     
  }, []);

  return {
    fetchCompanies, 
    companies,
    fetchAllCities,
    fetchRoles,
    roles,
    cities,
    plan,
    bussinessType,
    fetchRoles ,
    fetchCurrencies,
    currencies,
    fetchBussiness,
    bussiness,
    fetchPlan,
    industries,
  };
};
