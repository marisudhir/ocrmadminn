import { useState, useCallback } from "react";
import {
  getAllDuration,
  addNewDuartion,
  updateDuration as modelUpdateDuration,
  deleteDuration as modelDeleteDuration,
} from "./durationModel";

const useDurationController = () => {
  const [durations, setDurations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FETCH ALL
  const fetchDuration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllDuration();
      setDurations(res || []);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // CREATE
  const createDuration = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await addNewDuartion(data);
      setDurations((prev) => [...prev, res]);
      return true;
    } catch (err) {
      setError(err);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  // UPDATE
  const updateDuration = async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      const res = await modelUpdateDuration(id, data);

      setDurations((prev) =>
        prev.map((item) =>
          item.plan_duration_id === id ? res : item
        )
      );

      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const deleteDuration = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await modelDeleteDuration(id);

      setDurations((prev) =>
        prev.filter((d) => (d?.plan_duration_id ?? d?.iDuration_id) !== id)
      );

      return true;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    durations,
    fetchDuration,
    createDuration,
    updateDuration,
    deleteDuration,
    loading,
    error,
  };
};

export default useDurationController;