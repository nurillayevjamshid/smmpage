import React, { useState } from "react";
import { ShieldCheck, Users, Settings, Database, Activity, Lock, RefreshCw, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const handleManualSync = async () => {
    setIsSyncing(true);
    const toastId = toast.loading("Executing scheduled post protocol...");
    try {
      const response = await fetch('/.netlify/functions/process-scheduled');
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || "Scheduled posts processed successfully", { id: toastId });
      } else {
        throw new Error(data.error || "Failed to process scheduled posts");
      }
    } catch (error: any) {
      toast.error(error.message || "Manual sync failed", { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  };

  const stats = [
    { name: "Total Users", value: "128", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Active Sessions", value: "24", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Security Score", value: "98%", icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Server Status", value: "Healthy", icon: Database, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Lock size={20} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Admin Protocol</h1>
          </div>
          <p className="text-slate-500 font-medium">Restricted access control and system monitoring.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleManualSync} 
            isLoading={isSyncing}
            variant="secondary" 
            className="rounded-xl font-black uppercase tracking-[0.2em] text-[10px] h-12 px-6 gap-2 border-none shadow-lg shadow-indigo-100 bg-white hover:bg-slate-50 text-indigo-600"
          >
            <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
            Trigger Sync
          </Button>
          <Button className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-[11px] h-12 px-6">Update Config</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] bg-white group hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
            <div className="flex items-start justify-between">
              <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={24} />
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.name}</p>
                <p className="text-3xl font-black text-slate-900 tabular-nums tracking-tighter italic">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management Section */}
        <Card className="lg:col-span-2 p-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Authentication Logs</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </div>
              <select className="bg-slate-50 border-none text-[11px] font-bold uppercase tracking-widest text-slate-500 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-100 outline-none">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
                    U{i}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">User Login - IP {192}.168.1.{i * 10}</p>
                    <p className="text-[11px] text-slate-400 font-medium">Session ID: sess_94827{i}38</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Successful</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-8 h-14 rounded-2xl border-2 border-slate-100 text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-50 hover:text-slate-900 transition-all">
            View All Security Events
          </Button>
        </Card>

        {/* Access Control Card */}
        <Card className="p-8 border-none shadow-xl shadow-indigo-100/40 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black uppercase tracking-tight italic">Quick Controls</h2>
              <Zap size={20} className="text-indigo-400 fill-indigo-400/20" />
            </div>
            
            <div className="space-y-4">
               <ControlItem label="Maintenance Mode" active={false} />
               <ControlItem label="New Registrations" active={true} />
               <ControlItem label="Two-Factor Auth" active={true} />
               <ControlItem label="Automation Engine" active={true} />
            </div>

            <hr className="my-8 border-slate-800" />

            <div className="bg-indigo-600 rounded-3xl p-6 shadow-2xl shadow-indigo-500/20">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-3">System Administrator</p>
              <div className="flex items-center gap-4">
                 <img src={user?.photoURL} alt="Admin" className="w-12 h-12 rounded-2xl border-2 border-indigo-400 p-0.5 shadow-lg" />
                 <div>
                    <p className="text-base font-black truncate tracking-tight uppercase italic">{user?.name}</p>
                    <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest">Protocol Override Active</p>
                 </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ControlItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${active ? "bg-emerald-500" : "bg-slate-700"}`}>
        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${active ? "translate-x-6" : "translate-x-0"}`} />
      </div>
    </div>
  );
}

function Sort({ ascending }: { ascending: boolean }) {
  return null;
}
