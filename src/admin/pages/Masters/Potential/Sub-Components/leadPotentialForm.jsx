import React, { useState, useEffect } from 'react';
import { useSharedController } from '../../../../api/shared/controller';
import  useLeadPotentialController  from '../leadPotentialController';

const LeadPotentialForm = ({ onClose, onSuccess, editData, companyId }) => {

  const { createLeadPotential, updateLeadPotential } = useLeadPotentialController();
  const { companies, fetchCompanies } = useSharedController();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ clead_name: '', icompany_id: companyId, });

  useEffect(() => {
    if (editData) {
      setFormData({
        clead_name: editData.clead_name || '',
        icompany_id: editData.icompany_id || companyId,
    
      });
    } else {
      setFormData({
        clead_name: '',
        icompany_id: companyId,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    //validation
    if (!formData.clead_name || !formData.icompany_id) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    let isSuccess = false;
    
    try {
      if (editData && editData.ileadpoten_id) {
        // Update existing lead potential
        isSuccess = await updateLeadPotential(editData.ileadpoten_id, formData);
      } else {
        // Create new lead potential
        isSuccess = await createLeadPotential(formData);
      }

      if (isSuccess) {
        onSuccess?.();
        onClose();
      } else {
        alert(`Error ${editData ? 'updating' : 'creating'} lead potential!`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(`Error ${editData ? 'updating' : 'creating'} lead potential!`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl mb-4">
        {editData ? 'Edit' : 'Create'} Lead Potential
      </h1>  
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        <div>
          <label className="block text-sm font-medium mb-2">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="clead_name"
            value={formData.clead_name}
            onChange={handleChange}
            required
            disabled={submitting}
            maxLength={20}
            className="w-full border p-2 rounded"
          />

          {formData.clead_name.length===20&&(
            <p className="text-red-500 text-xs mt-1">
              Max length 20 characters
            </p>
          )}
        </div>

        <div className='flex flex-wrap justify-center gap-4 mt-6'>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Processing...' : (editData ? 'Update' : 'Submit')}
          </button>
        </div>       
      </form>
    </div>       
  );
};

export default LeadPotentialForm;
