import { mockProjects } from "@/data/mock";
import { Button } from "@/components/ui/Button";
import { Plus, Filter, LayoutGrid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/projects/ProjectCard";

export default function Projects() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-2 duration-500 overflow-x-hidden w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Manage your clients and branding strategies.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none h-11 px-4 gap-2 rounded-xl text-xs sm:text-sm shadow-sm border-slate-100/50">
             <Filter size={16} /> Filter
          </Button>
          <Button className="flex-1 sm:flex-none h-11 px-5 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200/50 active:scale-95 transition-all">
            <Plus size={18} strokeWidth={2.5} /> New Project
          </Button>
        </div>
      </div>

      {/* Grid Layout - Responsive columns (1-2-3-3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {mockProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            {...project} 
            onClick={(id) => navigate(`/projects/${id}`)}
            className="w-full h-full transform hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-sm hover:shadow-xl shadow-slate-200/20"
          />
        ))}

        {/* Empty State / Add Placeholder */}
        <button 
          className="group h-[300px] border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 active:scale-95 text-slate-400 hover:text-indigo-600"
        >
          <div className="p-4 bg-slate-50 group-hover:bg-indigo-100 rounded-2xl mb-3 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-semibold text-sm">Add New Project</span>
        </button>
      </div>
    </div>
  );
}
