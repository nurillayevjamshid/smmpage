import { Save, Bell, Shield, Palette, Globe, HardDrive, User, Trash2, ShieldCheck, Moon, Laptop, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function Settings() {
  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full overflow-x-hidden">
      
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 border border-slate-200 rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center text-slate-800 shadow-sm shrink-0">
             <Palette size={24} sm:size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none uppercase">Settings</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 opacity-80 max-w-md leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">Manage your platform preferences and security.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button variant="secondary" className="flex-1 sm:flex-none h-11 px-5 gap-2 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 shadow-sm border-slate-100/50 hover:bg-slate-50 uppercase tracking-widest leading-none">
             Privacy Policy
          </Button>
          <Button className="flex-1 sm:flex-none h-11 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest leading-none">
            <Save size={18} strokeWidth={2.5} /> Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 pb-16">
        
        {/* Navigation Sidebar (Vertical on Desktop, Horizontal/Scrollable on mobile) */}
        <div className="col-span-1 lg:max-w-[240px] space-y-2 lg:space-y-3 lg:border-r lg:border-slate-100 lg:pr-8 flex flex-row lg:flex-col overflow-x-auto no-scrollbar pb-2 lg:pb-0 gap-3 lg:gap-x-0">
          <button className="flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl scale-105 transition-all whitespace-nowrap lg:w-full">
             <User size={16} /> Profile
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap lg:w-full">
             <Bell size={16} /> Notification
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap lg:w-full">
             <Shield size={16} /> Security
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap lg:w-full">
             <Globe size={16} /> Language
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap lg:w-full">
             <HardDrive size={16} /> Billing
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="col-span-1 lg:col-span-3 space-y-6 sm:space-y-10">
          
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Personal Brand Identity</h3>
            </div>
            
            <Card className="p-6 sm:p-10 border-slate-100 shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-white group overflow-hidden active:scale-[0.99] transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mb-8 sm:mb-12">
                 <div className="relative group">
                    <img 
                       src="https://github.com/shadcn.png" 
                       className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-50 shadow-2xl group-hover:scale-105 transition-transform duration-500 ring-8 ring-slate-100/30" 
                    />
                    <button className="absolute bottom-0 right-0 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all border-4 border-white">
                       <Save size={18} />
                    </button>
                 </div>
                 <div className="text-center sm:text-left flex-1 min-w-0">
                    <h4 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-indigo-700 transition-colors">Admin Nurillayev</h4>
                    <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest opacity-60">Creative Product Branding Expert</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-6">
                       <Button variant="outline" className="h-10 px-6 rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-slate-50 shadow-sm border-slate-100 transition-all active:scale-95">Replace Avatar</Button>
                       <button className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90 shadow-sm border border-rose-50">
                          <Trash2 size={16} />
                       </button>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                     <User size={13} className="text-indigo-500/70" />
                     Display Designation
                  </label>
                  <Input defaultValue="Jamshid Nurillayev" className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all px-5" />
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                     <Mail size={13} className="text-indigo-500/70" />
                     Email Communication
                  </label>
                  <Input defaultValue="jamshid@example.com" type="email" className="h-12 bg-slate-50/50 border-slate-100 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all px-5" />
                </div>
                <div className="md:col-span-2 space-y-2 pt-2">
                   <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                     Professional Bio Summary
                  </label>
                  <textarea 
                    className="w-full min-h-[120px] p-5 text-sm font-bold bg-slate-50/50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none text-slate-900 leading-relaxed group-hover:border-indigo-100"
                    defaultValue="Senior Product Designer and Marketing Strategist with over 10 years of experience building scalable SaaS products."
                  />
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1 opacity-60">Public bio shown in team directories and project shares.</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6 pt-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Platform Preferences</h3>
             </div>
             
             <Card className="p-4 sm:p-8 bg-slate-900 border-none shadow-2xl shadow-indigo-100/20 rounded-[2.5rem] text-white overflow-hidden group">
                <div className="space-y-0 sm:space-y-1">
                   {[
                      { title: "Dark Side Implementation", desc: "Enable ultra-dark mode for OLED displays.", icon: Moon, check: false },
                      { title: "Smart Sync Engine", desc: "Sync assets across devices automatically.", icon: Laptop, check: true },
                      { title: "Two-Factor Auth", desc: "Highest level of security for your data.", icon: ShieldCheck, check: true }
                   ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 sm:p-5 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group-hover:translate-x-1 duration-300">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                               <item.icon size={20} />
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-sm sm:text-base font-bold uppercase tracking-tight italic">{item.title}</p>
                               <p className="text-[10px] sm:text-xs text-white/40 font-bold uppercase tracking-widest">{item.desc}</p>
                            </div>
                         </div>
                         <div className="relative inline-flex items-center cursor-pointer pointer-events-none sm:pointer-events-auto">
                            <input type="checkbox" defaultChecked={item.check} className="sr-only peer" />
                            <div className="w-12 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-emerald-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 shadow-xl" />
                         </div>
                      </div>
                   ))}
                </div>
             </Card>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-10">
             <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 rounded-2xl text-[11px] font-black uppercase tracking-widest border-slate-100 hover:bg-slate-50 transition-all active:scale-95">Abandon Changes</Button>
             <Button className="w-full sm:w-auto h-12 px-10 gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all">
                <Save size={18} />
                Deploy Settings
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
