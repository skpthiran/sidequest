import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';
import PWAInstallPrompt from './components/shared/PWAInstallPrompt';

const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Onboarding = lazy(() => import('./pages/auth/Onboarding'));
const Dashboard = lazy(() => import('./pages/app/Dashboard'));
const PodWall = lazy(() => import('./pages/app/PodWall'));
const ProgressBoard = lazy(() => import('./pages/app/ProgressBoard'));
const AICoach = lazy(() => import('./pages/app/AICoach'));
const Discover = lazy(() => import('./pages/app/Discover'));
const Profile = lazy(() => import('./pages/app/Profile'));
const Settings = lazy(() => import('./pages/app/Settings'));
const Graduation = lazy(() => import('./pages/app/Graduation'));
const InvitePage = lazy(() => import('./pages/public/InvitePage'));


const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/invite/:token" element={<InvitePage />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="pod" element={<PodWall />} />
              <Route path="progress" element={<ProgressBoard />} />
              <Route path="coach" element={<AICoach />} />
              <Route path="discover" element={<Discover />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="graduation" element={<Graduation />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
      <PWAInstallPrompt />
    </AuthProvider>
  );
}
