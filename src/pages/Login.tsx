import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Lock, Mail, ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      toast.success("Welcome back, Jamshid!");
      navigate("/dashboard");
    } else {
      toast.error("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-1000 overflow-hidden relative">
      
      {/* Decorative Background Elements (Responsive) */}
      <div className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-[15%] -right-[10%] w-[50%] aspect-square bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-lg space-y-8 animate-in slide-in-from-bottom-5 duration-700 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex p-5 sm:p-6 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-200/50 items-center justify-center text-white scale-110 sm:scale-125 mb-4 sm:mb-8 active:scale-95 transition-transform duration-500 hover:rotate-12">
            <LayoutDashboard size={40} sm:size={48} strokeWidth={2.5} />
          </div>
          <div className="space-y-4">
             <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">SMM Dashboard</h1>
             <p className="text-sm sm:text-lg font-bold text-slate-500 uppercase tracking-widest leading-none opacity-60">Authentication Protocol</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="p-8 sm:p-12 border-none shadow-2xl shadow-indigo-100/40 rounded-[2.5rem] sm:rounded-[3.5rem] bg-white relative group overflow-hidden">
          
          <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-1 px-1">
                   <Mail size={13} className="text-indigo-600/70" />
                   Email Address
                </label>
                <div className="relative group/input">
                  <Input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 sm:h-16 bg-slate-50 border-none rounded-2xl font-bold text-lg text-slate-900 px-6 focus:ring-8 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-1 px-1">
                   <Lock size={13} className="text-indigo-600/70" />
                   Security Password
                </label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 sm:h-16 bg-slate-50 border-none rounded-2xl font-bold text-lg text-slate-900 px-6 focus:ring-8 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="pt-2 sm:pt-4">
              <Button 
                type="submit" 
                className="w-full h-16 sm:h-20 bg-indigo-600 hover:bg-slate-900 text-white rounded-[1.5rem] sm:rounded-[2rem] text-sm sm:text-base font-black uppercase tracking-[0.25em] shadow-2xl shadow-indigo-200 hover:shadow-slate-300 transition-all active:scale-[0.98] animate-in zoom-in-50 duration-500 overflow-hidden relative group/btn"
              >
                 <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-400 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300 pointer-events-none" />
                 <span className="flex items-center justify-center gap-3 relative z-10 transition-transform group-hover/btn:translate-x-1">
                    Establish Connection
                    <ArrowRight size={20} strokeWidth={3} />
                 </span>
              </Button>
            </div>
          </form>

          {/* Social Login Divider */}
          <div className="mt-10 sm:mt-12 flex items-center gap-4 px-4 overflow-hidden">
             <div className="h-px flex-1 bg-slate-100" />
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">External Protocols</span>
             <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 sm:mt-10">
             <button className="h-14 sm:h-16 border-2 border-slate-50 bg-white hover:bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 transition-all active:scale-95 shadow-sm group/social">
                <Github size={24} className="group-hover/social:rotate-12 transition-transform" />
             </button>
             <button className="h-14 sm:h-16 border-2 border-slate-50 bg-white hover:bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 transition-all active:scale-95 shadow-sm group/social">
                <svg className="w-6 h-6 group-hover/social:rotate-[-12deg] transition-transform" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
             </button>
          </div>
        </Card>

        <p className="text-center text-[10px] sm:text-xs font-bold text-slate-400 px-10 uppercase tracking-widest leading-loose opacity-60">
           Access to this dashboard is restricted to authorized marketing personnel only. Unlink connection for privacy.
        </p>
      </div>
    </div>
  );
}
