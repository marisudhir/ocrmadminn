import React, { useState, useEffect } from 'react';
import { useSharedController } from '../../../../api/shared/controller';
import { useLeadStatusController } from '../leadStatusController';


const LeadStatusForm = ({ onClose, onSuccess, editingStatus, companyId }) => {
  const { createLeadStatus, updateLeadStatus } = useLeadStatusController();
  const [formData, setFormData] = useState({
    clead_name: '',
    icompany_id: '',
    orderId: 0,
    // imodified_by: '' 
  });

  useEffect(() => {
    if (editingStatus) {
      setFormData({
        clead_name: editingStatus.clead_name || '',
        icompany_id: editingStatus.icompany_id || '',
        orderId: editingStatus.orderId || 0,
        // imodified_by: 2 
      });
    } else {
      setFormData({
        clead_name: '',
        icompany_id: companyId,
        orderId: 0,
        // imodified_by: 2
      });
    }
  }, [editingStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'icompany_id' || name === 'orderId' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    let success = false;
    
    if (editingStatus) {
      success = await updateLeadStatus(editingStatus.ilead_status_id, formData);
    } else {
      success = await createLeadStatus(formData);
    }
    
    if (success) {
      onSuccess?.();
      onClose();
    } else {
      alert(`Error ${editingStatus ? 'updating' : 'creating'} status!`);
    }
  };

  const { companies, fetchCompanies } = useSharedController();

  // Fetch companies when component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div>
      <h1 className="text-base sm:text-xl md:text-2xl lg:text-2xl mb-4">
        {editingStatus ? 'Edit' : 'Create'} Lead Status
      </h1>  
      
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="clead_name"
            value={formData.clead_name}
            onChange={handleChange}
            required
            maxLength={20}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {formData.clead_name.length=== 20 &&(
          <p className="text-red-500 text-xs mt-1">
            Max length  characters
          </p>
          )}
        </div>  
        
        <div>
          <label className="block text-sm font-medium mb-1">Sort Order <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
            required
            min={1}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* <div>
          <label className="block mb-1 text-sm font-medium">Company</label>
          <select
            name="icompany_id"
            value={formData.icompany_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose company</option>
            {companies.map((company, index) => (
              <option key={index} value={company.iCompany_id}>
                {company.cCompany_name}
              </option>
            ))}
          </select>
        </div> */}

        <div className='flex flex-wrap justify-center gap-4 mt-6'>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {editingStatus ? 'Update' : 'Submit'}
          </button>
        </div>       
      </form>
    </div>       
  );
};

export default LeadStatusForm;

