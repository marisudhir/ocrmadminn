import {
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Menu,
  MenuItem,
  TextField,
  Autocomplete,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import StoreIcon from "@mui/icons-material/Store";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import BadgeIcon from "@mui/icons-material/Badge";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useCompanyController } from "./companyController";
import { useSharedController } from "../../api/shared/controller";
import formatDate from "../../utils/formatDate";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import GeneralSettingsTab from "./GeneralSettingsTab";
import CompanyUser from "./companyUser.jsx";
import LeadStatus from "../Masters/Status/leadStauts.jsx";
import LeadPotential from "../Masters/Potential/leadPotential.jsx";
import LeadSource from "../Masters/Source/leadSource.jsx";
import LeadIndustry from "../Masters/Industry/industry.jsx";
import DistrictMaster from "../Masters/district/districtMasters.jsx";
import DurationMaster from "../Masters/Duration-master/durationMaster.jsx";
import CountryMaster from "../Masters/country/countryMaster.jsx";
// import StateMaster from "../Masters/States/StateMaster.jsx"
import CurrencyMaster from "../Masters/currency/currencyMaster.jsx";
import AuditLoginTab from "./AuditLoginTab";
import { useToast } from "../../../context/ToastContext.jsx";
import LeadServices from "../Masters/Services/Services.jsx";
import SubIndustry from "../Masters/Sub-Industry/SubIndustry.jsx";
import SubService from "../Masters/Sub-service/SubService.jsx";
import SubSource from "../Masters/Sub-source/SubSource.jsx";
import ProposalSentMode from "../Masters/Proposal Sent Mode/proposalSentMode.jsx";
import { Crown, Check, X } from "lucide-react";
import { LeadLostReason } from "../Masters/lead_lost_reason/lead_lost_reason_component.jsx";
import CommonTable from "../../context/TableStructure/CommonTable.jsx";
import Pagination from "../../context/Pagination/pagination.jsx";
import usePagination from "../../hooks/usePagination.jsx";
import CommonSearchBar from "../../context/commonsearchbar/searchbar.jsx";
import CommonBackButton from "../../context/commonbutton/CommonBackButton.jsx";

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

// A simple panel component to show content based on active tab
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const companyProfileTabLabelClassName =
  "text-sm md:text-base font-semibold";

const MasterDataPanel = ({ companyData }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  // const companyId = useMemo(() => companyData?.iCompany_id, [companyData?.iCompany_id]);
  const cardData = [
    {
      id: 1,
      title: "Lead Status",
      description: "Current stage of the lead.",
      icon: "/icons/status.svg",
      component: "LeadStatus",
    },
    {
      id: 2,
      title: "Lead Potential",
      description: "Business value of the lead.",
      icon: "/icons/progress.svg",
      component: "LeadPotential",
    },
    {
      id: 3,
      title: "Lead Source",
      description: "Business value of the lead.",
      icon: "/icons/source.svg",
      component: "LeadSource",
    },
    {
      id: 13,
      title: "Sub Lead Source",
      description: "Sub categories for lead source",
      icon: "/icons/source.svg",
      component: "sub-source",
    },
    {
      id: 4,
      title: "Lead Industry",
      description: "Business value of the lead.",
      icon: "/icons/industry.svg",
      component: "LeadIndustry",
    },
    {
      id: 14,
      title: "Sub Industry",
      description: "Sub industries",
      icon: "/icons/industry.svg",
      component: "sub-industry",
    },
    {
      id: 8,
      title: "Service",
      description: "List of services",
      icon: "/icons/industrial-park.svg",
      component: "services",
    },
    {
      id: 15,
      title: "Sub Service",
      description: "Sub services",
      icon: "/icons/industrial-park.svg",
      component: "sub-service",
    },
    {
      id: 11,
      title: "Proposal Sent Mode",
      description: "proposal modes like email, whatsapp etc",
      icon: "/icons/proposal_send_mode.svg",
      component: "proposal-sent-mode",
    },
    {
      id: 12,
      title: "Lead Lost Reason",
      description:
        "Lead lost resaon is for adding the lost reason of the lead ",
      icon: "/icons/lost.svg",
      component: "lead-lost-reason",
    },
  ];

  const renderComponent = () => {
    switch (selectedComponent) {
      case "LeadStatus":
        return <LeadStatus companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "LeadPotential":
        return <LeadPotential companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "LeadSource":
        return <LeadSource companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "sub-source":
        return <SubSource companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "LeadIndustry":
        return <LeadIndustry companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "sub-industry":
        return <SubIndustry companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "district":
        return <DistrictMaster />;
      case "country":
        return <CountryMaster />;
      case "state":
        return <StateMaster />;
      case "currency":
        return <CurrencyMaster />;
      case "services":
        return <LeadServices companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "sub-service":
        return <SubService companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "duration":
        return <DurationMaster />;
      case "proposal-sent-mode":
        return <ProposalSentMode companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      case "lead-lost-reason":
        return <LeadLostReason companyId={companyData?.iCompany_id} onBack={() => setSelectedComponent(null)} />;
      default:
        return null;
    }
  };

  if (selectedComponent) {
    return (
      <div className="pt-0">
        {renderComponent()}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {cardData.map((card) => (
        <button
          key={card.id}
          onClick={() => setSelectedComponent(card.component)}
          className="text-left group w-full"
        >
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition transform group-hover:-translate-y-1 border border-gray-200 h-full flex flex-col justify-between">
            <div className="flex items-start mb-4">
              <img
                src={card.icon}
                alt={card.title}
                className="w-10 h-10 mr-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">
                {" "}
                {card.title}{" "}
              </h3>
            </div>
            <p className="text-sm text-gray-600">{card.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

const CompanyProfile = () => {

 const BASE_URL = import.meta.env.VITE_API_URL;
 const NO_API_URL = import.meta.env.VITE_NO_API_URL;
  const navigate = useNavigate();
  const {
    fetchCompanyDataById,
    usersByCompany,
    changeUserStatus,
    editCompanyDetails,
    fetchUsersByCompanyId,
    error,
    createUser,
    loading,
    fetchAdditionalData,
    currencies,
    bussiness,
    pricingPlans,
    storageDetailsController,
    fetchAllPricingPlans,
    fetchAllCurrencies,
    fetchBussinessType,
    storageDetails,
  } = useCompanyController();

  const userColumns = [
    {
      header: "User Name",
      render: (row) => row.cFull_name,
    },
    {
      header: "Email",
      render: (row) => row.cEmail,
    },
    {
      header: "Job Title",
      render: (row) => row.role,
    },
    {
      header: "Created At",
      render: (row) =>
        new Date(row.dCreate_dt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 inline-flex text-xs font-semibold rounded-full ${
            row.bactive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.bactive ? "Active" : "Deactivated"}
        </span>
      ),
    },
  ];

  const { fetchAllCities, cities, fetchRoles, roles } = useSharedController();
  const { showToast } = useToast();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  // const [currentPage, setCurrentPage] = useState(1);
  // const usersPerPage = 10;
  const [dialogBusinessTypes, setDialogBusinessTypes] = useState([]);
  const [loadingEditData, setLoadingEditData] = useState(false);

  // States
  const [errors, setErrors] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openUserCreateDialog, setOpenUserCreateDialog] = useState(false);
  const [editCompanyData, setEditCompanyData] = useState({});
  const [openUserStatusDialog, setOpenUserStatusDialog] = useState(false);
  const [userToModify, setUserToModify] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popup, setPopup] = useState({
    open: false,
    message: "",
    type: "error", // success | error
  });
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const [userFormData, setUserFormData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
    jobTitle: "",
    businessPhone: "",
    personalPhone: "",
    role: "",
    reporting: "",
  });

  const { id } = useParams();
  const PLACE_TYPE_ENUM = {
    India: "National",
    International: "International",
  };

  // Validation function for company
  const validateCompanyData = (data) => {
    const errors = {};
    const isNational = data.ePlace_type === PLACE_TYPE_ENUM.India;

    // Helper to check if string or number is empty
    const isValueEmpty = (val) => {
      if (val === null || val === undefined) return true;
      return val.toString().trim() === "";
    };

    if (isValueEmpty(data.cCompany_name))
      errors.cCompany_name = "Company name is required";
    if (isValueEmpty(data.iPhone_no))
      errors.iPhone_no = "Phone number is required";
    if (isValueEmpty(data.cemail_address))
      errors.cemail_address = "Email is required";
    if (isValueEmpty(data.caddress1))
      errors.caddress1 = "Address Line 1 is required";
    if (!data.iUser_no || isNaN(data.iUser_no))
      errors.iUser_no = "Valid user count is required";
    if (!data.icity_id) errors.icity_id = "City is required";

    if (isNational) {
      if (isValueEmpty(data.cGst_no))
        errors.cGst_no = "GST Number is required for Indian companies";
      if (isValueEmpty(data.icin_no))
        errors.icin_no = "CIN Number is required for Indian companies";
      if (isValueEmpty(data.cPan_no))
        errors.cPan_no = "PAN Number is required for Indian companies";
    }
    return errors;
  };
  // const validateCompanyData = (data) => {
  //   const errors = {};
  //   const isNational = data.ePlace_type === PLACE_TYPE_ENUM.India;
  //   if (!data.cCompany_name?.trim()) errors.cCompany_name = "Company name is required";
  //   if (!data.iPhone_no?.trim()) errors.iPhone_no = "Phone number is required";
  //   if (!data.cemail_address?.trim()) errors.cemail_address = "Email is required";
  //   if (!data.cGst_no?.trim()) errors.cGst_no = "GST Number is required";
  //   if (!data.icin_no?.trim()) errors.icin_no = "CIN Number is required";
  //   if (!data.caddress1?.trim()) errors.caddress1 = "Address Line 1 is required";
  //   if (!data.iUser_no || isNaN(data.iUser_no)) errors.iUser_no = "Valid user count is required";
  //   if (!data.icity_id) errors.icity_id = "City is required";
  //   if (isNational) {
  //     if (!data.cGst_no?.trim()) errors.cGst_no = "GST Number is required for Indian companies";
  //     if (!data.icin_no?.trim()) errors.icin_no = "CIN Number is required for Indian companies";
  //     if (!data.cPan_no?.trim()) errors.cPan_no = "PAN Number is required for Indian companies";
  //   }
  //   return errors;
  // };

  // Validation function for users
  const validateUserForm = () => {
    let newErrors = {};
    const phoneRegex = /^[0-9]{6,15}$/;

    if (!userFormData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userFormData.email)) {
      newErrors.email = "Invalid Email";
    }

    if (!userFormData.fullName) {
      newErrors.fullName = "Full Name is required";
    } else if (userFormData.fullName.length > 30) {
      newErrors.fullName = "Full Name must be 30 characters or less";
    }

    if (!userFormData.username) {
      newErrors.username = "User Name is required";
    } else if (userFormData.username.length > 30) {
      newErrors.username = "Full Name must be 30 characters or less";
    }

    if (!userFormData.password) {
      newErrors.password = "Password is required";
    }

    if (!userFormData.jobTitle) {
      newErrors.jobTitle = "Job title is required";
    } else if (userFormData.jobTitle.length > 25) {
      newErrors.jobTitle = "Job Title must be 25 characters or less";
    }

    if (!userFormData.businessPhone) {
      newErrors.businessPhone = "Business Phone is required";
    } else if (!phoneRegex.test(userFormData.businessPhone)) {
      newErrors.businessPhone = "Business Phone must be 6–15 digits";
    }

    if (!userFormData.personalPhone) {
      newErrors.personalPhone = "Personal Phone is required";
    } else if (!phoneRegex.test(userFormData.personalPhone)) {
      newErrors.personalPhone = "Personal Phone must be 6–15 digits";
    }

    if (!userFormData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleOpenEditDialog = async (company) => {
    if (!company) {
      showToast("error", "Company data not loaded yet");
      return;
    }

    setLoadingEditData(true);
    try {
      // Load all form data and wait for completion
      const results = await Promise.all([
        fetchAllCities(),
        fetchRoles(),
        fetchBussinessType(),
        fetchAllCurrencies(),
        fetchAllPricingPlans(),
      ]);

      // Extract data from results
      const businessTypesResult = results[2];
      const currenciesResult = results[3];
      const pricingPlansResult = results[4];

      // Set the dialog-specific business types
      const loadedBusinessTypes = businessTypesResult || [];
      setDialogBusinessTypes(loadedBusinessTypes);

      // Find the current business type object
      const currentBusinessType =
        loadedBusinessTypes.find((biz) => biz.id === company?.ibusiness_type) ||
        null;

      // SAFELY find current currency object
      let currentCurrency = null;
      if (Array.isArray(currenciesResult)) {
        currentCurrency =
          currenciesResult.find(
            (currency) => currency.icurrency_id === company?.icurrency_id,
          ) || null;
      } else {
        console.warn(
          "⚠️ currencies Result is not an array, trying to extract array:",
          currenciesResult,
        );
        const currenciesArray =
          currenciesResult?.data?.data?.data ||
          currenciesResult?.data?.data ||
          currenciesResult?.data ||
          [];
        if (Array.isArray(currenciesArray)) {
          currentCurrency =
            currenciesArray.find(
              (currency) => currency.icurrency_id === company?.icurrency_id,
            ) || null;
        }
      }

      // SAFELY find current subscription plan object
      let currentSubscriptionPlan = null;
      if (Array.isArray(pricingPlansResult)) {
        currentSubscriptionPlan =
          pricingPlansResult.find(
            (plan) => plan.plan_id === company?.isubscription_plan,
          ) || null;
      } else {
        console.warn(
          "⚠️ pricing Plans Result is not an array, trying to extract array:",
          pricingPlansResult,
        );
        const plansArray =
          pricingPlansResult?.data?.data ||
          pricingPlansResult?.data ||
          pricingPlansResult ||
          [];
        if (Array.isArray(plansArray)) {
          currentSubscriptionPlan =
            plansArray.find(
              (plan) => plan.plan_id === company?.isubscription_plan,
            ) || null;
        }
      }

      // Set edit company data
      setEditCompanyData({
        iCompany_id: company?.iCompany_id,
        cCompany_name: company?.cCompany_name || "",
        iPhone_no: company?.iPhone_no || "",
        cemail_address: company?.cemail_address || "",
        cWebsite: company?.cWebsite || "",
        cGst_no: company?.cGst_no || "",
        icin_no: company?.icin_no || "",
        cPan_no: company?.cPan_no || "",
        industry: company?.industry || "",
        fax_no: company?.fax_no || "",
        iUser_no: company?.iUser_no || "",
        caddress1: company?.caddress1 || "",
        caddress2: company?.caddress2 || "",
        caddress3: company?.caddress3 || "",
        cpincode: company?.cpincode || "",
        cLogo_link: company?.cLogo_link || "",
        icity_id: company?.icity_id || "",
        icurrency_id: company?.icurrency_id || "",
        ibusiness_type: company?.ibusiness_type || "",
        isubscription_plan: company?.isubscription_plan || "",
        ireseller_id: company?.ireseller_id || "",
        bactive: company?.bactive !== undefined ? company.bactive : true,
        city: company?.city || null,
        currency: currentCurrency,
        business_type: currentBusinessType,
        subscription_plan: currentSubscriptionPlan,
        cCompany_origin: company?.cCompany_origin,
        ePlace_type: company?.ePlace_type || PLACE_TYPE_ENUM.India,
      });
      setOpenEditDialog(true);
    } catch (error) {
      console.error("❌ Error opening edit dialog:", error);
      showToast("error", "Failed to load edit form data");
    } finally {
      setLoadingEditData(false);
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setDialogBusinessTypes([]);
    setEditCompanyData({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    const intFields = [
      "iUser_no",
      "iReseller_id",
      "iPhone_no",
      "ireseller_id",
      "isubscription_plan",
      "cpincode",
      "icity_id",
      "icurrency_id",
      "ibusiness_type",
    ];

    setEditCompanyData((prevData) => ({
      ...prevData,
      [name]: intFields.includes(name)
        ? value === ""
          ? ""
          : parseInt(value, 10)
        : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  const handleEditLogoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const data = new FormData();
  data.append("logo", file);

  try {
    const res = await fetch(`${BASE_URL}/company/upload-logo`, {
      method: "POST",
      body: data,
    });

    const result = await res.json();

    if (result.success) {
      setEditCompanyData((prev) => ({
        ...prev,
        cLogo_link: result.path,
      }));
    }
  } catch (err) {
    console.error("Logo upload failed:", err);
  }
};

  useEffect(() => {
    const loadBussinessType = async () => {
      try {
        await fetchBussinessType();
      } catch (error) {
        console.log("failed to load bussiness type:", error);
      }
    };
    loadBussinessType();
  }, []);
  // In your component's save handler
  const handleSaveEditedCompany = async () => {
    // Validation
    const newErrors = validateCompanyData(editCompanyData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("error", "Please fill all required fields");
      return;
    }
    const companyId = editCompanyData.iCompany_id;
    if (!companyId) {
      showToast("error", "Company ID is missing");
      return;
    }

    const response = await editCompanyDetails(editCompanyData, companyId);
    if (response.success) {
      setOpenEditDialog(false);
      showToast("success", "Company details updated successfully.");
      const updatedCompany = await fetchCompanyDataById(companyId);
      setCompany(updatedCompany);
    } else {
      showToast("error", response.error);
    }
  };
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setUserToModify(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenStatusConfirmation = () => {
    setOpenUserStatusDialog(true);
    handleMenuClose();
  };

  const handleCloseUserStatusDialog = () => {
    setOpenUserStatusDialog(false);
    setUserToModify(null);
  };

  const handleToggleUserStatus = async () => {
    if (userToModify) {
      await changeUserStatus(userToModify.iUser_id);
      handleCloseUserStatusDialog();
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  // for user submit
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleUserCreate = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateUserForm()) return;

    const jsonData = {
      cFull_name: userFormData.fullName,
      cUser_name: userFormData.username,
      cEmail: userFormData.email,
      cPassword: userFormData.password,
      i_bPhone_no: userFormData.businessPhone,
      iphone_no: userFormData.personalPhone,
      iCompany_id: company?.iCompany_id,
      irole_id: parseInt(userFormData.role),
    };

    try {
      const res = await createUser(jsonData);

      //  HANDLE API LOGICAL ERROR
      if (!res || res.success === false) {
        setPopup({
          open: true,
          type: "error",
          message: res?.message || "User creation failed",
        });
        return;
      }

      // SUCCESS
      setPopup({
        open: true,
        type: "success",
        message: "User created successfully",
      });

      setTimeout(() => {
        setOpenUserCreateDialog(false);
        resetUserForm();
        setPopup((prev) => ({ ...prev, open: false }));
      }, 2000);
    } catch (err) {
      console.log("API error:", err);

      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Server error. Please try again.";

      setPopup({
        open: true,
        type: "error",
        message: msg,
      });

      setTimeout(() => {
        setPopup((prev) => ({ ...prev, open: false }));
      }, 3000);
    }
  };

  const handleUserCreateDialog = () => {
    setOpenUserCreateDialog(false);
  };

  // Effects
  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await fetchCompanyDataById(id);
        await Promise.all([
          storageDetailsController(id),
          fetchUsersByCompanyId(id),
          fetchRoles(),
        ]);
        setCompany(data);
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        setCompany(null);
      }
    };

    if (id) loadCompany();
  }, [id]);

  const filteredUsers = useMemo(() => {
    const query = userSearchQuery.trim().toLowerCase();

    if (!query) {
      return usersByCompany || [];
    }

    return (usersByCompany || []).filter((user) => {
      const createdAt = user?.dCreate_dt
        ? new Date(user.dCreate_dt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "";
      const status = user?.bactive ? "active" : "deactivated";

      return [
        user?.cFull_name,
        user?.cEmail,
        user?.role,
        createdAt,
        status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [usersByCompany, userSearchQuery]);

  // Calculations
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedUsers,
  } = usePagination(filteredUsers, 10);

  const fullAddressParts = [
    company?.caddress1,
    company?.caddress2,
    company?.caddress3,
    company?.city?.cCity_name,
    company?.country?.cCountry_name,
  ].filter(Boolean);
  const fullAddress =
    fullAddressParts.length > 0 ? fullAddressParts.join(", ") : "-";
  const created_at = formatDate(company?.dCreated_dt);
  const modified_at = formatDate(company?.dModified_dt);
  const companyInitial = company?.cCompany_name?.charAt(0).toUpperCase() || "?";
  const profileDetailItems = [
    {
      label: "Phone",
      icon: <PhoneIcon className="text-emerald-500" />,
      value: company?.iPhone_no || "-",
    },
    {
      label: "Email",
      icon: <EmailIcon className="text-rose-500" />,
      value: company?.cemail_address || "-",
    },
    {
      label: "Website",
      icon: <LanguageIcon className="text-sky-500" />,
      value: company?.cWebsite || "-",
      isLink: Boolean(company?.cWebsite),
    },
    {
      label: "Reseller",
      icon: <StoreIcon className="text-fuchsia-500" />,
      value: company?.iReseller_id || "-",
    },
    {
      label: "User Count",
      icon: <GroupIcon className="text-cyan-600" />,
      value: company?.userCount ?? company?.iUser_no ?? "-",
    },
    {
      label: "GST",
      icon: <ReceiptLongIcon className="text-green-600" />,
      value: company?.cGst_no || "-",
    },
    {
      label: "CIN",
      icon: <BadgeIcon className="text-red-500" />,
      value: company?.icin_no || "-",
    },
    {
      label: "Address",
      icon: <LocationOnIcon className="text-orange-500 mt-1" />,
      value: fullAddress,
      alignStart: true,
    },
    {
      label: "Created At",
      icon: <EventIcon className="text-violet-500" />,
      value: created_at || "-",
    },
    {
      label: "Modified At",
      icon: <EditDocumentIcon className="text-indigo-500" />,
      value: modified_at || "-",
    },
    {
      label: "Total Leads",
      icon: <TrendingUpIcon className="text-amber-500" />,
      value: company?.totalLeads || "-",
    },
  ];
  return (
    <div className="pt-2 px-4 pb-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8 space-y-4 md:space-y-5 font-sans antialiased">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-5 flex flex-col gap-4 border border-gray-100">
        {/* <div className="flex items-center gap-6">
            <div className="w-20 h-20 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-4xl shadow-sm ring-2 ring-blue-200">
              {companyInitial}
            </div> */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <CommonBackButton to="/company" className="mb-0" />

              <div className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-2xl shadow-sm ring-2 ring-blue-200">
                {companyInitial}
                <span
                  className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white ${
                    company?.bactive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {company?.bactive ? <Check size={10} /> : <X size={10} />}
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-col xl:flex-row xl:items-center xl:gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {" "}
                    {company?.cCompany_name || "Loading Company..."}{" "}
                    <span className="text-sm md:text-base font-medium text-gray-500">
                      ({company?.iCompany_id || "-"})
                    </span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2 xl:mt-0">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                      <Crown
                        className="text-amber-600"
                        size={26}
                        fill="currentColor"
                        strokeWidth={1.75}
                      />
                      <span className="font-semibold">
                        {company?.pricing_plan?.plan_name || "-"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm self-start lg:self-center inline-flex items-center gap-2 whitespace-nowrap"
              onClick={() => handleOpenEditDialog(company)}
            >
              <EditIcon fontSize="small" />
       
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {profileDetailItems.map((item) => (
            <div
              key={item.label}
              className={`flex gap-3 ${
                item.alignStart ? "items-start" : "items-center"
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                {item.isLink ? (
                  <a
                    href={`http://${item.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-words font-semibold text-blue-600 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 break-words font-semibold text-gray-900">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-xl shadow-md p-0 border border-gray-100">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="company profile tabs"
            sx={{
              p: 1,
              gap: 1,
              ".MuiTabs-indicator": { display: "none" },
              ".MuiTab-root": {
                borderRadius: "9999px",
                minHeight: 36,
                px: 2.5,
                py: 0.5,
              },
            }}
          >
            <Tab
              label={
                <span className={companyProfileTabLabelClassName}> General Settings </span>
              }
              sx={{
                textTransform: "none",
                color: "#374151",
                "&.Mui-selected": {
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                },
              }}
              {...a11yProps(0)}
            />
            <Tab
              label={
                <span className={companyProfileTabLabelClassName}> Users </span>
              }
              sx={{
                textTransform: "none",
                color: "#374151",
                "&.Mui-selected": {
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                },
              }}
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span className={companyProfileTabLabelClassName}> Masters </span>
              }
              sx={{
                textTransform: "none",
                color: "#374151",
                "&.Mui-selected": {
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                },
              }}
              {...a11yProps(2)}
            />
            <Tab
              label={
                <span className={companyProfileTabLabelClassName}> Audit login </span>
              }
              sx={{
                textTransform: "none",
                color: "#374151",
                "&.Mui-selected": {
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                },
              }}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

        {/* General Settings Tab */}
        <CustomTabPanel value={activeTab} index={0}>
          <GeneralSettingsTab company={company} />
        </CustomTabPanel>

        {/* Users Tab */}
        <CustomTabPanel value={activeTab} index={1}>
          <div>
            {showProfile ? (
              <div>
                <CompanyUser
                  user={selectedUser}
                  companyId={company?.iCompany_id}
                  setShowProfile={setShowProfile}
                />
              </div>
            ) : (
              //  USER LIST VIEW
              <div className="overflow-x-auto">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CommonSearchBar
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search users by name, email, role, date, or status"
                    className="max-w-full sm:max-w-md"
                  />
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                    onClick={() => setOpenUserCreateDialog(true)}
                  >
                    + Create user
                  </button>
                </div>

                {paginatedUsers.length > 0 ? (
                  <CommonTable
                    columns={userColumns}
                    data={paginatedUsers}
                    currentPage={currentPage}
                    itemsPerPage={10}
                    onRowClick={(row) => {
                      setSelectedUser(row);
                      setShowProfile(true);
                    }}
                  />
                ) : (
                  <div className="p-6 text-center">
                    {" "}
                    <p className="text-red-500">
                      No user data available for this company.
                    </p>{" "}
                  </div>
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </div>
        </CustomTabPanel>

        {/* Masters Tab */}
        <CustomTabPanel value={activeTab} index={2}>
          <MasterDataPanel companyData={company} />
        </CustomTabPanel>

        {/* Audit Login Tab */}
        <CustomTabPanel value={activeTab} index={3}>
          <AuditLoginTab company_id={company?.iCompany_id} />
        </CustomTabPanel>
      </div>

      {/* Edit Company Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle className="text-2xl font-bold text-center text-gray-900 border-b pb-4">
          Edit Company Details
        </DialogTitle>
        <DialogContent dividers>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <TextField
              select
              label={
                <span>
                  Company Origin <span className="text-red-500">*</span>
                </span>
              }
              name="ePlace_type"
              value={editCompanyData?.ePlace_type || PLACE_TYPE_ENUM.India}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            >
              <MenuItem value={PLACE_TYPE_ENUM.India}>India</MenuItem>
              <MenuItem value={PLACE_TYPE_ENUM.International}>
                International
              </MenuItem>
            </TextField>
            <TextField
              label={
                <span>
                  Company Name <span className="text-red-500">*</span>
                </span>
              }
              name="cCompany_name"
              value={editCompanyData?.cCompany_name || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              error={!!errors.cCompany_name}
              helperText={errors.cCompany_name}
            />
            <TextField
              label={
                <span>
                  Phone Number <span className="text-red-500">*</span>
                </span>
              }
              name="iPhone_no"
              value={editCompanyData?.iPhone_no || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              error={!!errors.iPhone_no}
              helperText={errors.iPhone_no}
            />
            <TextField
              label={
                <span>
                  Email <span className="text-red-500">*</span>
                </span>
              }
              name="cemail_address"
              value={editCompanyData?.cemail_address || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              error={!!errors.cemail_address}
              helperText={errors.cemail_address}
            />
            <TextField
              label="Website"
              name="cWebsite"
              value={editCompanyData?.cWebsite || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label={
                <span>
                  GST Number{" "}
                  {editCompanyData?.cCompany_origin?.toLowerCase() ===
                    "domestic" && <span className="text-red-500">*</span>}
                </span>
              }
              name="cGst_no"
              value={editCompanyData?.cGst_no || ""}
              onChange={(e) => {
                const upperValue = e.target.value.toUpperCase();
                setEditCompanyData((prev) => ({
                  ...prev,
                  cGst_no: upperValue,
                }));
              }}
              fullWidth
              variant="outlined"
              error={!!errors.cGst_no}
              helperText={errors.cGst_no}
            />

            {/*  CIN Number Field (Conditional Mandatory) */}
            <TextField
              label={
                <span>
                  CIN Number{" "}
                  {editCompanyData?.cCompany_origin?.toLowerCase() ===
                    "domestic" && <span className="text-red-500">*</span>}
                </span>
              }
              name="icin_no"
              value={editCompanyData?.icin_no || ""}
              onChange={(e) => {
                const upperValue = e.target.value.toUpperCase();
                setEditCompanyData((prev) => ({
                  ...prev,
                  icin_no: upperValue,
                }));
              }}
              fullWidth
              variant="outlined"
              error={!!errors.icin_no}
              helperText={errors.icin_no}
            />
            {/* <TextField label={<span>GST Number <span className="text-red-500">*</span></span>} name="cGst_no" value={editCompanyData?.cGst_no || ""} onChange={(e) => { const upperValue = e.target.value.toUpperCase(); setEditCompanyData(prev => ({ ...prev, cGst_no: upperValue })); }} fullWidth variant="outlined" error={!!errors.cGst_no} helperText={errors.cGst_no} />
            <TextField label={<span>CIN Number <span className="text-red-500">*</span></span>} name="icin_no" value={editCompanyData?.icin_no || ""} onChange={(e) => { const upperValue = e.target.value.toUpperCase(); setEditCompanyData(prev => ({ ...prev, icin_no: upperValue })); }} fullWidth variant="outlined" error={!!errors.icin_no} helperText={errors.icin_no} /> */}
            <TextField
              label="PAN Number"
              name="cPan_no"
              value={editCompanyData?.cPan_no || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Industry"
              name="industry"
              value={editCompanyData?.industry || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Fax Number"
              name="fax_no"
              value={editCompanyData?.fax_no || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label={
                <span>
                  Number of Users <span className="text-red-500">*</span>
                </span>
              }
              name="iUser_no"
              type="number"
              value={editCompanyData?.iUser_no || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              error={!!errors.iUser_no}
              helperText={errors.iUser_no}
            />
            <TextField
              label={
                <span>
                  Address Line 1 <span className="text-red-500">*</span>
                </span>
              }
              name="caddress1"
              value={editCompanyData?.caddress1 || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
              error={!!errors.caddress1}
              helperText={errors.caddress1}
            />
            <TextField
              label="Address Line 2"
              name="caddress2"
              value={editCompanyData?.caddress2 || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Address Line 3"
              name="caddress3"
              value={editCompanyData?.caddress3 || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />
<div>
  <label className="block text-sm font-medium mb-1">
    Company Logo
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleEditLogoUpload}
    className="w-full border p-2 rounded"
  />

  {/* OLD LOGO PREVIEW */}
  {editCompanyData?.cLogo_link && (
    <img
      src={`${NO_API_URL}/${editCompanyData.cLogo_link}`}
      alt="Company Logo"
      className="h-16 w-16 object-cover rounded mt-2 border"
    />
  )}
</div>
            <TextField
              label="Pincode"
              name="cpincode"
              type="number"
              value={editCompanyData?.cpincode || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Logo URL"
              name="cLogo_link"
              value={editCompanyData?.cLogo_link || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            />

            {/* City Autocomplete */}
            <Autocomplete
              options={cities}
              getOptionLabel={(option) => option.cCity_name || ""}
              value={editCompanyData?.city || null}
              onChange={(event, newValue) => {
                setEditCompanyData((prev) => ({
                  ...prev,
                  city: newValue,
                  icity_id: newValue ? newValue.icity_id : "",
                }));
              }}
              isOptionEqualToValue={(option, value) =>
                option.icity_id === value?.icity_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    <span>
                      City <span className="text-red-500">*</span>
                    </span>
                  }
                  fullWidth
                  variant="outlined"
                  error={!!errors.icity_id}
                  helperText={errors.icity_id}
                />
              )}
            />

            {/* Currency Autocomplete */}
            <Autocomplete
              options={currencies || []}
              getOptionLabel={(option) =>
                `${option.currency_code} - ${option.symbol}` || ""
              }
              value={editCompanyData?.currency || null}
              onChange={(event, newValue) => {
                setEditCompanyData((prev) => ({
                  ...prev,
                  currency: newValue,
                  icurrency_id: newValue ? newValue.icurrency_id : "",
                }));
              }}
              isOptionEqualToValue={(option, value) =>
                option.icurrency_id === value?.icurrency_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Currency"
                  fullWidth
                  variant="outlined"
                />
              )}
            />
            {/*bussiness type */}
            <Autocomplete
              options={dialogBusinessTypes}
              getOptionLabel={(option) => option.name || ""}
              value={editCompanyData?.business_type || null}
              onChange={(event, newValue) => {
                setEditCompanyData((prev) => ({
                  ...prev,
                  business_type: newValue,
                  ibusiness_type: newValue ? newValue.id : "",
                }));
              }}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              onOpen={() =>
                console.log(
                  "📖 Business types dropdown opened, options:",
                  dialogBusinessTypes,
                )
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Business Type"
                  fullWidth
                  variant="outlined"
                  placeholder={
                    dialogBusinessTypes.length > 0
                      ? "Select business type"
                      : "Loading business types..."
                  }
                />
              )}
            />

            {/* Subscription Plan Autocomplete - This should now work */}
            <Autocomplete
              options={pricingPlans || []}
              getOptionLabel={(option) => option.plan_name || ""}
              value={editCompanyData?.subscription_plan || null}
              onChange={(event, newValue) => {
                setEditCompanyData((prev) => ({
                  ...prev,
                  subscription_plan: newValue,
                  isubscription_plan: newValue ? newValue.plan_id : "",
                }));
              }}
              isOptionEqualToValue={(option, value) =>
                option.plan_id === value?.plan_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subscription Plan"
                  fullWidth
                  variant="outlined"
                />
              )}
            />

            {/* <TextField
              label="Reseller ID"
              name="ireseller_id"
              type="number"
              value={editCompanyData?.ireseller_id || ""}
              onChange={handleEditFormChange}
              fullWidth
              variant="outlined"
            /> */}
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={handleCloseEditDialog}
            color="primary"
            variant="outlined"
            className="px-4 py-2 rounded-lg font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEditedCompany}
            color="primary"
            variant="contained"
            className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Status Dialog */}
      <Dialog open={openUserStatusDialog} onClose={handleCloseUserStatusDialog}>
        <DialogTitle className="text-xl font-bold text-gray-900">
          Confirm {userToModify?.bactive ? "Deactivation" : "Activation"}
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to{" "}
            {userToModify?.bactive ? "deactivate" : "activate"} user:{" "}
            <span className="font-semibold">{userToModify?.cFull_name}</span>?
          </Typography>
          <Typography className="mt-2 text-sm text-gray-600">
            This action will set the user's status to "
            {userToModify?.bactive ? "Inactive" : "Active"}".
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={handleCloseUserStatusDialog}
            color="primary"
            variant="outlined"
            className="px-4 py-2 rounded-lg font-semibold"
          >
            No
          </Button>
          <Button
            onClick={handleToggleUserStatus}
            color={userToModify?.bactive ? "error" : "success"}
            variant="contained"
            className={`px-4 py-2 rounded-lg font-semibold ${userToModify?.bactive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white`}
          >
            Yes, {userToModify?.bactive ? "Deactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Dialog */}
      {openUserCreateDialog && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-50 w-full max-w-2xl mx-auto">
            <form className="bg-white rounded-xl max-w-5xl p-6">
              <div className="text-center font-medium text-2xl text-gray-900 mb-6 ">
                <h2> Create User Profile</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email <span className="text-red-700"> *</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={userFormData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={`w-full px-3 py-2 border rounded-lg shadow-sm ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                  />
                  {isSubmitted && errors.email && (
                    <p className="text-red-600 text-xs">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name <span className="text-red-700"> *</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={userFormData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isSubmitted && errors.fullName && (
                    <p className="text-red-600 text-xs">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username <span className="text-red-700"> *</span>
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={userFormData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isSubmitted && errors.username && (
                    <p className="text-red-600 text-xs">{errors.username}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password <span className="text-red-700"> *</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={userFormData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isSubmitted && errors.password && (
                    <p className="text-red-600 text-xs">{errors.password}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="jobTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Title <span className="text-red-700"> *</span>
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={userFormData.jobTitle}
                    onChange={handleChange}
                    placeholder="Enter job title"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isSubmitted && errors.jobTitle && (
                    <p className="text-red-600 text-xs">{errors.jobTitle}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="businessPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Phone <span className="text-red-700"> *</span>{" "}
                  </label>
                  <input
                    id="businessPhone"
                    type="tel"
                    value={userFormData.businessPhone}
                    onChange={handleChange}
                    placeholder="Business phone number"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isSubmitted && errors.businessPhone && (
                    <p className="text-red-600 text-xs">
                      {errors.businessPhone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="personalPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Personal Phone <span className="text-red-700"> *</span>
                  </label>
                  <input
                    id="personalPhone"
                    type="tel"
                    value={userFormData.personalPhone}
                    onChange={handleChange}
                    placeholder="Personal phone number"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isSubmitted && errors.personalPhone && (
                    <p className="text-red-600 text-xs">
                      {errors.personalPhone}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role <span className="text-red-700"> *</span>
                  </label>
                  <select
                    id="role"
                    value={userFormData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="" disabled className="text-gray-400">
                      Choose role
                    </option>
                    {roles.map((role) => (
                      <option key={role.irole_id} value={role.irole_id}>
                        {role.cRole_name}
                      </option>
                    ))}
                  </select>
                  {isSubmitted && errors.role && (
                    <p className="text-red-600 text-xs"> {errors.role}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="reporting"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reports to
                  </label>
                  <select
                    id="reporting"
                    value={userFormData.reporting}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {!usersByCompany ? (
                      <option value="" disabled className="text-gray-400">
                        No users found
                      </option>
                    ) : (
                      <>
                        <option value="" disabled className="text-gray-400">
                          Choose reporting
                        </option>
                        {usersByCompany.map((user) => (
                          <option key={user.iUser_id} value={user.iUser_id}>
                            {user.cFull_name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 justify-center mt-6">
                <button
                  className="bg-[#2563EB] px-4 py-2 rounded-lg text-white"
                  onClick={handleUserCreate}
                >
                  Save
                </button>
                <button
                  className="bg-red-400 px-4 py-2 rounded-lg text-white"
                  onClick={handleUserCreateDialog}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Actions  menu*/}
      <Menu
        id="user-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenStatusConfirmation}>
          {userToModify?.bactive ? "Deactivate" : "Activate"}
        </MenuItem>
      </Menu>

      <Dialog
        open={popup.open}
        onClose={() => setPopup({ ...popup, open: false })}
      >
        <DialogTitle className="font-bold">
          {" "}
          {popup.type === "error" ? "Error" : "Success"}{" "}
        </DialogTitle>

        <DialogContent>
          <p
            className={
              popup.type === "error" ? "text-red-600" : "text-green-600"
            }
          >
            {popup.message}
          </p>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPopup({ ...popup, open: false })}>
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CompanyProfile;


