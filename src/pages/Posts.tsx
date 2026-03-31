import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { Calendar, Plus, MessageSquare, Heart, Share2, MoreHorizontal, LayoutGrid, CalendarDays, History, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export default function Posts() {
  const { user } = useAuth();
  const { posts, loading } = usePosts(undefined, user?.id);
  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full overflow-x-hidden">
      
      {/* Posts Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 border border-slate-800 rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shrink-0">
             <MessageSquare size={24} sm:size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none italic uppercase">Content Feed</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 opacity-80 max-w-lg leading-relaxed">Centralized view of all your creative content across platforms.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none h-11 px-5 gap-2 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 shadow-sm border-slate-100/50 hover:bg-slate-50 uppercase tracking-widest tracking-widest">
             Calendar
          </Button>
          <Button className="flex-1 sm:flex-none h-11 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest">
            <Plus size={18} strokeWidth={2.5} /> Create
          </Button>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
         <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
               All Posts
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
               Scheduled
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
               Drafts
            </button>
            <button className="p-2.5 bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 rounded-xl active:scale-95 transition-all">
               <History size={18} />
            </button>
            <button className="p-2.5 bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 rounded-xl active:scale-95 transition-all">
               <Filter size={18} />
            </button>
         </div>
      </div>

      {/* Posts List / Cards - 1 to 2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 pb-10">
        {loading ? (
          [1,2].map(i => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[2.5rem]" />
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => {
            const statusMap = {
              'published': { label: 'Published', variant: 'success' as const, color: 'border-emerald-400' },
              'scheduled': { label: 'Scheduled', variant: 'primary' as const, color: 'border-amber-400' },
              'draft': { label: 'Draft', variant: 'secondary' as const, color: 'border-slate-400' },
              'failed': { label: 'Failed', variant: 'destructive' as const, color: 'border-rose-400' },
            };
            const config = statusMap[post.status as keyof typeof statusMap] || statusMap.draft;

            return (
              <Card key={post.id} className="p-5 sm:p-8 transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-slate-200/50 rounded-[2rem] sm:rounded-[2.5rem] border-slate-100 bg-white relative group overflow-hidden active:scale-[0.98]">
                <div className={cn("absolute top-0 left-0 bottom-0 w-2.5 pointer-events-none group-hover:w-3.5 transition-all border-r-[3px] border-slate-50", config.color)} />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-indigo-50/50 rounded-[1.25rem] sm:rounded-[2rem] flex items-center justify-center text-indigo-600 border border-indigo-100/50 shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
                       <MessageSquare size={24} sm:size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors uppercase tracking-tight leading-none pr-6">
                        {post.caption || "Untitled Post"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 sm:mt-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5 uppercase tracking-widest text-slate-600">
                          {post.projectId ? "Project Active" : "General"}
                        </span>
                        <span className="hidden xs:block opacity-30">•</span>
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] text-slate-500 uppercase tracking-widest leading-none flex items-center gap-1">
                          <LayoutGrid size={11} className="text-slate-400" />
                          {post.platforms?.[0] || "System"}
                        </span>
                        <span className="hidden xs:block opacity-30">•</span>
                        <span className="flex items-center gap-1.5 text-indigo-500/70 uppercase tracking-widest tracking-widest text-[9px]">
                          <CalendarDays size={13} />
                          {post.scheduledAt instanceof Date 
                            ? post.scheduledAt.toLocaleDateString() 
                            : (post.scheduledAt as any)?.toDate?.()?.toLocaleDateString() || "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <Badge variant={config.variant}>
                      {config.label}
                    </Badge>
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-90">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                      <Heart size={18} className="text-pink-500 fill-pink-500/10" strokeWidth={2.5} />
                      <span className="text-sm font-extrabold text-slate-900 leading-none">0</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform delay-75">
                      <MessageSquare size={18} className="text-blue-500 fill-blue-500/10" strokeWidth={2.5} />
                      <span className="text-sm font-extrabold text-slate-900 leading-none">0</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform delay-100">
                      <Share2 size={18} className="text-emerald-500" strokeWidth={2.5} />
                      <span className="text-sm font-extrabold text-slate-900 leading-none">0</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-10 px-6 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border-slate-100 shadow-sm active:scale-95 group-hover:bg-slate-900 group-hover:text-white transition-all">Details</Button>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-12 text-center bg-white rounded-[2.5rem] border border-slate-100 h-64">
             <MessageSquare size={48} className="text-slate-200 mb-4" />
             <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">No content found</h3>
             <p className="text-sm text-slate-500 mt-1 max-w-sm">You haven't scheduled any posts yet.</p>
          </div>
        )}

        {/* Create Post Card */}
        <button 
           className="group p-8 sm:p-10 border-2 border-dashed border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/10 rounded-[2.5rem] flex flex-col items-center justify-center transition-all duration-300 active:scale-95 text-slate-400 hover:text-indigo-600 h-full min-h-[300px]"
        >
          <div className="p-5 bg-slate-50 group-hover:bg-indigo-100 rounded-2xl mb-4 transition-colors">
            <Plus size={36} strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-xs sm:text-sm uppercase tracking-widest">Create New Content</span>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-40 mt-2">Start scheduling posts across platforms</p>
        </button>
      </div>
    </div>
  );
}
