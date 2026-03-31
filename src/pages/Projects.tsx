import { mockProjects } from "@/data/mock";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/projects/ProjectCard";

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
          <ProjectCard 
            key={project.id} 
            {...project} 
            onClick={(id) => navigate(`/projects/${id}`)}
          />
        ))}
      </div>
    </div>
  );
}

