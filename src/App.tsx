import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateStory from './pages/CreateStory';
import StoryPreview from './pages/StoryPreview';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Orders from './pages/Orders';
import CMS from './pages/CMS';
import FollowUs from './pages/FollowUs';
import Subscribers from './pages/Subscribers';
import { LogOut, BookOpen, PlusCircle, Settings as SettingsIcon, Users as UsersIcon, ShoppingCart, FileText, ChevronDown, HelpCircle, Share2, Mail } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import { Link, useLocation } from 'react-router-dom';

import { useLogoutMutation } from './store/apiSlice';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [logoutApi] = useLogoutMutation();
  const [isCmsOpen, setIsCmsOpen] = React.useState(location.pathname.startsWith('/cms'));

  const handleLogout = async () => {
    try {
      await logoutApi({}).unwrap();
    } catch (e) {
      console.error('Logout API failed', e);
    }
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#0a192f] to-[#0f3a4a] text-white flex flex-col shadow-2xl hidden md:flex border-r border-[#0a192f] h-screen sticky top-0">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <BookOpen className="w-8 h-8 text-[#bef264] mr-3" />
          <span className="text-2xl font-extrabold tracking-tight">Dreamtales</span>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-3">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              location.pathname === '/'
                ? 'bg-[#bef264] text-[#0a192f] shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <BookOpen className="w-5 h-5 mr-3" />
            Stories
          </Link>
          <Link
            to="/create"
            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              location.pathname === '/create'
                ? 'bg-[#bef264] text-[#0a192f] shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <PlusCircle className="w-5 h-5 mr-3" />
            Create Story
          </Link>
          <Link
            to="/users"
            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              location.pathname === '/users'
                ? 'bg-[#bef264] text-[#0a192f] shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <UsersIcon className="w-5 h-5 mr-3" />
            Users
          </Link>
          <Link
            to="/orders"
            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              location.pathname === '/orders'
                ? 'bg-[#bef264] text-[#0a192f] shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Orders
          </Link>
          <Link
            to="/subscribers"
            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              location.pathname === '/subscribers'
                ? 'bg-[#bef264] text-[#0a192f] shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <Mail className="w-5 h-5 mr-3" />
            Subscribers
          </Link>
          <div className="space-y-1">
            <button
              onClick={() => setIsCmsOpen(!isCmsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                location.pathname.startsWith('/cms')
                  ? 'bg-[#bef264]/10 text-[#bef264]'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
              }`}
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3" />
                CMS
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCmsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Sub-menu */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCmsOpen ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className="pl-11 pr-4 space-y-1">
                <Link
                  to="/cms/faq"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === '/cms/faq'
                      ? 'bg-[#bef264] text-[#0a192f] shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ Page
                </Link>
                <Link
                  to="/cms/follow-us"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === '/cms/follow-us'
                      ? 'bg-[#bef264] text-[#0a192f] shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Follow Us
                </Link>
              </div>
            </div>
          </div>
          <Link
            to="/settings"
            className={`flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              location.pathname === '/settings'
                ? 'bg-[#bef264] text-[#0a192f] shadow-[0_0_15px_rgba(190,242,100,0.4)]'
                : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
            }`}
          >
            <SettingsIcon className="w-5 h-5 mr-3" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-semibold text-gray-300 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed pb-16 md:pb-0">
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-[#0a192f] text-white border-b border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-[#bef264] mr-2" />
            <span className="font-extrabold text-lg">Dreamtales</span>
          </div>
          <button onClick={handleLogout} className="flex items-center px-3 py-2 text-sm font-semibold bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </header>

        <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a192f] border-t border-white/10 flex items-center justify-around z-50">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              location.pathname === '/' ? 'text-[#bef264]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Stories</span>
          </Link>
          <Link
            to="/create"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              location.pathname === '/create' ? 'text-[#bef264]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Create</span>
          </Link>
          <Link
            to="/users"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              location.pathname === '/users' ? 'text-[#bef264]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <UsersIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Users</span>
          </Link>
          <Link
            to="/orders"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              location.pathname === '/orders' ? 'text-[#bef264]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Orders</span>
          </Link>
          <Link
            to="/cms/faq"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              location.pathname.startsWith('/cms') ? 'text-[#bef264]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-semibold">CMS</span>
          </Link>
          <Link
            to="/settings"
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              location.pathname === '/settings' ? 'text-[#bef264]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Settings</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CreateStory />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cms"
        element={<Navigate to="/cms/faq" replace />}
      />
      <Route
        path="/cms/faq"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CMS />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cms/follow-us"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <FollowUs />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscribers"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Subscribers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/preview/:id"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <StoryPreview />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
