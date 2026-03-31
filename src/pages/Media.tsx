import { Upload, Search, Filter, MoreHorizontal, Image as ImageIcon, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const media = [
  { id: 1, type: "image", name: "Project-1-Hero.png", size: "2.4 MB", date: "2024-03-20", url: "https://picsum.photos/400/300?random=1" },
  { id: 2, type: "video", name: "Campaign-promo.mp4", size: "15.8 MB", date: "2024-03-18", url: "" },
  { id: 3, type: "document", name: "Strategy-Guide.pdf", size: "1.2 MB", date: "2024-03-15", url: "" },
  { id: 4, type: "image", name: "Banner-Ad.jpg", size: "1.8 MB", date: "2024-03-12", url: "https://picsum.photos/400/300?random=2" },
];

export default function Media() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Media Gallery</h1>
          <p className="text-slate-500 mt-1">Manage your uploaded media and assets.</p>
        </div>
        <Button className="gap-2">
          <Upload size={18} />
          Upload New
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input 
            placeholder="Search assets..." 
            className="bg-white border-slate-200"
            icon={<Search size={18} className="text-slate-400" />}
          />
        </div>
        <Button variant="secondary" className="gap-2">
          <Filter size={18} />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {media.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
              {item.type === "image" ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : item.type === "video" ? (
                <Video size={40} className="text-slate-400" />
              ) : (
                <FileText size={40} className="text-slate-400" />
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-white rounded-lg shadow-sm text-slate-500 hover:text-slate-900">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-slate-900 truncate max-w-[150px]">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.size} • {item.date}</p>
                </div>
                <div className="p-1.5 bg-slate-50 rounded-lg">
                  {item.type === "image" && <ImageIcon size={14} className="text-blue-500" />}
                  {item.type === "video" && <Video size={14} className="text-purple-500" />}
                  {item.type === "document" && <FileText size={14} className="text-red-500" />}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
