// UserAttributeAccess.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { useCompanyController } from "../../admin/pages/Company/companyController";
import * as companyModel from "../../admin/pages/Company/companyModel";

const UserAttributeAccess = ({ userId, userName, companyId }) => {
  const {
    fetchAttributes,
    fetchUserAttributes,
    attributes,
    userAttributes,
    loading,
  } = useCompanyController();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stagedAttributes, setStagedAttributes] = useState({});
  const [internalLoading, setInternalLoading] = useState(false);

  // Load attributes and user attributes when dialog opens
  useEffect(() => {
    if (open && userId && companyId) {
      loadAttributes();
    }
  }, [open, userId, companyId]);

  const loadAttributes = async () => {
    setInternalLoading(true);
    setError("");
    try {
      await fetchAttributes(companyId);
      await fetchUserAttributes(userId);
    } catch (err) {
      setError("Failed to load attributes");
      console.error("Error loading attributes:", err);
    } finally {
      setInternalLoading(false);
    }
  };

  // Initialize staged attributes when userAttributes are loaded
  useEffect(() => {
    if (attributes.length > 0 && userAttributes.length >= 0 && open) {
      const initialStaged = {};
      
      console.log('Initializing staged attributes in dialog:', {
        attributesCount: attributes.length,
        userAttributesCount: userAttributes.length
      });
      
      // For ALL attributes, set initial state
      attributes.forEach(attr => {
        // Find if user has this attribute and if it's active
        const userAttr = userAttributes.find(uAttr => 
          uAttr.iattribute_id === attr.iattribute_id
        );
        // Set to true only if user has the attribute AND it's active
        initialStaged[attr.iattribute_id] = userAttr ? userAttr.bactive === true : false;
        
        console.log(`Dialog - ${attr.cattribute_name}:`, {
          hasAttribute: !!userAttr,
          bactive: userAttr?.bactive,
          checkbox: userAttr ? userAttr.bactive === true : false
        });
      });
            setStagedAttributes(initialStaged);
    }
  }, [attributes, userAttributes, open]);

  const handleCheckboxChange = (attributeId) => (event) => {
    const isChecked = event.target.checked;    
    setStagedAttributes(prev => ({
      ...prev,
      [attributeId]: isChecked
    }));
  };

  const handleSave = async () => {
    if (!userId || !companyId) {
      setError("User ID and Company ID are required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    
    try {

      await companyModel.applyUserAttributeChanges(
        userId, 
        stagedAttributes, 
        userAttributes
      );
      
      setSuccess("User attribute access updated successfully!");
      
      // Reload user attributes to reflect changes
      await fetchUserAttributes(userId);
      
    } catch (err) {
      setError("Failed to update attribute access");
      console.error("Error updating attributes:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleOpen = () => {
    if (!userId || !companyId) {
      setError("User ID and Company ID are required to open attribute access");
      return;
    }
    setOpen(true);
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const groupedAttributes = attributes.reduce((acc, attribute) => {
    const moduleName = attribute.module_table?.cmodule_name || "Other";
    if (!acc[moduleName]) {
      acc[moduleName] = [];
    }
    acc[moduleName].push(attribute);
    return acc;
  }, {});

  // Get current active attributes count for the badge
  const activeAttributesCount = Object.values(stagedAttributes).filter(status => status).length;

  return (
    <>
      {/* Button to open attribute access dialog */}
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        disabled={!userId || !companyId}
        startIcon={
          <Chip 
            label={activeAttributesCount} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        }
      >
        Attribute Access
        {(!userId || !companyId) && " (Missing ID)"}
      </Button>

      {/* Attribute Access Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Attribute Access for {userName}
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <Chip 
                label={`${activeAttributesCount}/${attributes.length} Active`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`User: ${userId}`}
                size="small"
                variant="outlined"
              />
              <Chip 
                label={`Company: ${companyId}`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {(loading || internalLoading) ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ✅ Checked = User has access to this attribute
                <br />
                ❌ Unchecked = User does not have access
              </Typography>

              {Object.entries(groupedAttributes).map(([moduleName, moduleAttributes]) => (
                <Paper key={moduleName} sx={{ mb: 3, p: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2, 
                      pb: 1, 
                      borderBottom: 1, 
                      borderColor: 'divider',
                      color: 'primary.main'
                    }}
                  >
                    {moduleName} ({moduleAttributes.length} attributes)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {moduleAttributes.map((attribute) => {
                      const isChecked = stagedAttributes[attribute.iattribute_id] || false;
                      const userHasAttribute = userAttributes.find(
                        uAttr => uAttr.iattribute_id === attribute.iattribute_id
                      );
                      
                      return (
                        <FormControlLabel
                          key={attribute.iattribute_id}
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={handleCheckboxChange(attribute.iattribute_id)}
                              color="primary"
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {attribute.cattribute_name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {userHasAttribute ? 
                                  `Currently: ${userHasAttribute.bactive ? 'Enabled' : 'Disabled'}` : 
                                  'Not assigned'
                                }
                              </Typography>
                            </Box>
                          }
                          sx={{
                            minWidth: '200px',
                            border: 1,
                            borderColor: isChecked ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            p: 1,
                            m: 0,
                            flex: '1 1 calc(33.333% - 16px)',
                            backgroundColor: isChecked ? 'primary.light' : 'background.paper',
                            '&:hover': {
                              backgroundColor: isChecked ? 'primary.light' : 'action.hover',
                            }
                          }}
                        />
                      );
                    })}
                  </Box>
                </Paper>
              ))}
              
              {attributes.length === 0 && !loading && (
                <Typography color="text.secondary" textAlign="center" py={3}>
                  No attributes available for this company
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={saving || loading || internalLoading}
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            {saving ? "Saving Changes..." : "Save Access Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserAttributeAccess;