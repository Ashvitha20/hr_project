import { Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/dashboard/candidate/ProfilePage';
import SavedJobsPage from './pages/dashboard/candidate/SavedJobsPage';
import InterviewSchedulePage from './pages/dashboard/candidate/InterviewSchedulePage';
import SettingsPage from './pages/dashboard/candidate/SettingsPage';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import ManageJobsPage from './pages/dashboard/hr/ManageJobsPage';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import IndustriesPage from './pages/public/IndustriesPage';
import TestimonialsPage from './pages/public/TestimonialsPage';
import ContactPage from './pages/public/ContactPage';
import FAQPage from './pages/public/FAQPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';
import NotFoundPage from './pages/public/NotFoundPage';

import JobListingPage from './pages/careers/JobListingPage';
import JobDetailPage from './pages/careers/JobDetailPage';
import ApplyJobPage from './pages/careers/ApplyJobPage';

import BlogListPage from './pages/blog/BlogListPage';
import BlogDetailPage from './pages/blog/BlogDetailPage';

import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';

import CandidateLayout from './pages/dashboard/candidate/CandidateLayout';
import CandidateDashboard from './pages/dashboard/candidate/CandidateDashboard';
import MyApplicationsPage from './pages/dashboard/candidate/MyApplicationsPage';
import ApplicationDetailPage from './pages/dashboard/candidate/ApplicationDetailPage';

import HRLayout from './pages/dashboard/hr/HRLayout';
import HRDashboard from './pages/dashboard/hr/HRDashboard';
import ApplicantsListPage from './pages/dashboard/hr/ApplicantsListPage';
import ApplicantDetailPage from './pages/dashboard/hr/ApplicantDetailPage';
import InterviewsPage from './pages/dashboard/hr/InterviewsPage';
import OffersPage from './pages/dashboard/hr/OffersPage';

import AdminLayout from './pages/dashboard/admin/AdminLayout';
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import ManageUsersPage from './pages/dashboard/admin/ManageUsersPage';
import ManageRolesPage from './pages/dashboard/admin/ManageRolesPage';
import ManageBlogsPage from './pages/dashboard/admin/ManageBlogsPage';
import ManageTestimonialsPage from './pages/dashboard/admin/ManageTestimonialsPage';
import ContactMessagesPage from './pages/dashboard/admin/ContactMessagesPage';

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        <Route path="/careers" element={<JobListingPage />} />
        <Route path="/careers/:jobId" element={<JobDetailPage />} />

        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:postId" element={<BlogDetailPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Apply flow — full-page, no dashboard sidebar, but still requires candidate login.
          ProtectedRoute redirects unauthenticated visitors to /login with state.from set to
          this exact URL, so LoginPage can send them straight back here after signing in. */}
      <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
        <Route path="/careers/:jobId/apply" element={<ApplyJobPage />} />
      </Route>

      {/* Candidate portal */}
      <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
        <Route element={<CandidateLayout />}>
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<ProfilePage />} />
          <Route path="/candidate/applications" element={<MyApplicationsPage />} />
          <Route path="/candidate/applications/:applicationId" element={<ApplicationDetailPage />} />
          <Route path="/candidate/saved" element={<SavedJobsPage />} />
          <Route path="/candidate/interviews" element={<InterviewSchedulePage />} />
          <Route path="/candidate/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* HR / Recruiter panel */}
      <Route element={<ProtectedRoute allowedRoles={['hr', 'recruiter']} />}>
        <Route element={<HRLayout />}>
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/jobs" element={<ManageJobsPage />} />
          <Route path="/hr/applicants" element={<ApplicantsListPage />} />
          <Route path="/hr/applicants/:applicationId" element={<ApplicantDetailPage />} />
          <Route path="/hr/interviews" element={<InterviewsPage />} />
          <Route path="/hr/offers" element={<OffersPage />} />
        </Route>
      </Route>

      {/* Admin panel */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/jobs" element={<ManageJobsPage />} />
          <Route path="/admin/applicants" element={<ApplicantsListPage />} />
          <Route path="/admin/applicants/:applicationId" element={<ApplicantDetailPage />} />
          <Route path="/admin/blogs" element={<ManageBlogsPage />} />
          <Route path="/admin/testimonials" element={<ManageTestimonialsPage />} />
          <Route path="/admin/messages" element={<ContactMessagesPage />} />
          <Route path="/admin/roles" element={<ManageRolesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}