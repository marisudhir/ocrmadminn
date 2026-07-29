import { useState, useCallback } from 'react';
import {
  getAllDistrict,
  addNewDistrict,
  updateDistrict as modelUpdateDistrict,
  deleteDistrict as modelDeleteDistrict
} from './districtModel';

const useDistrictController = () => {
  const [district, setDistrict] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * ---------------------------------------------------------
   * FETCH DISTRICTS
   * ---------------------------------------------------------
   */
  const fetchDistrict = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllDistrict();
      if (!data || data.length === 0) {
        setError({
          message: "No districts available",
          isEmpty: true
        });
      }

      setDistrict(data || []);
    } catch (err) {
      console.error("Fetch district error:", err);
      setError(err);
      setDistrict([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ---------------------------------------------------------
   * CREATE DISTRICT
   * ---------------------------------------------------------
   */
  const createDistrict = async (districtData) => {
    setLoading(true);
    setError(null);

    try {
      const newDistrict = await addNewDistrict(districtData);

      setDistrict((prev) => [...prev, newDistrict]);

      return true;
    } catch (err) {
      console.error("Create district error:", err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ---------------------------------------------------------
   * UPDATE DISTRICT
   * districtData contains the full object
   * ---------------------------------------------------------
   */
  const updateDistrict = async (districtData) => {
    setLoading(true);
    setError(null);

    try {
      // Sending ID + updated body to API
      const updatedDistrict = await modelUpdateDistrict(
        districtData.iDistric_id,  
        districtData
      );

      // Update state
      setDistrict((prev) =>
        prev.map((item) =>
          item.iDistric_id === districtData.iDistric_id
            ? { ...item, ...updatedDistrict }
            : item
        )
      );

      return true;
    } catch (err) {
      console.error("Update district error:", err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ---------------------------------------------------------
   * DELETE DISTRICT
   * ---------------------------------------------------------
   */
  const deleteDistrict = async (districtId) => {
    setLoading(true);
    setError(null);

    try {
      await modelDeleteDistrict(districtId);

      setDistrict((prev) =>
        prev.filter((item) => item.iDistric_id !== districtId)
      );

      return true;
    } catch (err) {
      console.error("Delete district error:", err);
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * ---------------------------------------------------------
   * EXPOSE VALUES
   * ---------------------------------------------------------
   */
  return {
    district,
    loading,
    error,
    fetchDistrict,
    createDistrict,
    updateDistrict,
    deleteDistrict,
  };
};

export default useDistrictController;
