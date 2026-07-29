import { useEffect, useState } from "react"
import * as subscriptionModel from "./subscription_model"; 
import { getAllCurrency } from "../Masters/currency/currencyModel";


//SUBSCRIPTION CONTROLLER 
export function subscriptionCRUDOperation() {
    //VARIABLES 
    const [subscriptions, setSubscriptions] = useState([])
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(null)
    const [currencies, setCurrencies] = useState([])
    //FUNCTION TO FETCH SUBSCRIPTION LIST 
    async function getAllSubscription() {
        try {
            setLoading(true);
            //CALLING MODEL 
            const data = await subscriptionModel.getAllSubscriptionModel()
            setSubscriptions(data);
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }
    //FUNCTION TO CREATE NEW SUBSCRIPTION  
    async function addSubscription(requestData) {
        try {
            //CALLING MODEL
            await subscriptionModel.addSubscription(requestData);
            //CALLING getAllSubscription FUNCTION FOR REAL TIME UPDATE 
            getAllSubscription()
        } catch (e) {
            setError(e.message)
        }
    }
    //FUNCTION TO EDIT SUBSCRIPTION
    async function editSubscription(id, requestData) {
        try {
            //CALLING MODEL
            const data = await subscriptionModel.editSubscription(id, requestData);
            //CALLING getAllSubscription FUNCTION FOR REAL TIME UPDATE 
            getAllSubscription()
        } catch (e) {
            setError(e.message)
        }
    }
    //FUNCTION TO UPDATE SUBSCRIPTION STATUS
    async function changeSubscriptionStatusController(id, requestData) {
        try {
            //CALLING MODEL
            const data = await subscriptionModel.changeSubscriptionStatus(id, requestData);
            //CALLING getAllSubscription FUNCTION FOR REAL TIME UPDATE 
            getAllSubscription()
        } catch (e) {
            setError(e.message)
        }
    }
    //FUNCTION TO FETCH ALL CURRENCIES
    async function getAllCurrencyController() {

        try {
            const data = await getAllCurrency();
            // setCurrencies(data)
            const filterData = data.filter(currency => currency.bactive === true) || [];
            setCurrencies(filterData);
        } catch (e) {
            setError(e.message)
        }
    }

    //CALLING THE getAllSubscription() FUNCTION 
    useEffect(() => {
        getAllSubscription(),
        getAllCurrencyController()
    }, [])

    return {
        subscriptions,
        loading,
        error,
        addSubscription,
        editSubscription,
        changeSubscriptionStatusController,
        currencies
    }
}