import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, BookOpen, Brain, PenLine, Settings, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/recall', label: 'Recall', icon: Brain },
  { to: '/study', label: 'Study', icon: PenLine },
  { to: '/manage', label: 'Manage', icon: Settings },
  {to: '/signup', label:'Sign Up', icon: user-plus},
  {to: '/signup', label:'Sign Up', icon: user-round}

];

export function NavButtons() {
  const [open, setOpen] = useState(false);

  return (
  <div className="w-full flex flex-col items-end  pl-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#4A5D45] text-white px-5 py-2 rounded-full hover:bg-[#5A7863] transition-colors cursor-pointer mt-6 mb-3"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
        <span>{open ? 'Close' : ''}</span>
      </button>

      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#90AB8B] py-6 px-4 flex flex-wrap gap-4 justify-center">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}>
              <div className="flex flex-col items-center justify-center gap-2 bg-[#4A5D45] hover:bg-[#5A7863] text-white w-24 h-24 rounded-xl cursor-pointer transition-colors">
                <Icon size={28} />
                <span className="text-xs">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}