import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { NavButtons } from '../frontend/components/NavButtons';
import { Home } from '../frontend/components/pages/home';
import { Progress } from '../frontend/components/pages/progress';
import { Manage } from '../frontend/components/pages/manage';
import { Recall } from '../frontend/components/pages/recall';
import { Subjects } from '../frontend/components/pages/subjects';
import { Study } from '../frontend/components/pages/study';

class User {
  constructor(name) {
    this.user = name;
  }

  present() {
    return 'Hi ' + this.user + ', Welcome!';
  }
}

function App() {
  const MyUser = new User("Shea");
  return (
    <div className='Nonheader'>
      <BrowserRouter>
        <Link to="/">
          <h1 className='titletext font-fascinate text-4xl ml-3 mt-4'>CAREMEL</h1>
        </Link>
        <div className="bg-[#90AB8B] App">
          <NavButtons />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/recall" element={<Recall />} />
            <Route path="/study" element={<Study />} />
            <Route path="/manage" element={<Manage />} />
          </Routes>
          <hr className='mt-0 h-0.5 bg-[#90AB8B] border-0' />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;