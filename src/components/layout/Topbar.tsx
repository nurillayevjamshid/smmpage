import { Bell, Search, Menu, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

interface TopbarProps {
  onMenuToggle: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Disconnected successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="h-16 lg:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-[45] w-full transition-all shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Toggle Burger Button (Mobile/Tablet Only) */}
        <button 
          onClick={onMenuToggle}
          className="p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors lg:hidden active:scale-95"
          aria-label="Toggle menu"
        >
          <Menu size={22} strokeWidth={2.2} />
        </button>

        {/* Search Bar (Responsive) */}
        <div className="relative w-full max-w-[200px] sm:max-w-md ml-1 sm:ml-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
          <input
            type="text"
            placeholder="Search projects, posts..."
            className="w-full pl-10 pr-3 py-1.5 sm:py-2.5 bg-slate-100/80 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-xs sm:text-sm transition-all outline-none placeholder:text-slate-500/70"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-3">
        {/* Notifications */}
        <button className="relative p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors group active:scale-95">
          <Bell size={21} strokeWidth={2} />
          <span className="absolute top-[10px] right-[10px] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-1">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || "User"} 
              className="w-9 h-9 sm:w-11 sm:u-11 rounded-xl object-cover ring-2 ring-slate-50 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:u-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <User size={20} />
            </div>
          )}
          <div className="hidden lg:block">
            <p className="text-sm font-bold text-slate-900 leading-tight truncate max-w-[120px]">{user?.displayName || "Connected User"}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.email?.split('@')[0] || "User"}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
            title="Disconnect"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
