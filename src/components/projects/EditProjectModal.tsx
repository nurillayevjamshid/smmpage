import React, { useState, useEffect } from "react";
import { X, LayoutDashboard, Type, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { Project } from "@/types";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: Project | null;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
}

export default function EditProjectModal({ isOpen, onClose, onSuccess, project, updateProject }: EditProjectModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandColor, setBrandColor] = useState("bg-indigo-600");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project && isOpen) {
      setName(project.name);
      setDescription(project.description);
      setBrandColor(project.brandColor || "bg-indigo-600");
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name) {
      toast.error("Please enter a project name");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateProject(project.id, {
        name,
        description,
        brandColor,
      });
      onSuccess();
      onClose();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const colors = [
    "bg-indigo-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600", "bg-purple-600", "bg-blue-600"
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <Card className="w-full max-w-lg bg-white border-none shadow-2xl rounded-[2.5rem] relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-600">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Edit Project</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Update Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <Type size={14} className="text-indigo-600" />
              Project Name
            </label>
            <Input 
              placeholder="e.g. My Awesome Client"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 bg-slate-50 border-none rounded-2xl font-bold px-6"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <Globe size={14} className="text-indigo-600" />
              Description
            </label>
            <Input 
              placeholder="Briefly describe the project goal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-14 bg-slate-50 border-none rounded-2xl font-bold px-6"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
              <Palette size={14} className="text-indigo-600" />
              Brand Accent Color
            </label>
            <div className="flex items-center gap-3 px-1 pt-1">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBrandColor(color)}
                  className={`w-10 h-10 rounded-xl transition-all active:scale-90 ${color} ${brandColor === color ? 'ring-4 ring-indigo-100 shadow-lg scale-110' : 'opacity-80 scale-100 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-16 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
