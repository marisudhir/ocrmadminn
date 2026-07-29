import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, Select, MenuItem } from "@mui/material";
import ToggleButton from '../../components/ToggleSwitch';
import Collapsible from '../../components/Collipsable';
import { useCompanyController } from './companyController';
import * as companyModel from './companyModel';
import DefaultEmailAccountSection from './CompanyEmailAccountSettings';

//General Settings Section 
const GeneralSettingsSection = ({ formData, handleChange, settings, company }) => {
  const [localSettings, setLocalSettings] = useState(settings || {});
  const { changeSettingsStatus } = useCompanyController();

  const handleToggleChange = (name, status, data) => {
    setLocalSettings((prev) => {
      const updated = { ...prev };
      if (data.sub_name) {
        updated[data.sub_name] = {
          ...updated[data.sub_name],
          [name]: status,
        };
      } else {
        updated[name] = status;
      }
      changeSettingsStatus(JSON.stringify(updated), data.companyId);
      return updated;
    });
  };

  const ToggleSection = ({ label, status, name, companyId, sub_name, className = "", labelClassName = "text-gray-800" }) => (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <Typography
        className={labelClassName}
        sx={{
          fontWeight: labelClassName.includes("font-bold") ? 700 : 400,
          color: labelClassName.includes("text-gray-900") ? "#111827" : "#1f2937"
        }}
      >
        {label}
      </Typography>
      <ToggleButton
        status={status}
        name={name}
        data={{ companyId, sub_name }}
        onToggle={handleToggleChange}
      />
    </div>
  );

  return (
    <>
      <div className="mt-2">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row justify-between items-start sm:items-center xl:items-start 2xl:items-center gap-3 p-1">
            <Box className="min-w-0">
              <Typography variant="subtitle1" className="font-semibold text-gray-900" sx={{ fontWeight: 700, color: "#111827" }}>
                Account Status
              </Typography>
              <Typography variant="body2" className="text-black mt-1" sx={{ color: "#000" }}>
                Define the current state of the company account.
              </Typography>
            </Box>
            <FormControl variant="outlined" sx={{ minWidth: 140, width: { xs: "100%", sm: "auto" } }}>
              <Select
                name="status"
                value={formData.status || (company?.bactive ? "active" : "inactive")}
                onChange={handleChange}
                size="small"
                sx={{ color: "#000" }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="trial">Trial</MenuItem>
              </Select>
            </FormControl>
          </div>

          <ToggleSection
            label="DCRM"
            status={localSettings.DCRM}
            name="DCRM"
            companyId={company?.iCompany_id}
            className="p-1"
            labelClassName="font-bold text-gray-800"
          />

          <ToggleSection
            label="Email Access"
            status={localSettings.Email}
            name="Email"
            companyId={company?.iCompany_id}
            className="p-1"
            labelClassName="font-bold text-gray-800"
          />
        </div>

        
        {/* Collapsible Reports */}
        <Collapsible title="Report" className="mt-5 text-grey-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
             <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <ToggleSection label="Lead lost" status={localSettings?.Reports?.LostLeadReport} name="LostLeadReport" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Sales by stage" status={localSettings.Reports?.SalesStageReport} name="SalesStageReport" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Lead by territory" status={localSettings.Reports?.TerritoryLeadReport} name="TerritoryLeadReport" sub_name="Reports" companyId={company?.iCompany_id} />
          {/* <ToggleSection label="Lead conversion" status={localSettings.Reports?.LeadConversionReport} name="LeadConversionReport" sub_name="Reports" companyId={company?.iCompany_id} /> */}
          {/* <ToggleSection label="Lead owner activity" status={localSettings.Reports?.LeadOwnerActivityReport} name="LeadOwnerActivityReport" sub_name="Reports" companyId={company?.iCompany_id} /> */}
          <ToggleSection label="Prospects lost lead" status={localSettings.Reports?.ProspectsLostLeadsReport} name="ProspectsLostLeadsReport" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Company Overall report" status={localSettings.Reports?.CompanyOverallReport} name="CompanyOverallReport" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Website Lead Assignment Logs" status={localSettings.Reports?.WebsiteLeadAssignmentLogsReport} name="WebsiteLeadAssignmentLogsReport" sub_name="Reports" companyId={company?.iCompany_id} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {/* <ToggleSection label="Sales Pipeline" status={localSettings.Reports?.SalesPipelineReport} name="SalesPipelineReport" sub_name="Reports" companyId={company?.iCompany_id} /> */}
          <ToggleSection label="Sales Target vs Achievement" status={localSettings.Reports?.SalesTargetAchievement} name="SalesTargetAchievement" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Salesperson Performance" status={localSettings.Reports?.SalespersonPerformance} name="SalespersonPerformance" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Lead Source Performance" status={localSettings.Reports?.LeadSourcePerformance} name="LeadSourcePerformance" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Revenue Breakdown" status={localSettings.Reports?.RevenueBreakdown} name="RevenueBreakdown" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Customer Sales History" status={localSettings.Reports?.CustomerSalesHistory} name="CustomerSalesHistory" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Call Logs Report" status={localSettings.Reports?.CallLogsReport} name="CallLogsReport" sub_name="Reports" companyId={company?.iCompany_id} />
          <ToggleSection label="Receivable Report" status={localSettings.Reports?.ReceivableReport} name="ReceivableReport" sub_name="Reports" companyId={company?.iCompany_id} />
          </div>
          </div>
        </Collapsible>

        {/* Collapsible Masters */}
        <Collapsible title="Master" className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
             <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <ToggleSection label="Status master" status={localSettings.Masters?.StatusMaster} name="StatusMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Potential master" status={localSettings.Masters?.PotentialMaster} name="PotentialMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Industry master" status={localSettings.Masters?.IndustryMaster} name="IndustryMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Lead source master" status={localSettings.Masters?.SourceMaster} name="SourceMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Service master" status={localSettings.Masters?.ServiceMaster} name="ServiceMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Proposal send mode master" status={localSettings.Masters?.ProposalModeMaster} name="ProposalModeMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <ToggleSection label="Email template master" status={localSettings.Masters?.EmailTemplateMaster} name="EmailTemplateMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Lead Lost reason" status={localSettings.Masters?.LeasLostReasonMaster} name="LeasLostReasonMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          {/* <ToggleSection label="Currency master" status={localSettings.Masters?.CurrencyMaster} name="CurrencyMaster" sub_name="Masters" companyId={company?.iCompany_id} /> */}
          <ToggleSection label="Sub Industry master" status={localSettings.Masters?.SubIndustryMaster} name="SubIndustryMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Sub Source master" status={localSettings.Masters?.SubSourceMaster} name="SubSourceMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Sub Service master" status={localSettings.Masters?.SubServiceMaster} name="SubServiceMaster" sub_name="Masters" companyId={company?.iCompany_id} />
          <ToggleSection label="Bank Account master" status={localSettings.Masters?.BankAccountMaster} name="BankAccountMaster" sub_name="Masters" companyId={company?.iCompany_id} />


         </div>
          </div>
        
        </Collapsible>
      </div>
    </>
  );
};

// Main Component 
const GeneralSettingsTab = ({
  company,
  openCompanyStatusDialog,
  handleCloseCompanyStatusDialog,
  handleToggleCompanyStatus,
}) => {
  const [generalSettingsFormData, setGeneralSettingsFormData] = useState({
    status: company?.bactive ? "active" : "inactive",
  });

  const handleGeneralSettingsChange = useCallback(async (e) => {
    const { name, value } = e.target;
    setGeneralSettingsFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "status" && company?.iCompany_id) {
      try {
        const bactive = value === "active" || value === "trial";
        const updateData = {
          bactive: bactive,
          cCompany_name: company.cCompany_name || "",
        };
        await companyModel.editCompany(updateData, company.iCompany_id);
      } catch (error) {
        console.error("❌ Failed to update company status:", error);
      }
    }
  }, [company]);

  return (
    <Box className="space-y-8">
      {/*  Status and Toggles Section */}
      <GeneralSettingsSection
        formData={generalSettingsFormData}
        handleChange={handleGeneralSettingsChange}
        settings={company?.companySettings}
        company={company}
      />

      <Divider sx={{ my: 4 }} />

      {/*  NDefault Email Account Section  */}
      <DefaultEmailAccountSection company={company} />

      <Divider sx={{ my: 4 }} />

      {/* 3. Confirmation Dialog */}
      <Dialog open={openCompanyStatusDialog} onClose={handleCloseCompanyStatusDialog}>
        <DialogTitle className="text-xl font-bold text-gray-900">
          Confirm Company {company?.bactive ? "Deactivation" : "Activation"}
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to {company?.bactive ? "deactivate" : "activate"} the company: <span className="font-semibold">{company?.cCompany_name}</span>?
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseCompanyStatusDialog} color="primary" variant="outlined">
            No
          </Button>
          <Button
            onClick={handleToggleCompanyStatus}
            color={company?.bactive ? "error" : "success"}
            variant="contained"
            sx={{
              bgcolor: company?.bactive ? "red.600" : "green.600",
              "&:hover": { bgcolor: company?.bactive ? "red.700" : "green.700" },
              color: "white",
            }}
          >
            Yes, {company?.bactive ? "Deactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GeneralSettingsTab;


