import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockProjects } from "@/data/mock";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Image as ImageIcon, Send, Calendar, Clock, Heart, MessageCircle, Bookmark, MoreHorizontal, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ComposePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = mockProjects.find((p) => p.id === id);

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<string[]>(project?.platforms || []);
  const [activePreview, setActivePreview] = useState<string>(platforms[0] || "instagram");

  if (!project) return <div>Project not found</div>;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local object URL for preview
      const url = URL.createObjectURL(file);
      setMedia(url);
    }
  };

  const handlePublish = () => {
    if (!caption && !media) {
      toast.error("Please add some text or media");
      return;
    }
    toast.success("Post published successfully!");
    setTimeout(() => navigate(`/projects/${id}`), 1500);
  };

  const togglePlatform = (p: string) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-slate-100 text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Post</h1>
          <p className="text-slate-500 text-sm">{project.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Composer */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none shadow-sm shadow-slate-200/50">
            <CardContent className="p-6 space-y-6">
              
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Select Platforms</label>
                <div className="flex gap-4">
                  {project.platforms.map(p => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all flex-1",
                        platforms.includes(p) 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                      )}
                    >
                      {p === 'instagram' ? <ImageIcon size={20} /> : <Send size={20} />}
                      <span className="font-medium capitalize">{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Media</label>
                <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:bg-slate-50 transition-colors relative overflow-hidden group">
                  {media ? (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                      <img src={media} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => setMedia(null)} className="bg-white text-red-600 px-4 py-2 rounded-xl font-medium text-sm">Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon size={28} />
                      </div>
                      <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleMediaUpload} accept="image/*,video/*" />
                    </div>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write an engaging caption..."
                  className="w-full h-40 border-2 border-slate-200 rounded-3xl p-5 resize-none focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all text-slate-900"
                />
              </div>

            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" className="rounded-2xl h-12 px-6 text-slate-600 border-slate-200">
              Save Draft
            </Button>
            <Button variant="secondary" className="rounded-2xl h-12 px-6 gap-2 bg-slate-200 text-slate-800 hover:bg-slate-300">
              <Calendar size={18} /> Schedule
            </Button>
            <Button onClick={handlePublish} className="rounded-2xl h-12 px-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20">
              <Send size={18} /> Publish Now
            </Button>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Live Preview</h3>
              <div className="flex bg-slate-200 p-1 rounded-xl">
                {platforms.map(p => (
                  <button
                    key={p}
                    onClick={() => setActivePreview(p)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                      activePreview === p ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Container */}
            <div className="bg-slate-100 rounded-[2.5rem] p-4 border-[8px] border-slate-200 shadow-xl mx-auto max-w-[360px] h-[700px] overflow-y-auto no-scrollbar relative">
              
              {/* Instagram Preview */}
              {activePreview === 'instagram' && (
                <div className="bg-white min-h-full rounded-3xl overflow-hidden pb-6">
                  {/* Header */}
                  <div className="flex items-center justify-between p-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 p-[2px]">
                        <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden flex items-center justify-center text-[10px] font-bold bg-slate-100">
                          {project.name.charAt(0)}
                        </div>
                      </div>
                      <span className="font-semibold text-sm text-slate-900">{project.name.toLowerCase().replace(/\s+/g, '_')}</span>
                    </div>
                    <MoreHorizontal size={20} className="text-slate-900" />
                  </div>
                  
                  {/* Image */}
                  <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                    {media ? (
                      <img src={media} alt="Post" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={48} className="text-slate-300" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Heart size={24} className="text-slate-900" />
                      <MessageCircle size={24} className="text-slate-900" />
                      <Send size={24} className="text-slate-900" />
                    </div>
                    <Bookmark size={24} className="text-slate-900" />
                  </div>

                  {/* Caption */}
                  <div className="px-3 text-sm text-slate-900">
                    <p className="mb-1"><span className="font-semibold mr-2">1,234 likes</span></p>
                    <p className="whitespace-pre-wrap">
                      <span className="font-semibold mr-2">{project.name.toLowerCase().replace(/\s+/g, '_')}</span>
                      {caption || "Your caption will appear here..."}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">Just now</p>
                  </div>
                </div>
              )}

              {/* Telegram Preview */}
              {activePreview === 'telegram' && (
                <div className="bg-[#E4EFE9] min-h-full rounded-3xl overflow-hidden relative flex flex-col">
                  {/* Header */}
                  <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm z-10">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {project.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{project.name}</h4>
                      <p className="text-xs text-blue-500">12.4K subscribers</p>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 p-4 flex flex-col justify-end">
                    <div className="bg-white rounded-2xl rounded-bl-none p-2 shadow-sm max-w-[85%]">
                      {media && (
                        <img src={media} alt="Post" className="w-full rounded-xl mb-2 object-cover" />
                      )}
                      <p className="text-[15px] leading-snug text-slate-900 whitespace-pre-wrap px-1 pb-1">
                        {caption || "Message..."}
                      </p>
                      <div className="text-right text-[11px] text-slate-400 mt-1 pr-1 flex justify-end items-center gap-1">
                        14:00 <span className="text-blue-500">✓✓</span>
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
  );
}
