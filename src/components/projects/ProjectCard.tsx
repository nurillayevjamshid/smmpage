import { MoreVertical, Instagram, Send as Telegram, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { useState, useRef, useEffect } from "react";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  brandColor: string;
  platforms: string[];
  postCount: number;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

export default function ProjectCard({
  id,
  name,
  description,
  brandColor,
  platforms,
  postCount,
  onClick,
  onEdit,
  onDelete,
  className
}: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-md transition-all border-slate-200 overflow-hidden relative ${className || ""}`}
      onClick={() => onClick(id)}
    >
      <div className={`h-2 w-full ${brandColor}`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm ${brandColor}`}>
            {name.charAt(0)}
          </div>
          <div className="relative" ref={menuRef}>
            <button 
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors" 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical size={20} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(id); }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Edit2 size={14} className="text-slate-400" />
                  Edit
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(id); }}
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={14} className="text-rose-400" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-1">{name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-6 h-10">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {platforms.includes("instagram") && (
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                <Instagram size={16} />
              </div>
            )}
            {platforms.includes("telegram") && (
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Telegram size={16} />
              </div>
            )}
          </div>
          <div className="text-sm font-medium text-slate-600">
            {postCount} posts
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
