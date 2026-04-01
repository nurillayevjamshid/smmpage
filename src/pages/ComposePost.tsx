import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProject";
import { postService } from "@/services/post.service";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Image as ImageIcon, Send, ArrowLeft, LayoutGrid, CheckCircle2, MoreHorizontal, Heart, MessageCircle, Bookmark, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import MediaLibraryModal from "@/components/media/MediaLibraryModal";

export default function ComposePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { project, loading } = useProject(id);

  const [caption, setCaption] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activePreview, setActivePreview] = useState<string>("instagram");
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>("");

  // Load project platforms once project is loaded
  useEffect(() => {
    if (project?.platforms) {
      setPlatforms(project.platforms);
      setActivePreview(project.platforms[0] || "instagram");
    }
  }, [project]);

  if (loading) return <div className="p-8 animate-pulse text-center">Loading Project...</div>;
  if (!project) return <div className="p-8 text-center text-rose-500 font-bold">Project not found</div>;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setSelectedMediaUrl(null);
      setSelectedMediaType(null);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    }
  };

  const isScheduled = !!scheduleDate;

  const handleSave = async (status: 'published' | 'draft' | 'scheduled') => {
    if (!user) return;
    if (!caption && !mediaFile && !selectedMediaUrl) {
      toast.error("Please add some text or media");
      return;
    }
    
    setIsPublishing(true);
    try {
      await postService.createPost(user.id, id!, {
        caption,
        platforms,
        status,
        scheduledAt: status === 'scheduled' && scheduleDate ? new Date(scheduleDate) : undefined,
        mediaUrl: selectedMediaUrl || undefined,
        mediaType: selectedMediaType || undefined
      } as any, mediaFile || undefined);
      
      if (status === 'published') toast.success("Content deployed successfully!");
      else if (status === 'scheduled') toast.success("Content scheduled successfully!");
      else toast.success("Draft saved successfully!");
      
      setTimeout(() => navigate(`/projects/${id}`), 1000);
    } catch (error) {
      toast.error("Deployment failed");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const togglePlatform = (p: string) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-slate-100/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase italic leading-none">Draft Content</h1>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest opacity-80">{project.name} • Campaign Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button onClick={() => handleSave('draft')} disabled={isPublishing} variant="secondary" className="flex-1 sm:flex-none h-11 px-5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-sm border-slate-100 mx-1">
             Save Draft
          </Button>
          <Button onClick={() => handleSave(isScheduled ? 'scheduled' : 'published')} disabled={isPublishing} className="flex-1 sm:flex-none h-11 px-10 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase tracking-widest">
            {isScheduled ? <CalendarClock size={18} strokeWidth={2.5}/> : <Send size={18} strokeWidth={2.5} />}
            {isScheduled ? "Schedule Now" : "Deploy Now"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 sm:gap-12 pb-16">
        
        {/* Left Column - Composer */}
        <div className="xl:col-span-7 space-y-6 sm:space-y-10 order-2 xl:order-1">
          <Card className="border-none shadow-2xl shadow-slate-200/40 rounded-[2.5rem] sm:rounded-[3rem] bg-white group overflow-hidden">
            <CardContent className="p-6 sm:p-10 space-y-8 sm:space-y-12">
              
              {/* Platform Selection */}
              <div className="space-y-4">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1 px-1">
                   <LayoutGrid size={13} className="text-indigo-600" />
                   Target Platform Selection
                </label>
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {project.platforms.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={cn(
                        "flex items-center justify-center sm:justify-start gap-4 px-4 py-4 sm:p-6 rounded-2xl border-2 transition-all active:scale-95",
                        platforms.includes(p) 
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-xl shadow-indigo-500/10" 
                          : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white"
                      )}
                    >
                      <div className={cn(
                         "p-2 rounded-lg transition-colors shadow-sm",
                         platforms.includes(p) ? "bg-indigo-600 text-white" : "bg-white text-slate-300"
                      )}>
                         {p === 'instagram' ? <ImageIcon size={20} /> : <Send size={20} />}
                      </div>
                      <span className="font-black uppercase italic tracking-tighter text-sm sm:text-lg">{p}</span>
                      {platforms.includes(p) && <CheckCircle2 size={16} className="ml-auto text-indigo-500 hidden sm:block" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-1 px-1">
                  <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     Visual Branding Assets
                  </label>
                  <button onClick={() => setIsLibraryOpen(true)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                     Open Library
                  </button>
                </div>
                <div className="border-2 border-dashed border-slate-100 bg-slate-50/30 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 text-center hover:bg-slate-50 transition-all relative overflow-hidden group active:scale-[0.99] hover:border-indigo-200">
                  {mediaPreview ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                      <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 font-bold" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button onClick={() => { setMediaPreview(null); setMediaFile(null); setSelectedMediaUrl(null); setSelectedMediaType(null); }} className="bg-white text-rose-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-90 transition-all">Destruct Asset</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 sm:py-10">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white shadow-xl text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 sm:mb-8 hover:rotate-12 transition-transform duration-500">
                        <ImageIcon size={32} sm:size={40} />
                      </div>
                      <p className="text-xs sm:text-base font-black text-slate-900 uppercase tracking-tight italic">Relay creative asset</p>
                      <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">DND OR CLICK TO SYNC (MAX 50MB)</p>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleMediaUpload} accept="image/*,video/*" />
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Publication */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1 px-1">
                       <CalendarClock size={13} className="text-indigo-600" />
                       Schedule Publication
                    </label>
                 </div>
                 <div className="flex items-center gap-4">
                   <input 
                     type="datetime-local" 
                     value={scheduleDate}
                     onChange={(e) => setScheduleDate(e.target.value)}
                     className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-[1.5rem] px-6 py-4 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all text-slate-900 font-bold"
                   />
                 </div>
              </div>

              {/* Caption */}
              <div className="space-y-4">
                <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1 px-1">
                   Copywriting / Storytelling
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Draft your brand narrative..."
                  className="w-full h-40 sm:min-h-[240px] bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 resize-none focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-8 focus:ring-indigo-100 transition-all text-slate-900 text-sm sm:text-xl font-bold leading-relaxed placeholder:opacity-30 italic"
                />
              </div>

            </CardContent>
          </Card>

          {/* Action Buttons for Mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 xl:hidden">
             <Button onClick={() => handleSave('draft')} disabled={isPublishing} variant="secondary" className="w-full h-14 rounded-2xl">Save Content Archive</Button>
             <Button onClick={() => handleSave(isScheduled ? 'scheduled' : 'published')} disabled={isPublishing} className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black">
               {isScheduled ? "Schedule Deployment" : "Finalize Deployment"}
             </Button>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="xl:col-span-5 order-1 xl:order-2">
          <div className="xl:sticky xl:top-28">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 px-2">
              <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Live Realtime Preview</h3>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-sm">
                {platforms.map(p => (
                  <button
                    key={p}
                    onClick={() => setActivePreview(p)}
                    className={cn(
                      "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      activePreview === p ? "bg-white text-indigo-700 shadow-xl" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Container (Smartphone frame simulation) */}
            <div className="bg-slate-900 rounded-[3rem] sm:rounded-[4.5rem] p-3 sm:p-5 border-[10px] sm:border-[16px] border-slate-900 shadow-2xl mx-auto max-w-[360px] sm:max-w-[400px] aspect-[9/18.5] relative ring-[12px] ring-slate-100/50 group">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-900 rounded-b-[2rem] z-20 pointer-events-none" />
              
              <div className="w-full h-full bg-white rounded-[2rem] sm:rounded-[3rem] overflow-hidden relative border-4 border-slate-900/10">
                 <div className="h-full overflow-y-auto no-scrollbar pb-10">
                    {/* Instagram Preview */}
                    {activePreview === 'instagram' && (
                      <div className="bg-white min-h-full">
                        <div className="flex items-center justify-between p-4 border-b border-slate-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px]">
                              <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-[10px] font-bold bg-slate-100 uppercase italic">
                                {project.name.charAt(0)}
                              </div>
                            </div>
                            <span className="font-black text-xs text-slate-900 tracking-tight">{project.name.toLowerCase().replace(/\s+/g, '_')}</span>
                          </div>
                          <MoreHorizontal size={20} className="text-slate-500" />
                        </div>
                        
                        <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden group/img">
                          {mediaPreview ? (
                            <img src={mediaPreview} alt="Post" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                          ) : (
                            <ImageIcon size={48} className="text-slate-200" />
                          )}
                        </div>

                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <Heart size={26} className="text-slate-900 hover:text-red-500 transition-colors" />
                            <MessageCircle size={26} className="text-slate-900" />
                            <Send size={26} className="text-slate-900" />
                          </div>
                          <Bookmark size={26} className="text-slate-900" />
                        </div>

                        <div className="px-4 text-[13px] text-slate-900 leading-relaxed">
                          <p className="mb-2"><span className="font-extrabold mr-2">10,245 likes</span></p>
                          <p className="whitespace-pre-wrap font-medium">
                            <span className="font-extrabold mr-2">{project.name.toLowerCase().replace(/\s+/g, '_')}</span>
                            {caption || "Your content narrative will materialize here..."}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest leading-none">Just moments ago</p>
                        </div>
                      </div>
                    )}

                    {/* Telegram Preview */}
                    {activePreview === 'telegram' && (
                      <div className="bg-[#E4EFE9] min-h-full relative flex flex-col pt-0">
                        <div className="bg-white/80 backdrop-blur-md px-5 py-4 flex items-center gap-4 shadow-sm z-10 sticky top-0">
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-black italic shadow-inner">
                            {project.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 text-sm tracking-tight">{project.name}</h4>
                            <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">Protocol Active</p>
                          </div>
                        </div>

                        <div className="flex-1 p-5 flex flex-col justify-end space-y-4">
                          <div className="bg-white rounded-[1.25rem] rounded-bl-none p-2 shadow-2xl animate-in slide-in-from-left-2 duration-500">
                            {mediaPreview && (
                              <img src={mediaPreview} alt="Post" className="w-full rounded-xl mb-2 object-cover shadow-sm font-bold" />
                            )}
                            <p className="text-[15px] leading-relaxed text-slate-900 whitespace-pre-wrap px-2 pb-2 font-medium tracking-tight">
                              {caption || "Awaiting message packet..."}
                            </p>
                            <div className="text-right text-[10px] font-bold text-slate-400 mt-1 pr-2 flex justify-end items-center gap-1 uppercase tracking-tighter">
                              19:44 <span className="text-blue-500 tracking-normal opacity-60">✓✓</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MediaLibraryModal 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)} 
        userId={user?.id}
        onSelect={(media) => {
          setSelectedMediaUrl(media.url);
          setSelectedMediaType(media.type);
          setMediaPreview(media.url);
          setMediaFile(null);
        }}
      />
    </div>
  );
}
