import React, { useState, useEffect, useReducer, useCallback, useMemo } from "react";
import { Box, Tabs, Tab, Button, TextField, IconButton, Typography, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import * as z from "zod";
import { useCompanyController } from "./companyController";

const validationSchema = z.object({
  name: z.string().min(1, "Name is required").max(70, "Name cannot exceed 70 characters"),
  email: z.string().max(70, "Email cannot exceed 70 characters").email("Invalid email format").refine((val) => val.includes('@'), "Email must contain @"),
  appPassword: z.string().length(17, "Password must be exactly 17 characters without spaces").regex(/^\S*$/, "Spaces are not allowed"), // Secondary check
  host: z.string().max(100, "Max 100 characters").regex(/^[a-zA-Z0-9.-]+$/, "Invalid Host format (e.g., smtp.gmail.com)").optional().or(z.literal("")),
  port: z.string().refine(val => {
      if (val === "") return true;
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1 && num <= 65535;
    }, "Invalid port (1-65535)")
    .optional(),
  server: z.string().max(100, "Max 100 characters") .optional().or(z.literal("")),
});

const emailFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, formData: { ...state.formData, [action.field]: action.value } };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "RESET_FORM":
      return { formData: action.payload, errors: {} };
    default:
      return state;
  }
};

const DefaultEmailAccountSection = ({ company }) => {
  const { createSmtpSettings, fetchSmtpSettings, updateSmtpSettings } = useCompanyController();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [hasExistingData, setHasExistingData] = useState(false);

  const initialState = {
    formData: { name: "", email: "", appPassword: "", host: "", port: "", server: "" },
    errors: {},
  };

  const [state, dispatch] = useReducer(emailFormReducer, initialState);
  const { formData, errors } = state;

  const loadData = useCallback(async () => {
  const targetId = company?.iCompany_id;
  if (!targetId) return;

  try {
    const res = await fetchSmtpSettings(targetId); 
    const smtpData = res?.data || res; 

    if (smtpData && typeof smtpData === 'object' && smtpData.icompany_id) { 
      setHasExistingData(true); 
      dispatch({
        type: "RESET_FORM",
        payload: {
          name: smtpData.csmtp_name || "",
          email: smtpData.csmtp_email || "",
          appPassword: smtpData.csmtp_password || "",
          host: smtpData.csmtp_host || "",
          port: smtpData.ismtp_port ? smtpData.ismtp_port.toString() : "",
          server: smtpData.csmtp_server || "",
        },
      });
      setIsEditing(false);
    } else {
      setHasExistingData(false);
      setIsEditing(true); 
    }
  } catch (err) {
    setHasExistingData(false);
    setIsEditing(true);
  }
}, [fetchSmtpSettings, company?.iCompany_id]);


  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
    if (errors[name]) {
      dispatch({ type: "SET_ERRORS", errors: { ...errors, [name]: undefined } });
    }
  }, [errors]);

  const validateForm = () => {
    const validationData = {
      ...formData,
      port: formData.port ? formData.port : ""
    };
    const parsed = validationSchema.safeParse(validationData);
    if (!parsed.success) {
      const errs = {};
      parsed.error.issues.forEach(issue => { errs[issue.path[0]] = issue.message; });
      dispatch({ type: "SET_ERRORS", errors: errs });
      return false;
    }
    return true;
  };

  const handleSaveAll = async () => {
  if (!validateForm()) return;
  setIsSaving(true); 
  
  const targetId = company?.iCompany_id;
  
  const payload = {
    smtp_name: formData.name,
    smtp_email: formData.email,
    smtp_password: formData.appPassword,
    smtp_host: formData.host || null,
    smtp_port: formData.port ? Number(formData.port) : null,
    smtp_server: formData.server || null,
  };

  try {
    if (hasExistingData) {
      await updateSmtpSettings(targetId, payload); 
      setSaveMessage({ type: "success", text: "Settings updated successfully" });
    } else {
      console.log("Creating new record for company:", targetId);
      await createSmtpSettings({ ...payload, company_id: targetId }); 
      setSaveMessage({ type: "success", text: "Settings saved successfully" });
    }
    
    setIsEditing(false);
    loadData(); 
    setTimeout(() => {
      setSaveMessage({ type: '', text: '' });
    }, 1000); // 3 seconds
  } catch (err) {
    console.error("Save Error:", err);
    setSaveMessage({ type: "error", text: "Failed to process request" });
    setTimeout(() => {
      setSaveMessage({ type: '', text: '' });
    }, 5000);
  } finally {
    setIsSaving(false);
  }
};


  const handleEditToggle = () => {
    if (isEditing) {
      loadData();
    }
    setIsEditing(!isEditing);
    dispatch({ type: "SET_ERRORS", errors: {} });
  };

  const FormRow = useMemo(() => 
  React.memo(({ label, name, value, isPassword = false, isRequired = true }) => {
    const [localShow, setLocalShow] = useState(false);

    return (
      <div className="flex items-center mb-4 last:mb-0">
        <Typography className="w-40 text-sm font-bold text-gray-700 flex-shrink-0">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </Typography>
        
        <div className="flex-grow relative flex items-center">
          {isEditing ? (
            <TextField
              fullWidth size="small" name={name} value={value}
              type={isPassword && !localShow ? "password" : "text"}
              onChange={handleChange} error={!!errors[name]} helperText={errors[name] || ""}
              InputProps={isPassword ? {
                endAdornment: (
                  <IconButton onClick={() => setLocalShow(!localShow)} size="small">
                    {localShow ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </IconButton>
                )
              } : null}
            />
          ) : (
            <div className="flex-grow flex items-center justify-between py-2 px-3 bg-gray-50 rounded border border-gray-200 min-h-[40px]">
              <Typography className="font-medium text-gray-800">
                {isPassword 
                  ? (localShow ? value : "********") 
                  : (value || (isRequired ? "-" : "Not set"))
                }
              </Typography>
              
              {isPassword && (
                <IconButton onClick={() => setLocalShow(!localShow)} size="small" className="ml-2">
                  {localShow ? <EyeSlashIcon className="h-4 w-4 text-gray-500" /> : <EyeIcon className="h-4 w-4 text-gray-500" />}
                </IconButton>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }), [isEditing, errors, handleChange]);

  return (
    <Box className="bg-white rounded-xl border border-gray-200 p-6 mt-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="font-bold">Default Email Account</Typography>
        <div className="flex gap-2">
          {isEditing && (
            <Button variant="outlined" onClick={handleEditToggle} disabled={isSaving}>Cancel</Button>
          )}
          <Button 
            variant={isEditing ? "contained" : "outlined"} 
            onClick={isEditing ? handleSaveAll : handleEditToggle}
            startIcon={!isEditing && <EditIcon />}
            disabled={isSaving}
          >
            {isEditing ? (isSaving ? "Saving..." : "Save") : "Edit"}
          </Button>
        </div>
      </div>

      {saveMessage.text && (
        <Alert severity={saveMessage.type} sx={{ mb: 3 }} onClose={() => setSaveMessage({ type: '', text: '' })}>
          {saveMessage.text}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ 
        mb: 4, 
        borderBottom: 1, 
        borderColor: 'divider',
        '& .MuiTab-root': { // Targets all tabs
          fontWeight: '700', // Bold
          fontSize: '1rem',
          textTransform: 'none', // Prevents all-caps if MUI default is on
        },
        '& .Mui-selected': { // Specifically for the active tab
          color: '#1976d2', // Primary blue or your theme color
        }
      }}>
        <Tab label="Email Setting" />
        <Tab label="SMTP Setting (Optional)" />
      </Tabs>

      <Box sx={{ maxWidth: '600px' }}>
        {tabValue === 0 ? (
          <>
            <FormRow label="Name" name="name" value={formData.name} />
            <FormRow label="Email Address" name="email" value={formData.email} />
            <FormRow label="App Password" name="appPassword" value={formData.appPassword} isPassword />
          </>
        ) : (
          <>
            <FormRow label="Host" name="host" value={formData.host} isRequired={false} />
            <FormRow label="Port" name="port" value={formData.port} isRequired={false} />
            <FormRow label="Server" name="server" value={formData.server} isRequired={false} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default DefaultEmailAccountSection;