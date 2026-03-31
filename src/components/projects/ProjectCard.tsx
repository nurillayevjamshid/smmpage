import { MoreVertical, Instagram, Send as Telegram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  brandColor: string;
  platforms: string[];
  postCount: number;
  onClick: (id: string) => void;
}

export default function ProjectCard({
  id,
  name,
  description,
  brandColor,
  platforms,
  postCount,
  onClick,
}: ProjectCardProps) {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-md transition-all border-slate-200 overflow-hidden"
      onClick={() => onClick(id)}
    >
      <div className={`h-2 w-full ${brandColor}`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm ${brandColor}`}>
            {name.charAt(0)}
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors" onClick={(e) => e.stopPropagation()}>
            <MoreVertical size={20} />
          </button>
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
