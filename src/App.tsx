import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppProvider } from './context/AppContext'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import { Login, Signup, ForgotPassword } from './pages/auth/index'
import Onboarding from './pages/Onboarding'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Conversations from './pages/conversations/Conversations'
import Appointments from './pages/appointments/Appointments'
import Leads from './pages/leads/Leads'
import KnowledgeBase from './pages/knowledge/KnowledgeBase'
import Escalations from './pages/escalations/Escalations'
import Analytics from './pages/analytics/Analytics'
import Team from './pages/team/Team'
import Billing from './pages/billing/Billing'
import Settings from './pages/settings/Settings'
import SuperAdmin from './pages/admin/SuperAdmin'
import { PrivacyPolicy, TermsOfService, DPA, GDPRCompliance, GOCStandards } from './pages/legal/index'
import KBTemplate from './pages/legal/KBTemplate'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Always public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy"     element={<PrivacyPolicy />} />
          <Route path="/terms"       element={<TermsOfService />} />
          <Route path="/dpa"         element={<DPA />} />
          <Route path="/gdpr"        element={<GDPRCompliance />} />
          <Route path="/goc"         element={<GOCStandards />} />
          <Route path="/kb-template" element={<KBTemplate />} />

          {/* Redirect to /app if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login"           element={<Login />} />
            <Route path="/signup"          element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Require auth */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index                element={<Dashboard />} />
              <Route path="conversations" element={<Conversations />} />
              <Route path="appointments"  element={<Appointments />} />
              <Route path="leads"         element={<Leads />} />
              <Route path="kb"            element={<KnowledgeBase />} />
              <Route path="escalations"   element={<Escalations />} />
              <Route path="analytics"     element={<Analytics />} />
              <Route path="team"          element={<Team />} />
              <Route path="billing"       element={<Billing />} />
              <Route path="settings"      element={<Settings />} />
            </Route>
          </Route>

          {/* Admin — protect in production with additional check */}
          <Route path="/admin" element={<SuperAdmin />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
