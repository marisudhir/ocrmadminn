import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgetPassword from "./Components/ForgetPassword";
import { ToastProvider } from "./context/ToastContext";
import SuccessMessage from "./pages/credential/SuccessMessage";
import VerifyCodePage from "./pages/credential/verify_code";
import Login from "./pages/credential/login";
import { PopupProvider } from "./context/PopupContext";
import { UserProvider } from "./context/UserContext";
import SignupRes from "./pages/credential/signup_res";
import UpdatePassword from "./Components/UpdatePassword";
import LeadTimeline from "./Components/LeadTimeline";
import HistoryPage from "./pages/history";
import CompanyList from "./Components/Company/CompanyList";
import CompanyPage from "./pages/companypage";
import AllLeadsPage from "./pages/dashboard/AllLeadsPage";
import LeadsDashboard from "./pages/dashboard/teamLeadDashboard";
import LeadManagePage from "./pages/LeadManagePage";
import LeadListViewPage from "./pages/dashboard/LeadListView";
import LeadCardViewPage from "./pages/dashboard/LeadcardView";
import UserAnalyticsPage from "./pages/user_analytics";
import CalendarPage from "./pages/calenderpage";
import Commandpage from "./pages/command";
import TeamviewDashboard from "./pages/dashboard/teamviewdashboard";
import { TabProvider } from "./context/TabContext";
import LeadDetailView from "./context/leaddetailsview";
import UserProfile from "./pages/userPage/userProfile";
import CreateUserForm from "./Components/registerUser";
import AppLayout from "./Components/AppLayout";
import SettingsPage from "./pages/settings/settingsPage";
import AccountSettings from "./pages/settings/accountSettings";
import NotificationSettings from "./pages/settings/notificationSettings";
import BillingSettings from "./pages/settings/billingSettings";
import MembersSettings from "./pages/settings/membersSettings";
import SupportSettings from "./pages/settings/supportSettings";
import SmtpSettings from "./pages/settings/smtpsettings";
import RazorpaySettings from "./pages/settings/razorpaySettings";
import UserPage from "./pages/userPage/userPage";
import LostLeadReportPage from './Components/reports/LeadLostReport';
import SalesByStageReportPage from './Components/reports/salesByStageReport';
import CardsPage from './Components/reports/reports';
import CompanyDashboard from './pages/dashboard/companydashboard';
import NotificationPage from "./pages/notification"; 
import AdminDashboard from "./admin/pages/Dashboard/adminDashboard";
import Company from "./admin/pages/Company/companies";
import MasterData from "./admin/pages/Masters/masterData";
import LeadStatus from "./admin/pages/Masters/Status/leadStauts";
import LeadSource from "./admin/pages/Masters/Source/leadSource";
import DurationMaster from "./admin/pages/Masters/Duration-master/durationMaster";
import DistrictMaster from "./admin/pages/Masters/district/districtMasters";
import LeadPotentail from "./admin/pages/Masters/Potential/leadPotential";
import Indsutry from "./admin/pages/Masters/Industry/industry";
import CompanyProfile from "./admin/pages/Company/companyProfile";
import CompanyUser from "./admin/pages/Company/companyUser";
import { NotFoundPage } from "./admin/components/404";
import Reseller from "./admin/pages/Reseller/reseller";
import ResellerProfile from "./admin/pages/Reseller/resellerProfile";
import AlertScreen from "./admin/pages/Alerts/alerts";
import StateMaster from "./admin/pages/Masters/States/StateMaster";
import CountryMaster from "./admin/pages/Masters/country/countryMaster.jsx";
import CityMaster from "./admin/pages/Masters/city/cityMaster";
import AttributeMaster from "./admin/pages/Attributes/AttributeMaster"
import CurrencyMaster from "./admin/pages/Masters/currency/currencyMaster";
import SubscriptionPage from "./admin/pages/Subscription_plan/subscription_components";
import ModulePage from "./admin/pages/Module/module_components";
import { ModuleAllocation } from "./admin/pages/Module_allocation/module_allocation_component";
import ProposalSentMode from "./admin/pages/Masters/Proposal Sent Mode/proposalSentMode";
import StoragePage from "./pages/Storage/StoragePage";
import  StoragecompanyUser from './pages/Storage/StoragecompanyUser.jsx'
import LeadPackPage from "./admin/pages/LeadPack/leadPackPage";
import LeadPackReportPage from "./admin/pages/LeadPack/leadPackReportPage";
import PacksPage from "./admin/pages/LeadPack/packsPage";



function App() {
  return (
    <PopupProvider>
      <ToastProvider>
        <TabProvider>
          <UserProvider>
            <>
            <ToastContainer position="top-right" autoClose={2500} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/success" element={<SuccessMessage />} />
            <Route path="/verify" element={<VerifyCodePage />} />
            <Route path="/signupres" element={<SignupRes />} />
            <Route path="/UpdatePassword" element={<UpdatePassword/>}/>

              {/* Protected Routes with Layout */}
              <Route element={<AppLayout />}>
              <Route path="calenderpage" element={<CalendarPage />} />
              <Route path="/reportpage" element={<CardsPage />} />
              <Route path="/sales-by-stage-analytics" element={<SalesByStageReportPage />} />
              <Route path="/lead-lost-analytics" element={<LostLeadReportPage />} />
              <Route path="userpage" element={<UserPage />} />
              <Route path="commandpage" element={<Commandpage />} />
              <Route path="users" element={<CreateUserForm />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/company" element={<Company />} />
              <Route path="/storage" element={<StoragePage />} />
              <Route path="/StoragecompanyUser/:userId" element={<StoragecompanyUser />} />
              <Route path="/razorpay" element={<RazorpaySettings />} />
              <Route path="/packspage" element={<PacksPage />} />
              <Route path="/lead-packs" element={<LeadPackPage />} />
              <Route path="/lead-pack-report" element={<LeadPackReportPage />} />

              {/* Subscription route */}
              <Route path="/subscriptions" element={<SubscriptionPage />} />
              {/* Module route */}
              <Route path="/module" element={<ModulePage />} />
              {/* Module allocation route */}
              <Route path="/moduleAllocation" element={<ModuleAllocation />} />
              <Route path="/masters" element={<MasterData />} />
              <Route path="/dashboard-admin" element={<AdminDashboard />} />
              <Route path="/lead-status" element={<LeadStatus />} />
              <Route path="/lead-source" element={<LeadSource />} />
              <Route path="/currency" element={<CurrencyMaster />} />
              <Route path="/district" element={<DistrictMaster />} />
              <Route path= "/proposal-send-mode" element= {<ProposalSentMode />} />
              <Route path="/state" element={<StateMaster />} />
              <Route path="/country" element={<CountryMaster />} />
              <Route path="/lead-potential" element={<LeadPotentail />} />
              <Route path="/industry" element={<Indsutry />} />
              <Route path="/404" element={<NotFoundPage />} />              
              <Route path="/company-profile/:id" element={<CompanyProfile />} />
              {/* <Route path="/companyUser" element = {<CompanyUser />} /> */}
              <Route path="/companyUser/:userId" element={<CompanyUser />} />
              <Route path="/reseller" element={<Reseller />} />
              <Route path="/reseller-profile/:id" element={<ResellerProfile />} />
              <Route path="/alerts" element={<AlertScreen />} />
              <Route path="leads" element={<LeadsDashboard />} />
              <Route path="leadlistview" element={<LeadListViewPage />} />
              <Route path="leadcardview" element={<LeadCardViewPage />} />
              <Route path="leadmanage" element={<LeadManagePage />} />
              <Route path="leadtimeline" element={<LeadTimeline />} />
              <Route path="allleadpage" element={<AllLeadsPage />} />
              <Route path ="city" element={<CityMaster/>} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="companylist" element={<CompanyList />} />
              <Route path="duration" element={<DurationMaster />} />
              <Route path="companypage" element={<CompanyPage />} />
              <Route path="analytics" element={<UserAnalyticsPage />} />
              <Route path="teamview" element={<TeamviewDashboard />} />
              <Route path="attribute" element={<AttributeMaster/>}/>
              <Route path="leaddetailview/:leadId" element={<LeadDetailView />} />
              <Route path="userprofile/:userId" element={<UserProfile />}/>
              <Route path="/companydashboard" element={<CompanyDashboard />} />
              <Route path="settingspage" element={<SettingsPage />}>
              <Route path="account" element={<AccountSettings />} />
              <Route path="notification" element={<NotificationSettings />} />
              <Route path="billing" element={<BillingSettings />} />
              <Route path="members" element={<MembersSettings />} />
              <Route path="support" element={<SupportSettings />} />
              <Route path="smtpsettings" element={<SmtpSettings />} />

                </Route>
              </Route>
            </Routes>
          </>
            </UserProvider>
        </TabProvider>
      </ToastProvider>
    </PopupProvider>
  );
}

export default App;
