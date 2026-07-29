import React, { useState, useEffect, useCallback, use } from "react";
import { useCompanyController } from "./companyController";
import * as companyModel from "./companyModel";
import { User, Lock, CreditCard, Users, ArrowLeft, BadgeCheck, XCircle, ChevronRight } from "lucide-react";
import { useToast } from "../../../context/ToastContext";
import { useSharedController } from "../../api/shared/controller";

const CompanyUser = ({ user, companyId, setShowProfile }) => {
  const targetUserId = user.iUser_id ? parseInt(user?.iUser_id) : null;
  const [activeSection, setActiveSection] = useState("General Info");

  const [formData, setFormData] = useState({
    cFull_name: user.cFull_name || "",
    cEmail: user.cEmail || "",
    cPassword: "",
    i_bPhone_no: user.i_bPhone_no || "",
    iphone_no: user.iphone_no || "",
    cjob_title: user.cjob_title || "",
    irole_id: user.irole_id , 
    reports_to: user.reports_to?.id || "",
    bactive: user.bactive
  });

  // Update form data if the user prop changes
  useEffect(() => {
    setFormData({
      cFull_name: user.cFull_name || "",
      cEmail: user.cEmail || "",
      i_bPhone_no: user.i_bPhone_no || "",
      iphone_no: user.iphone_no || "",
      cjob_title: user.cjob_title || "",
      irole_id: user.irole_id , 
      reports_to: user.reports_to?.id || "",      
      bactive: user.bactive
    });
  }, [user]);

  const { attributes, userAttributes, loading, error, fetchAttributes, fetchUserAttributes, changeUserSettingsStatus, updateUserProfile, changeUserStatus, } = useCompanyController();
  const [stagedAttributes, setStagedAttributes] = useState({});
  const [companyUsers, setCompanyUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [openModules, setOpenModules] = useState({});
  const { showToast } = useToast();
  const { fetchAllCities, cities, fetchRoles, roles } = useSharedController();
  

  // ---  Handle Text Input Changes ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: (name === "irole_id" || name === "reports_to") && value === "" ? "" : value,
    }));
  };

  // --- Handle Profile Update (Submit) ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!targetUserId) return;

    // Construct payload
    const payload = {
      cFull_name: formData.cFull_name,
      cUser_name: formData.cFull_name,
      cEmail: formData.cEmail,
      i_bPhone_no: formData.i_bPhone_no,
      iphone_no: formData.iphone_no,
      bactive: formData.bactive,
      cjob_title: formData.cjob_title,
      irole_id: formData.irole_id ? Number(formData.irole_id) : null,
      reports_to: formData.reports_to ? Number(formData.reports_to) : null,
    };

    // only send password if filled
    if (formData.cPassword?.trim()) {
      payload.cPassword = formData.cPassword;
    }

    const result = await updateUserProfile(targetUserId, payload);
    
    if (result.success) {
      showToast("success", "User profile updated successfully!");
    } else {
      showToast("error", result.message);
    }
  };

  // Initialize staged attributes when data loads
  useEffect(() => {
    if (!loading && attributes.length > 0) {
      const initialStaged = {};
      
      // Create entries for ALL available attributes
      attributes.forEach((attr) => {
        initialStaged[attr.iattribute_id] = false; 
      });
      
      //  For attributes user already has, set to their current status
      if (userAttributes && userAttributes.length > 0) {
        userAttributes.forEach((userAttr) => {
          if (userAttr.iattribute_id in initialStaged) {
            initialStaged[userAttr.iattribute_id] = userAttr.bactive === true;
          }
        });
      }
      setStagedAttributes(initialStaged);
      setHasPendingChanges(false);
    }
  }, [attributes, userAttributes, loading]);

  useEffect(() => {
    const moduleNames = [
      ...new Set(
        attributes
          .filter((attr) => attr.bactive === true && attr.module_table?.bactive === true)
          .map((attr) => attr.module_table?.cmodule_name)
          .filter(Boolean)
      ),
    ];

    if (moduleNames.length === 0) return;

    setOpenModules((prev) => {
      const next = { ...prev };
      moduleNames.forEach((name) => {
        if (!(name in next)) {
          next[name] = true;
        }
      });
      return next;
    });
  }, [attributes]);


  useEffect(() => {
      if (fetchRoles) { fetchRoles(); }
  }, []);

  useEffect(() => {
    companyModel.getUsersByCompanyId(companyId).then(res => {
      setCompanyUsers(res.data || []); 
    }); 
  }, [companyId]);


  // Fetch data when component mounts or user changes
  useEffect(() => {
    if (targetUserId) {
      fetchAttributes();
      fetchUserAttributes(targetUserId, companyId);
    }
  }, [targetUserId, companyId]);

  const handleCheckboxChange = (attrId, checked) => {
    setStagedAttributes((prev) => ({
      ...prev,
      [attrId]: checked,
    }));
    setHasPendingChanges(true);
  };

  const toggleModule = (moduleName) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  //  Handler for the Activate/Deactivate button
  const handleStatusAction = async () => {
    if (!targetUserId) return;
    const newStatus = !formData.bactive; 
    const actionText = newStatus ? "Activate" : "Deactivate";

    if (!window.confirm(`Are you sure you want to ${actionText} this user?`)) {
        return; 
    }
    try {
        await companyModel.changeUserStatus(targetUserId);
        setFormData((prev) => ({ ...prev, bactive: newStatus }));
        showToast("success", `User successfully ${actionText}d!`); 
    } catch (err) {
        console.error(`Failed to ${actionText} user:`, err);
        showToast("error", `Failed to ${actionText} user. Please try again.`);
    }
};
  
  const handleSave = async () => {
    if (!targetUserId || isSaving || !hasPendingChanges) return;
    setIsSaving(true);
    try {
      await companyModel.applyUserAttributeChanges(
        targetUserId,
        stagedAttributes,
        userAttributes
      );
      // Refresh the user attributes after saving
      await fetchUserAttributes(targetUserId);
      // Show success message
      showToast("success", "Attribute access updated successfully! 🎉");
      setHasPendingChanges(false);
      
    } catch (err) {
      console.error("Failed to save attribute changes:", err);
      showToast("error", "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if we're ready to render
  const isReady = !loading && targetUserId && attributes.length > 0;
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start">
        <button onClick={() => setShowProfile(false)}  className="self-start p-2 rounded-full hover:bg-gray-100 transition" >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <nav className="flex w-full flex-wrap items-center gap-2 sm:gap-3">
          <SidebarItem
            icon={<User />}
            text="General Info"
            active={activeSection === "General Info"}
            onClick={() => setActiveSection("General Info")}
          />
          <SidebarItem
            icon={<Lock />}
            text="Allowed Attributes"
            active={activeSection === "Allowed Attributes"}
            onClick={() => setActiveSection("Allowed Attributes")}
          />
        </nav>
        </div>
        {activeSection === "General Info" && (
          <button
            onClick={handleProfileUpdate}
            className="w-full sm:w-auto shrink-0 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Update
          </button>
        )}
        {activeSection === "Allowed Attributes" && (
          <button
            onClick={handleSave}
            disabled={!hasPendingChanges || isSaving || loading || !targetUserId}
            className={`w-full sm:w-auto shrink-0 px-5 py-2 rounded-lg font-semibold transition-colors duration-200 shadow-sm ${
              hasPendingChanges && !isSaving
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      {!targetUserId && (
        <p className="text-red-700 font-bold"> Error: No User ID provided in the URL. </p>
      )}
      {loading && <p>Loading attributes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {isReady && !error && attributes.length > 0 && userAttributes?.length === 0 && (
          <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert" >
            ⚠️ This user currently has no attributes assigned Check the Allowed Attributes Tab below to grant access.
          </div>
        )}

      {/* New component code */}
      <div className="w-full">
        {/* User personal info card */}

        {activeSection === "General Info" && (
          <>
            <main className="flex-1 pt-0 px-1 sm:px-2 md:px-3 pb-3 md:pb-4">
              <div className="w-full">
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                  </div>
                </div>

                {/* Form Fields - Updated with State and Handlers */}
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4" onSubmit={(e) => e.preventDefault()}>
                  <Input label="Full Name" name="cFull_name" value={formData.cFull_name} onChange={handleInputChange} type="text" />
                  <Input label="Email" name="cEmail" value={formData.cEmail} onChange={handleInputChange} type="input" />
                  <Input label="Password" name="cPassword" value={formData.cPassword} onChange={handleInputChange} type="input" />
                  <Input label="Business Phone Number" name="i_bPhone_no" value={formData.i_bPhone_no} onChange={handleInputChange} type="number" />
                  <Input label="Personal phone Number" name="iphone_no" value={formData.iphone_no} onChange={handleInputChange} type="phone" />
                  <Input label="Job Title" name="cjob_title" value={formData.cjob_title} onChange={handleInputChange} />

                  <div>
                    <label className="block text-black text-sm mb-1">Role</label>
                    <select name="irole_id" value={formData.irole_id || ""} onChange={handleInputChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400" >
                        <option value="">Select Role</option>
                          {Array.isArray(roles) && roles.map((role) => (
                        <option key={role.irole_id} value={role.irole_id}> {role.cRole_name} </option>
                      ))}
                    </select>
                  </div>
                
                <div>
                  <label className="block text-black text-sm mb-1">Reports To</label>
                  <select
                    name="reports_to"
                    value={formData.reports_to || ""}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select Manager</option>

                    {companyUsers
                      .filter(u => u.iUser_id !== targetUserId)
                      .map((u) => (
                        <option key={u.iUser_id} value={u.iUser_id}>
                          {u.cFull_name}
                        </option>
                      ))}
                  </select>

                </div>
                  <div className="col-span-1">
                    <label className="block text-black text-sm mb-1">Active status</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.bactive ? "Yes" : "No"}
                        readOnly
                        className={ formData.bactive
                            ? "w-full border border-green-400 bg-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            : "w-full border bg-red-500 border-red-200 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        }
                      />
                      <button
                        type="button"
                        onClick={handleStatusAction}
                        disabled={!targetUserId}
                        className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          formData.bactive
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {formData.bactive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </main>
          </>
        )}
       
      {/* Attribute List Section */}
      {activeSection === "Allowed Attributes" && (
        <div className="flex flex-col flex-1 px-4 py-3 md:px-6 md:py-4 space-y-4">
          {/* Info message for new users */}
          {isReady && userAttributes.length === 0 && (
            <div className="p-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
              ⚠️ This user currently has no attributes assigned. Check the boxes below to grant access.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
            {isReady &&
              Object.entries(
                attributes
                .filter(attr => attr.bactive === true && attr.module_table?.bactive === true)
                .reduce((acc, attr) => {
                  if (!acc[attr.module_table.cmodule_name])
                    acc[attr.module_table.cmodule_name] = [];
                  acc[attr.module_table.cmodule_name].push(attr);
                  return acc;
                }, {})
              ).map(([moduleName, moduleAttributes]) => (
                <div key={moduleName} className="mb-4">
                  <button
                    type="button"
                    onClick={() => toggleModule(moduleName)}
                    className="mb-3 flex w-full items-start gap-2 border-b pb-2 text-left text-gray-800 sm:items-center"
                  >
                    <ChevronRight
                      className={`h-5 w-5 shrink-0 transition-transform ${openModules[moduleName] ? "rotate-90" : "rotate-0"}`}
                    />
                    <span className="text-sm sm:text-base">Module</span>
                    <span>-</span>
                    <span className="font-bold text-lg sm:text-xl break-words">{moduleName}</span>
                  </button>
                    {openModules[moduleName] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-2">
                      {moduleAttributes.map((attr) => {
                        const isChecked = stagedAttributes[attr.iattribute_id] || false;
                        const userHasAccess = userAttributes.find(uAttr => uAttr.iattribute_id === attr.iattribute_id);
                        
                        return (
                          <label key={attr.iattribute_id} className="flex min-w-0 items-center gap-2 border px-2 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors min-h-[44px]" >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={!isReady || isSaving}
                              onChange={(e) => {
                                handleCheckboxChange(attr.iattribute_id, e.target.checked);
                              }}
                              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="flex-1 text-sm text-black font-medium leading-snug"> {attr.cattribute_name}  </span>
                            {isChecked && (
                              <BadgeCheck
                                className="h-9 w-9 shrink-0 fill-green-700 text-white"
                                aria-label="Access granted"
                                title="Access granted"
                                strokeWidth={2.25}
                              />
                            )}
                            {userHasAccess && !isChecked && (
                              <XCircle
                                className="h-5 w-5 shrink-0 text-red-500"
                                aria-label="Access revoked"
                                title="Access revoked"
                                strokeWidth={2.25}
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>
                    )}
                </div>
              ))}
          </div>
        </div>
      )}
   
        {/* User related settings */}
        {activeSection === "User Settings" && (
          <div className="mt-6 flex-1 p-6 ">
            <div className="mt-6 flex-1 p-6">
              {[ "isMailActive", "isPhoneActive", "isWebsiteActive", "isWhatsappActive",
              ].map((key) => (
                <ToggleSection key={key} label={key.replace("is", "")} name={key} value={userSettings[key]} onChange={(name, status) =>
                    setUserSettings((prev) => ({ ...prev, [name]: status }))
                  }
                />
              ))}

              <div className="mt-4">
                <button onClick={() => { const isChanged = changeUserSettingsStatus( JSON.stringify(userSettings) );
                    if (isChanged) {
                      showToast("success", "Settings updated successfully!");
                    }
                    else {
                      showToast("info", "No changes detected.");
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-ie rounded-lg hover:bg-blue-700"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function SidebarItem({ icon, text, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 cursor-pointer transition px-3 sm:px-4 py-2 rounded-lg border text-sm sm:text-base
     ${ active ? "border-blue-600 bg-blue-700 text-white" : "border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300" }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="font-medium text-center">{text}</span>
    </button>
  );
}

function Input({ label,
  value = "",
  type = "text",
  readOnly = "no",
  name,       
  onChange,   
  className = "w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400",
}) {
  return (
    <div className="col-span-1">
      <label className="block text-black text-sm mb-1">{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} className={className} readOnly={readOnly === "yes"} />
    </div>
  );
}

export default CompanyUser;







