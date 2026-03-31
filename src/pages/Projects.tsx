import { mockProjects } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, MoreVertical, Instagram, Send as Telegram } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your clients and brands.</p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
          <Plus size={18} /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <Card 
            key={project.id} 
            className="group cursor-pointer hover:shadow-md transition-all border-slate-200 overflow-hidden"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className={`h-2 w-full ${project.brandColor}`} />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm ${project.brandColor}`}>
                  {project.name.charAt(0)}
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1">{project.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">
                {project.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {project.platforms.includes("instagram") && (
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                      <Instagram size={16} />
                    </div>
                  )}
                  {project.platforms.includes("telegram") && (
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <Telegram size={16} />
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-600">
                  {project.postCount} posts
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
