import './App.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from '../authcontext';
import { ProtectedRoute } from '../frontend/components/ProtectedRoute';
import { NavButtons } from '../frontend/components/NavButtons';
import { Home } from '../frontend/components/pages/home';
import { Progress } from '../frontend/components/pages/progress';
import { Manage } from '../frontend/components/pages/manage';
import { Flashcard } from '../frontend/components/flashcards';
import { Subjects } from '../frontend/components/pages/subjects';
import { Study } from '../frontend/components/pages/study';
import { Signup } from '../frontend/components/pages/signup';
import { Profile } from '../frontend/components/pages/profile';
import { Signin } from '../frontend/components/pages/signin';
import { Footer } from '../frontend/components/pages/Footer';




function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-fade">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/study" element={<Study />} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/signin' element={<Signin/>} />
        <Route path='/flashcard' element={<Flashcard/>} />
        <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
      
        <Route path="/manage" element={<ProtectedRoute><Manage /></ProtectedRoute>} />
        <Route path="*" element={<div>oh! you landed to 'OUT OF THE BOX' </div>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <div className="Nonheader min-h-screen bg-[#DFF1F1]">
      <AuthProvider>
        <header className="bg-[#FFFAF0] flex flex-col items-start pt-6 pb-3">
          <Link to="/">
            <h1 className="titletext font-fascinate ml-8 text-5xl">Careme⟌</h1>
          </Link>
          <NavButtons />
        </header>

        <AnimatedRoutes />

       <Footer/>
      </AuthProvider>
      
    </div>
  );
}

export default App;