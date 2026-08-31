import './App.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from '../authcontext';
import { ProtectedRoute } from '../frontend/components/ProtectedRoute';
import { NavButtons } from '../frontend/components/NavButtons';
import { Home } from '../frontend/components/pages/home';
import { Progress } from '../frontend/components/pages/progress';
import { Manage } from '../frontend/components/pages/manage';
import { Recall } from '../frontend/components/pages/recall';
import { Subjects } from '../frontend/components/pages/subjects';
import { Study } from '../frontend/components/pages/study';
import { Signup } from '../frontend/components/pages/signup';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-fade">
      <Routes location={location}>
        <Route path="/" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/study" element={<Study />} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
        <Route path="/recall" element={<ProtectedRoute><Recall /></ProtectedRoute>} />
        <Route path="/manage" element={<ProtectedRoute><Manage /></ProtectedRoute>} />
        <Route path="*" element={<div>404 — page not found</div>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <div className="Nonheader min-h-screen bg-[#F5F0C8]">
      <AuthProvider>
        <header className="bg-[#90AB8B] flex flex-col items-start pt-6 pb-3">
          <Link to="/">
            <h1 className="titletext font-fascinate ml-8 text-4xl">CAREMEL</h1>
          </Link>
          <NavButtons />
        </header>

        <AnimatedRoutes />

        <hr className="mt-0 h-0.5 bg-[#90AB8B] border-0" />
      </AuthProvider>
    </div>
  );
}

export default App;