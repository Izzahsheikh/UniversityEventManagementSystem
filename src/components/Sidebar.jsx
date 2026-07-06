import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
  const role = user.role || 'student';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-[#0a0b0d] border-r border-[#1f2229] text-white p-6 flex flex-col justify-between fixed left-0 top-0 z-50">
      <div className="flex flex-col flex-grow">
        {/* Brand Header */}
        <div className="px-2">
          <h2 className="text-2xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            EventManage
          </h2>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-[#16181d] border border-[#242831]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              {role} Portal
            </span>
          </div>
        </div>

        {/* User Identity Section - Now on Top */}
        <div className="mt-6 mb-8 mx-2 p-3.5 rounded-xl bg-[#111217] border border-[#1f2229] flex flex-col gap-0.5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Logged In As</p>
          <p className="text-sm font-semibold text-gray-200 truncate mt-1">{user.fullName || 'User'}</p>
          <p className="text-xs text-gray-400 truncate font-mono">{user.email || ''}</p>
        </div>

        {/* Vertical Navigation Options Stack */}
        <nav className="flex flex-col gap-2">
          <Link 
            to={`/${role}/dashboard`} 
            className={`w-full block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive(`/${role}/dashboard`)
                ? 'bg-[#16181d] text-white border border-[#2b2f3a]'
                : 'text-gray-400 hover:bg-[#111217] hover:text-white'
            }`}
          >
            Overview
          </Link>

          <Link 
            to="/browse-events" 
            className={`w-full block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive('/browse-events')
                ? 'bg-[#16181d] text-white border border-[#2b2f3a]'
                : 'text-gray-400 hover:bg-[#111217] hover:text-white'
            }`}
          >
            Browse Events
          </Link>

          {role === 'organizer' && (
            <Link 
              to="/create-event" 
              className={`w-full block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive('/create-event')
                  ? 'bg-[#16181d] text-white border border-[#2b2f3a]'
                  : 'text-gray-400 hover:bg-[#111217] hover:text-white'
              }`}
            >
              Create Event
            </Link>
          )}

          <Link 
            to="/profile" 
            className={`w-full block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive('/profile')
                ? 'bg-[#16181d] text-white border border-[#2b2f3a]'
                : 'text-gray-400 hover:bg-[#111217] hover:text-white'
            }`}
          >
            View Profile
          </Link>
        </nav>
      </div>

      {/* Logout Action Locked at Bottom */}
      <div className="border-t border-[#1f2229] pt-5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-red-400 bg-red-950/10 border border-red-950/30 hover:bg-red-950/30 hover:text-red-300 transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;