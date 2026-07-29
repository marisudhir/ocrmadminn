import * as ApiHelper from '../../../api/ApiHelper';
import { ENDPOINTS } from '../../../api/ApiConstant';

export const getAllCities = async () => {
  try {
    const response = await ApiHelper.getAll(ENDPOINTS.CITIES);
    // Transform data - make it more defensive
    const transformedData = response.data.data.map(cities => ({
      icity_id: cities.icity_id,
      iDistric_id: cities.iDistric_id,
      cCity_name: cities.cCity_name,
      bactive: cities.bactive,
      dCreated_dt: cities.dCreated_dt,
      district: cities.district ? {  // Check if district exists
        iDistric_id: cities.district.iDistric_id,
        cDistrict_name: cities.district.cDistrict_name || 'Unknown District'
      } : {
        iDistric_id: cities.iDistric_id,
        cDistrict_name: 'Unknown District'
      }
    }));

    return transformedData;
  } catch (error) {
    console.error("Cities API Error:", error);
    throw error;
  }
};

export const addNewCities = async (data) => {
  try {
    const payload = {
      iDistric_id: data.iDistric_id,
      cCity_name: data.cCity_name,
      bactive: true
    };
    const response = await ApiHelper.create(payload, ENDPOINTS.CITIES);
    return response.data;
  } catch (error) {
    console.error("Error creating cities:", error);
    throw error;
  }
};

export const updateCities = async (id, citiesData) => {
  try {
    const payload = {
      cCity_name: citiesData.cCity_name,
      iDistric_id: citiesData.iDistric_id,
      bactive: citiesData.bactive
    };
    const response = await ApiHelper.update(id, ENDPOINTS.CITIES, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating cities:", error);
    throw error;
  }
};

export const deleteCities = async (id) => {
  try {
    const response = await ApiHelper.deActive(id, ENDPOINTS.CITY_ID);
    return response;
  } catch (error) {
    console.error("Error deactivating cities:", error);
    throw error;
  }
};