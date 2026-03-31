import { UserPlus, MoreVertical, Shield, User, Mail, Search, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

const accounts = [
  { id: 1, name: "Jamshid Nurillayev", email: "jamshid@example.com", role: "Admin", status: "Active", avatar: "https://github.com/shadcn.png" },
  { id: 2, name: "Sardor Umrdinov", email: "sardor@example.com", role: "Manager", status: "Active", avatar: "" },
  { id: 3, name: "Aziza Karimova", email: "aziza@example.com", role: "Editor", status: "Inactive", avatar: "" },
];

export default function Accounts() {
  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full overflow-x-hidden">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-50 border border-indigo-100 rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
             <Users size={24} sm:size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Team Members</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 opacity-80">Managing roles and permissions for your team.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none h-11 px-5 gap-2 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 shadow-sm border-slate-100/50">
             Invite Link
          </Button>
          <Button className="flex-1 sm:flex-none h-11 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all">
            <UserPlus size={18} strokeWidth={2.5} /> Add Member
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <Input 
             placeholder="Search members by name or email..." 
             className="pl-11 h-11 bg-white border-slate-100 shadow-sm rounded-xl text-sm"
          />
        </div>
      </div>

      {/* Table-to-Card Responsive List */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 pb-10">
        
        {/* Desktop Header (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-4 px-6 py-2 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100/30">
           <div className="w-12" />
           <div className="flex-1">Member Info</div>
           <div className="w-40 text-center">Security Level</div>
           <div className="w-32 text-center">Status</div>
           <div className="w-12" />
        </div>

        {accounts.map((account) => (
          <Card 
            key={account.id} 
            className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all active:scale-[0.99] group overflow-hidden"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                {account.avatar ? (
                  <img src={account.avatar} alt={account.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{account.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                   <Mail size={12} className="opacity-70" />
                   <span className="truncate max-w-[140px] sm:max-w-none">{account.email}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:contents">
              <div className="flex-none md:w-40 flex md:justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50/50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-tight shadow-sm border border-indigo-100/50">
                  <Shield size={12} />
                  {account.role}
                </div>
              </div>

              <div className="flex-none md:w-32 flex md:justify-center">
                <Badge 
                   variant={account.status === "Active" ? "success" : "secondary"}
                   className="h-6 px-2.5 font-extrabold uppercase text-[9px] tracking-widest shadow-sm shadow-slate-100"
                >
                  {account.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 md:w-12 md:justify-end">
                <button className="p-2 sm:p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90">
                  <ExternalLink size={16} />
                </button>
                <button className="p-2 sm:p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
