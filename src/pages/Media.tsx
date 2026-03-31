import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMedia } from "@/hooks/useMedia";
import { Upload, Search, Filter, MoreHorizontal, Image as ImageIcon, Video, FileText, Share, Download, Trash2, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function Media() {
  const { user } = useAuth();
  const { media, loading } = useMedia(user?.id);
  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full overflow-x-hidden">
      
      {/* Media Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 border border-slate-200 rounded-[1.25rem] sm:rounded-[1.5rem] flex items-center justify-center text-slate-800 shadow-sm shrink-0">
             <ImageIcon size={24} sm:size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Media Assets</h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 opacity-80 max-w-md leading-relaxed">Centralized repository for your campaign content.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none h-11 px-5 gap-2 rounded-xl text-xs sm:text-sm font-semibold active:scale-95 shadow-sm border-slate-100/50 hover:bg-slate-50">
             Folder Management
          </Button>
          <Button className="flex-1 sm:flex-none h-11 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all">
            <Upload size={18} strokeWidth={2.5} /> Upload Media
          </Button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 pb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
          <Input 
             placeholder="Search assets by keyword..." 
             className="pl-11 h-11 sm:h-12 bg-white border-slate-100 shadow-sm rounded-xl text-sm transition-all focus:ring-4 focus:ring-indigo-50"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <Button variant="outline" className="h-11 sm:h-12 px-4 gap-2 rounded-xl border-slate-100 active:scale-95 text-xs sm:text-sm whitespace-nowrap">
             <Filter size={16} /> Images Only
          </Button>
          <div className="h-8 w-[1px] bg-slate-100 hidden sm:block mx-1" />
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button className="p-2 bg-white text-indigo-700 rounded-lg shadow-sm">
                <LayoutGrid size={18} />
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-600">
                <List size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-10">
        {loading ? (
          [1,2,3,4].map(i => (
            <div key={i} className="aspect-[4/3] bg-slate-100 animate-pulse rounded-[1.5rem] sm:rounded-[2rem]" />
          ))
        ) : media.length > 0 ? (
          media.map((item) => (
            <Card key={item.id} className="overflow-hidden group border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 rounded-[1.5rem] sm:rounded-[2rem] active:scale-[0.98] flex flex-col h-full">
              {/* Visual Preview */}
              <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center border-b border-slate-50/50 relative overflow-hidden shrink-0">
                {item.type.includes("image") ? (
                  <img 
                     src={item.url} 
                     alt={item.name} 
                     className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 ease-out" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 group-hover:scale-110 transition-transform duration-500">
                     <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-50 text-indigo-500">
                        {item.type.includes("video") ? <Video size={36} /> : <FileText size={36} />}
                     </div>
                     <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{item.type.split('/')[1] || item.type}</span>
                  </div>
                )}
                
                {/* Context Actions */}
                <div className="absolute top-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  <div className="flex flex-col gap-2">
                     <button className="p-2.5 bg-white backdrop-blur-md rounded-xl shadow-xl text-slate-600 hover:text-indigo-600 hover:scale-110 active:scale-95 transition-all">
                        <Share size={15} />
                     </button>
                     <a href={item.url} download className="p-2.5 bg-white backdrop-blur-md rounded-xl shadow-xl text-slate-600 hover:text-indigo-600 hover:scale-110 active:scale-95 transition-all">
                        <Download size={15} />
                     </a>
                  </div>
                </div>

                 {/* Hover Label */}
                 {item.type.includes("image") && (
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-gradient-to-t from-slate-900/80 to-transparent">
                       <p className="text-[10px] font-bold text-white uppercase tracking-widest truncate">{item.name}</p>
                    </div>
                 )}
              </div>

              {/* Item Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col bg-white">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-indigo-700 transition-colors uppercase tracking-tight">{item.name.split('.')[0]}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wide">
                      {item.size} • {item.createdAt instanceof Date ? item.createdAt.toLocaleDateString() : (item.createdAt as any)?.toDate?.()?.toLocaleDateString() || "Recently"}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-50">
                  <Button variant="secondary" className="h-9 px-4 rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-none border-slate-50 hover:bg-slate-100/80">View</Button>
                  <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-90">
                     <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
             <ImageIcon size={48} className="mx-auto text-slate-200 mb-4" />
             <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">No assets found</h3>
             <p className="text-sm text-slate-400 mt-2">Start uploading media to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
