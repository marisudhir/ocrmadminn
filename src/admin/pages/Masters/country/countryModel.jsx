// src/countryModel.js
import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

export const getAllCountry = async () => {
  try {
    const response = await ApiHelper.getAll(ENDPOINTS.COUNTRY);
    
    // Debug raw response
    console.log('Raw API response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    // Handle various response formats
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.d)) {
      return response.data.d; // For APIs that use 'd' as data key
    } else if (response.data && response.data.success) {
      return response.data.data || response.data.result || [];
    }

    console.error('Unhandled response format:', response);
    return [];
  } catch (error) {
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    throw error;
  }
};
export const addNewCountry = async (data) => {
  try {
    const payload = {
      cCountry_name: data.cCountry_name,
      // bactive: true
    };
    const response = await ApiHelper.create(payload, ENDPOINTS.COUNTRY);
    return response.data;
  } catch (error) {
    console.error("Error creating country:", error);
    throw error;
  }
};
export const updateCountry = async (id, data) => {
  try {
    if (!id || !data?.cCountry_name) {
      throw new Error("Invalid ID or missing country name");
    }

    const payload = {
      cCountry_name: data.cCountry_name,
    };

const response = await ApiHelper.update(id, ENDPOINTS.COUNTRY, payload);

    if (!response.success && response.status !== 200) {
      throw new Error(response.message || 'Failed to update country');
    }

    return response.data || response;
  } catch (error) {
    console.error("Update country error:", {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const deleteCountry = async (id) => {
  try {
    const response = await ApiHelper.deActive(id, ENDPOINTS.COUNTRY_ID);
    return response;
  } catch (error) {
    console.error("Error deactivating country:", error);
    throw error;
  }
};