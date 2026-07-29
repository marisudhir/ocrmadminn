import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

export const getAllCurrency = async (adminSide) => {
  try {
    const response =  await  ApiHelper.getWithQueryParam(ENDPOINTS.CURRENCY,adminSide);
    return response.data.data.data;
  } catch (error) {
    console.error("Currency API Error:", error);
    throw error;
  }
};

export const addNewCurrency = async (data) => {
  try {
    const payload = {
      country_name: data.country_name,
      currency_code: data.currency_code,
      currency_name: data.currency_name,
      symbol: data.symbol,
      bactive: true
    };
    const response = await ApiHelper.create(payload, ENDPOINTS.CURRENCY);
    return response.data.data.data;
  } catch (error) {
    console.error("Error creating currency:", error);
    throw error;
  }
};
export const updateCurrency = async (id, currencyData) => {
  try {
    const payload = {
      country_name: currencyData.country_name,
      currency_code: currencyData.currency_code,
      currency_name: currencyData.currency_name,
      symbol: currencyData.symbol,
      bactive: currencyData.bactive
    };
    const response = await ApiHelper.update_patch(id, ENDPOINTS.CURRENCY, payload);
    return response.data.data;
  } catch (error) {
    console.error("Error updating currency:", error);
    throw error;
  }
};
export const deleteCurrency = async (id) => {
  try {
    const response = await ApiHelper.deActive(id, ENDPOINTS.CURRENCY_ID);
    return response;
  } catch (error) {
    console.error("Error deactivating currency:", error);
    throw error;
  }
};