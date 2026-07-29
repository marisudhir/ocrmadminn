import React, { useState, useEffect } from 'react';
import { useSharedController } from '../../../../api/shared/controller';
import { useLeadSourceController } from '../leadSourceController';

const LeadSourceForm = ({ onClose, onSuccess, editData = null, companyId }) => {
  const [formData, setFormData] = useState({
    source_name: '',
    description: '',
    icompany_id: companyId || 0,
    is_active: true
  });

  const [submitting, setSubmitting] = useState(false);
  const { createLeadSource, updateLeadSource, error, clearError } = useLeadSourceController();
  const { companies, fetchCompanies } = useSharedController();

  // Initialize form with edit data if provided
  useEffect(() => {
    if (editData) {
      setFormData({
        source_name: editData.source_name || '',
        description: editData.description || '',
        icompany_id: editData.icompany_id || 0,
        is_active: editData.is_active !== undefined ? editData.is_active : true
      });
    }
  }, [editData]);

  // Clear error when component unmounts or form closes
  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  // Handle change for all input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'icompany_id' ? parseInt(value) : value)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    clearError();
    
    
    let result;
    if (editData) {
      result = await updateLeadSource(editData.source_id, formData);
    } else {
      result = await createLeadSource(formData);
    }
    
    setSubmitting(false);
    
    if (result.success) {
      const successMessage = editData 
        ? 'Lead source updated successfully!' 
        : 'Lead source created successfully!';
      onSuccess(successMessage);
    }
  };

  return (
    <div>
      <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl">
        {editData ? 'Edit Lead Source' : 'Create Lead Source'}
      </h1>
      
      {/* Display form-level errors */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        <div>
          <label className="block text-sm font-medium">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="source_name"
            value={formData.source_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            disabled={submitting}
            maxLength={50}
          />
          {formData.source_name.length===50 && (
      <p className="text-red-500 text-xs mt-1">
        Max length 50 characters
      </p>
    )}
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description} 
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows="3"
            disabled={submitting}
          />
        </div>



        {editData && (
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="mr-2"
              disabled={submitting}
            />
            <label className="text-sm font-medium">Active</label>
          </div>
        )}

        <div className='flex flex-wrap justify-center gap-4 mt-6'>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Processing...' : (editData ? 'Update' : 'Submit')}
          </button>
        </div>       
      </form>
    </div>       
  );
};

export default LeadSourceForm;

