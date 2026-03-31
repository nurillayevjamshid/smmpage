import { mockStats, mockRecentActivity } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FolderKanban, CalendarDays, Send, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const statCards = [
    { title: "Total Projects", value: mockStats.totalProjects, icon: FolderKanban, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Scheduled Posts", value: mockStats.scheduledPosts, icon: CalendarDays, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Published Posts", value: mockStats.publishedPosts, icon: Send, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Failed Posts", value: mockStats.failedPosts, icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm shadow-slate-200/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-none shadow-sm shadow-slate-200/50">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockRecentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.action} <span className="text-slate-500 font-normal">in</span> {activity.project}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-slate-500">{activity.time}</span>
                    <Badge variant={
                      activity.status === "success" ? "success" : 
                      activity.status === "scheduled" ? "warning" : "destructive"
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
