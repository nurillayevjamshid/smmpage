import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Share2, Plus, 
  MessageSquare, MoreHorizontal, ChevronRight, 
  BarChart2, Clock, CheckCircle2, Globe, Settings, Trash2
} from "lucide-react";
import { useProject } from "@/hooks/useProject";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import EditProjectModal from "@/components/projects/EditProjectModal";
import ProjectSocialAccounts from "@/components/projects/ProjectSocialAccounts";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading: projectLoading, refresh, updateProject, deleteProject } = useProject(id);
  const { posts: projectPosts, loading: postsLoading } = usePosts(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (projectLoading) return <div className="p-8 text-center animate-pulse">Loading Project Details...</div>;
  if (!project) return <div className="p-8 text-center text-rose-500 font-bold">Project not found</div>;

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-full">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-6 sm:pb-8">
        <div className="flex items-start gap-4">
          <button 
            onClick={() => navigate("/projects")}
            className="p-2 sm:p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Projects</span>
               <ChevronRight size={14} className="text-slate-300" />
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest leading-none">Project Detail</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{project.name}</h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg mt-2 opacity-80">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button 
            variant="secondary" 
            onClick={() => setIsEditModalOpen(true)}
            className="flex-none h-11 px-4 gap-2 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 shadow-sm border-slate-100/50"
          >
            <Settings size={16} /> <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button 
            variant="secondary" 
            onClick={async () => {
              if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
                try {
                  await deleteProject();
                  navigate("/projects");
                } catch (error) {
                  console.error(error);
                }
              }
            }}
            className="flex-none h-11 px-4 gap-2 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 shadow-sm border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 size={16} /> <span className="hidden sm:inline">Delete</span>
          </Button>
          <Button variant="secondary" className="flex-1 sm:flex-none h-11 px-4 gap-2 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 shadow-sm border-slate-100/50">
            <Share2 size={16} /> Manage Members
          </Button>
          <Button className="flex-1 sm:flex-none h-11 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all">
            <Plus size={18} strokeWidth={2.5} /> Create Post
          </Button>
        </div>
      </div>

      {/* Main Grid: Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        
        {/* Left Column: Posts List */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8 order-2 lg:order-1">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
               Recent Posts
               <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">{projectPosts.length}</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {projectPosts.length > 0 ? (
              projectPosts.map((post) => {
                const statusVariant = 
                  post.status === "published" ? "success" : 
                  post.status === "scheduled" ? "warning" : "default";

                return (
                  <Card 
                    key={post.id} 
                    className="p-4 sm:p-6 hover:shadow-xl hover:shadow-slate-200/40 transition-all border-slate-100 group relative overflow-hidden active:scale-[0.99]"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      <div className="w-16 h-16 sm:w-28 sm:h-28 rounded-2xl bg-indigo-50 border border-indigo-50 overflow-hidden shrink-0 shadow-sm relative group-hover:scale-105 transition-transform">
                        {post.mediaUrl ? (
                          <img 
                            src={post.mediaUrl} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-indigo-400">
                            <MessageSquare size={24} />
                          </div>
                        )}
                        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 capitalize">
                          <div className="w-5 h-5 sm:w-7 sm:h-7 bg-white rounded-full flex items-center justify-center shadow-md p-1">
                            <Globe size={14} className="text-indigo-600" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                          <h4 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-700 transition-colors truncate pr-4">
                            {post.caption || "Untitled Post"}
                          </h4>
                          <button className="p-2 sm:p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 leading-relaxed line-clamp-2 max-w-sm">
                          Content ready for scheduling.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wide uppercase">
                            <Clock size={14} className="text-indigo-500/70" />
                            {post.scheduledAt instanceof Date 
                              ? post.scheduledAt.toLocaleDateString() 
                              : (post.scheduledAt as any)?.toDate?.()?.toLocaleDateString() || "Recently"}
                          </div>
                          <Badge variant={statusVariant as any}>
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                 <p className="text-slate-400 font-medium">No posts created yet for this project.</p>
                 <Button variant="secondary" className="mt-4 gap-2 rounded-xl border-slate-200">
                    <Plus size={16} /> Create Your First Post
                 </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Project Info Sidebar */}
        <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
           <Card className="p-6 sm:p-8 bg-white border border-slate-100 shadow-sm shadow-slate-200/20 rounded-[2.5rem] overflow-hidden group">
              <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <BarChart2 size={16} />
                 </div>
                 Project Analytics
              </h3>
              <div className="space-y-5">
                 <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium text-slate-500 opacity-80">Connected Accounts</span>
                    <span className="text-sm font-bold text-slate-900 px-3 py-1 bg-slate-50 rounded-lg">{project.platforms.length} Platforms</span>
                 </div>
                 <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform delay-75">
                    <span className="text-sm font-medium text-slate-500 opacity-80">Total Post Count</span>
                    <span className="text-sm font-bold text-slate-900 px-3 py-1 bg-slate-50 rounded-lg">{project.postCount} Published</span>
                 </div>
                 <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform delay-100">
                    <span className="text-sm font-medium text-slate-500 opacity-80">Weekly Growth</span>
                    <Badge variant="success">+12.4%</Badge>
                 </div>
                 <div className="pt-5 border-t border-slate-50">
                    <div className="flex items-center gap-4 group-hover:gap-5 transition-all">
                       <div className="flex -space-x-3 overflow-hidden">
                          {[1,2,3,4].map(i => (
                             <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-9 h-9 rounded-full border-2 border-white ring-2 ring-slate-50" />
                          ))}
                       </div>
                       <span className="text-xs font-bold text-slate-400">+12 People</span>
                    </div>
                 </div>
              </div>
           </Card>

           <ProjectSocialAccounts projectId={project.id} />

           <Card className="p-6 sm:p-8 bg-indigo-900 border-none shadow-xl shadow-indigo-100 rounded-[2.5rem] text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                 <Globe size={180} />
              </div>
              <div className="relative z-10">
                 <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 size={24} className="text-emerald-400" />
                    Project Health
                 </h4>
                 <p className="text-sm text-indigo-100/70 mb-8 leading-relaxed font-medium">Your strategy is performing exceptionally well this month. Engagements are up by 25%.</p>
                 <Button className="w-full bg-white text-indigo-900 hover:bg-slate-50 h-14 rounded-2xl font-extrabold shadow-lg shadow-black/20">
                    Generate Monthly Report
                 </Button>
              </div>
           </Card>
        </div>

      </div>

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={refresh}
        project={project}
        updateProject={(_, data) => updateProject(data)}
      />
    </div>
  );
}
