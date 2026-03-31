import { useParams, useNavigate } from "react-router-dom";
import { mockProjects } from "@/data/mock";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, Settings, Calendar, Image as ImageIcon, Send } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = mockProjects.find((p) => p.id === id);

  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-sm ${project.brandColor}`}>
            {project.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-1">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Settings size={18} /> Settings
          </Button>
          <Button 
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            onClick={() => navigate(`/projects/${id}/compose`)}
          >
            <Plus size={18} /> New Post
          </Button>
        </div>
      </div>

      {/* Tabs / Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Stats & Accounts */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm shadow-slate-200/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Connected Accounts</h3>
              <div className="space-y-3">
                {project.platforms.map((platform) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${platform === 'instagram' ? 'bg-pink-600' : 'bg-blue-500'}`}>
                        {platform === 'instagram' ? <ImageIcon size={18} /> : <Send size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold capitalize">{platform}</p>
                        <p className="text-xs text-slate-500">Connected</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col - Recent Posts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Recent Posts</h3>
            <Button variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">View All</Button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                    <img src={`https://picsum.photos/seed/${project.id}${i}/200/200`} alt="Post media" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={i === 1 ? "warning" : "success"}>
                          {i === 1 ? "Scheduled" : "Published"}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar size={12} /> {i === 1 ? "Tomorrow, 14:00" : "2 days ago"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {project.platforms.map(p => (
                          <div key={p} className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            {p === 'instagram' ? <ImageIcon size={12} /> : <Send size={12} />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 line-clamp-2">
                      Exciting news! We are launching our new feature next week. Stay tuned for more updates and make sure to turn on notifications. 🚀 #launch #startup
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
