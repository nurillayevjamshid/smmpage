import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, FolderKanban, CalendarDays, BarChart3, 
  Settings, LogOut, Users, Image as ImageIcon, FileText, X, ShieldCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Media", href: "/media", icon: ImageIcon },
  { name: "Accounts", href: "/accounts", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col z-[50] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="p-6 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">SMM Panel</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                   ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            <item.icon size={20} className={cn("shrink-0", "group-[.active]:text-indigo-600")} />
            {item.name}
            <div className={cn(
              "absolute right-4 w-1 h-1 rounded-full bg-indigo-600 opacity-0 transition-opacity",
              "group-[.active]:opacity-100"
            )} />
          </NavLink>
        ))}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Zone</p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <ShieldCheck size={20} className={cn("shrink-0", "group-[.active]:text-white")} />
              Admin Protocol
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl mb-2">
          {user ? (
            <>
              <img 
                src={user.photoURL} 
                alt="User" 
                className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{user.displayName || user.name}</p>
                <p className={cn(
                  "text-[10px] truncate mt-0.5 uppercase tracking-widest font-bold px-2 py-0.5 rounded-lg w-fit",
                  isAdmin ? "bg-indigo-600 text-white" : "bg-white text-slate-500"
                )}>
                  {user.role}
                </p>
              </div>
            </>
          ) : (
            <div className="h-10 w-full animate-pulse bg-slate-200 rounded-xl" />
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl w-full transition-colors duration-200 group"
        >
          <LogOut size={19} className="group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
