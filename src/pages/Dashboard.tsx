import { mockStats, mockRecentActivity } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FolderKanban, CalendarDays, Send, AlertCircle, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

export default function Dashboard() {
  const statCards = [
    { title: "Total Projects", value: mockStats.totalProjects, icon: FolderKanban, color: "text-blue-600", bg: "bg-blue-50/50 border-blue-100" },
    { title: "Scheduled Posts", value: mockStats.scheduledPosts, icon: CalendarDays, color: "text-amber-600", bg: "bg-amber-50/50 border-amber-100" },
    { title: "Published Posts", value: mockStats.publishedPosts, icon: Send, color: "text-emerald-600", bg: "bg-emerald-50/50 border-emerald-100" },
    { title: "Failed Posts", value: mockStats.failedPosts, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50/50 border-rose-100" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Dashboard Overview
            <TrendingUp size={24} className="text-emerald-500 hidden sm:block" />
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Here's a summary of your projects activities.</p>
        </div>
      </div>

      {/* Stats Grid - Fully Responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, i) => (
          <StatCard 
            key={i} 
            {...stat} 
            className="h-full border border-slate-100 shadow-sm shadow-slate-200/20" 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 overflow-hidden">
        {/* Recent Activity Card */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm shadow-slate-200/20 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 border-b border-slate-50">
            <CardTitle className="text-lg font-bold">Recent Activity Feed</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-4">
            <div className="divide-y divide-slate-100/60 sm:space-y-1">
              {mockRecentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-sm ring-4 ring-indigo-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 break-words leading-snug">
                      {activity.action} <span className="text-slate-500 font-normal opacity-80">in</span> {activity.project}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <CalendarDays size={13} />
                        {activity.time}
                      </span>
                      <Badge 
                        variant={
                          activity.status === "success" ? "success" : 
                          activity.status === "scheduled" ? "warning" : "destructive"
                        }
                        className="px-2 py-0 h-5 text-[10px] uppercase font-bold"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for future sidebar info on desktop */}
        <div className="space-y-6">
           <Card className="p-6 bg-indigo-600/5 border-none shadow-none text-indigo-900 h-full flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-indigo-600/10 rounded-full mb-4">
                 <FolderKanban size={32} className="text-indigo-600" />
              </div>
              <h4 className="font-bold text-lg">New Features</h4>
              <p className="text-sm opacity-80 mt-2 px-4 max-w-[240px]">We've added project-wide analytics and automated reports.</p>
           </Card>
        </div>
      </div>
    </div>
  );
}
