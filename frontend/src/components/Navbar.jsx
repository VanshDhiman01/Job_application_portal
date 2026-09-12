import { Link, useLocation } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50";
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">JobBoard</span>
            </Link>
            
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${isActive('/')}`}
              >
                Jobs
              </Link>
              <Link 
                to="/applications" 
                className={`px-3 py-2 rounded-md font-medium text-sm transition-colors ${isActive('/applications')}`}
              >
                My Applications
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm font-medium text-slate-700">Applicant</div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              A
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
