import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import LandingPage from './pages/public/LandingPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Dummy components for existing routes to prevent them from breaking
const DummyPage = ({ title }: { title: string }) => (
  <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8 text-center font-sans tracking-tight">
    <h1 className="text-4xl text-white font-medium mb-4 font-[family-name:var(--font-display)]">{title} Route</h1>
    <p className="text-white/60 mb-8 max-w-md">This route is preserved as per application constraints. Click below to return.</p>
    <Link to="/" className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/5">
      Return to Home
    </Link>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<DummyPage title="Sign Up" />} />
        <Route path="/login" element={<DummyPage title="Login" />} />
        <Route path="/invite/:token" element={<DummyPage title="Invite" />} />
        <Route path="/app/*" element={<DummyPage title="App Dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
