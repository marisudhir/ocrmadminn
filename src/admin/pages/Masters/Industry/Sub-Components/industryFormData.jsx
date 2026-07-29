import React, { useState, useEffect } from 'react';
import { useIndustryController } from '../industryController';
import { useSharedController } from '../../../../api/shared/controller';

const IndustryForm = ({ onClose, onSuccess, industry, onUpdate, loading, companyId }) => {
  const { createIndustry } = useIndustryController();
  const { companies, fetchCompanies } = useSharedController();
  const isEditing = !!industry;

  const [formData, setFormData] = useState({
    cindustry_name: '',
    icompany_id: companyId,
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(''); // Add error state

  // Fetch companies when component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Pre-fill data when editing
  useEffect(() => {
    if (isEditing && industry) {
      setFormData({
        cindustry_name: industry.cindustry_name || '',
        icompany_id: industry.icompany_id || companyId,
      });
    } else {
      setFormData({
        cindustry_name: '',
        icompany_id: companyId || '',
      });
    }
    // Clear errors when form opens or data changes
    setError('');
  }, [isEditing, industry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'icompany_id' ? parseInt(value) || '' : value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return payload.user_id || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    try {
      const userId = getUserFromToken();

      if (!userId) {
        setError('User info missing! Please log in.');
        return;
      }

      if (!formData.cindustry_name.trim()) {
        setError('Industry name is required');
        return;
      }

      if (isEditing) {
        // Update existing industry - let the error propagate
        const isSuccess = await onUpdate(formData);
        if (isSuccess) {
          setSuccessMessage('Lead industry updated successfully!');
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1000);
        }
      } else {
        // Create new industry - let the error propagate
        const payload = {
          cindustry_name: formData.cindustry_name.trim(),
          icompany_id: companyId,
          created_by: userId,
          dcreated_dt: new Date().toISOString(),
        };

        const isSuccess = await createIndustry(payload);

        if (isSuccess) {
          setSuccessMessage('Lead industry created successfully!');
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
      
      // Extract the actual backend error
      const backendError = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Operation failed';
      
      setError(backendError);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {isEditing ? 'Edit Lead Industry' : 'Create Lead Industry'}
      </h2>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700 text-sm font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="cindustry_name"
            value={formData.cindustry_name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="Enter industry name"
            disabled={loading}
            maxLength={50}
          />
          {formData.cindustry_name.length===50 &&( 
            <p className='text-red-500 text-xs mt-1'>
              Max length 50 characters
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>

          <button type="submit" disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              isEditing ? 'Update' : 'Create'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IndustryForm;

