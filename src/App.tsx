import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Public Pages
import HomePage from "@/pages/public/HomePage";
import AboutPage from "@/pages/public/AboutPage";
import DepartmentsPage from "@/pages/public/DepartmentsPage";
import DoctorsPage from "@/pages/public/DoctorsPage";
import AppointmentPage from "@/pages/public/AppointmentPage";
import ContactPage from "@/pages/public/ContactPage";
import PrivacyPage from "@/pages/public/PrivacyPage";
import TermsPage from "@/pages/public/TermsPage";
import ConsentPage from "@/pages/public/ConsentPage";

// Auth
import LoginPage from "@/pages/auth/LoginPage";
import PatientLogin from "@/pages/auth/PatientLogin";
import RegisterPage from "@/pages/auth/RegisterPage";

// Dashboards
import SuperAdminDashboard from "@/pages/dashboard/SuperAdminDashboard";
import HospitalAdminDashboard from "@/pages/dashboard/HospitalAdminDashboard";
import DoctorDashboard from "@/pages/dashboard/DoctorDashboard";
import NurseDashboard from "@/pages/dashboard/NurseDashboard";
import PatientDashboard from "@/pages/dashboard/PatientDashboard";
import { ScrollToTop } from "@/components/ScrollToTop";
import AppointmentList from "@/pages/dashboard/admin/AppointmentList";
import BillingPage from "@/pages/dashboard/admin/BillingPage";
import PharmacyPOS from "@/pages/dashboard/admin/PharmacyPOS";
import SampleCollection from "@/pages/dashboard/lis/SampleCollection";
import LabResults from "@/pages/dashboard/lis/LabResults";
import RadiologyWorklist from "@/pages/dashboard/ris/RadiologyWorklist";
import AdmissionDashboard from "@/pages/dashboard/ipd/AdmissionDashboard";
import NursingStation from "@/pages/dashboard/nursing/NursingStation";
import InventoryDashboard from "@/pages/dashboard/inventory/InventoryDashboard";
import HrDashboard from "@/pages/dashboard/hr/HrDashboard";
import AccountsDashboard from "@/pages/dashboard/accounts/AccountsDashboard";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/consent" element={<ConsentPage />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/patient/login" element={<PatientLogin />} />

          {/* Super Admin Dashboard */}
          <Route element={<DashboardLayout role="superadmin" userName="System Admin" />}>
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/*" element={<SuperAdminDashboard />} />
          </Route>



          {/* Hospital Admin Dashboard */}
          <Route element={<DashboardLayout role="admin" userName="Admin User" />}>
            <Route path="/admin" element={<HospitalAdminDashboard />} />
            <Route path="/admin/appointments" element={<AppointmentList />} />
            <Route path="/admin/billing" element={<BillingPage />} />
            <Route path="/admin/pharmacy" element={<PharmacyPOS />} />
            <Route path="/admin/lis/samples" element={<SampleCollection />} />
            <Route path="/admin/lis/results" element={<LabResults />} />
            <Route path="/admin/ris/worklist" element={<RadiologyWorklist />} />
            <Route path="/admin/ipd/admission" element={<AdmissionDashboard />} />
            <Route path="/admin/inventory" element={<InventoryDashboard />} />
            <Route path="/admin/hr" element={<HrDashboard />} />
            <Route path="/admin/accounts" element={<AccountsDashboard />} />
            <Route path="/admin/*" element={<HospitalAdminDashboard />} />
          </Route>

          {/* Doctor Dashboard */}
          <Route element={<DashboardLayout role="doctor" userName="Dr. Sarah Mitchell" />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/*" element={<DoctorDashboard />} />
          </Route>

          {/* Nurse Dashboard */}
          <Route element={<DashboardLayout role="nurse" userName="Nurse Johnson" />}>
            <Route path="/nurse" element={<NurseDashboard />} />
            <Route path="/nurse/station" element={<NursingStation />} />
            <Route path="/nurse/*" element={<NurseDashboard />} />
          </Route>

          {/* Patient Dashboard */}
          <Route element={<DashboardLayout role="patient" userName="John Smith" />}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/*" element={<PatientDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
