import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CalendarDays, BarChart3, Settings, LogOut, Users, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/data/mock";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Media", href: "/media", icon: Image },
  { name: "Accounts", href: "/accounts", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200">
          <LayoutDashboard className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">SMM Panel</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )
            }
          >
            <item.icon size={20} className="shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl mb-2">
          <img src={mockUser.photoURL} alt="User" className="w-10 h-10 rounded-full border border-slate-200" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{mockUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{mockUser.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-2xl w-full transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
