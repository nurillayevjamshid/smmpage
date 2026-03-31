import { Calendar, Plus, MessageSquare, Heart, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const posts = [
  { id: 1, title: "Summer Campaign Introduction", project: "Brand Strategy 2024", platform: "Instagram", scheduledAt: "2024-03-22 10:00", likes: 124, comments: 12, shares: 8, status: "Scheduled" },
  { id: 2, title: "How to use our product", project: "Tutorial Series", platform: "LinkedIn", scheduledAt: "2024-03-23 15:30", likes: 45, comments: 5, shares: 2, status: "Draft" },
  { id: 3, title: "Customer Success Story", project: "Client Testimonials", platform: "Facebook", scheduledAt: "2024-03-24 09:00", likes: 210, comments: 24, shares: 15, status: "Published" },
  { id: 4, title: "Behind the Scenes", project: "Brand Content", platform: "Instagram", scheduledAt: "2024-03-25 12:00", likes: 89, comments: 7, shares: 3, status: "Review" }
];

export default function Posts() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Posts</h1>
          <p className="text-slate-500 mt-1">Review and organize your content across platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2">
            <Calendar size={18} />
            Calendar View
          </Button>
          <Button className="gap-2">
            <Plus size={18} />
            Create Post
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 transition-transform hover:scale-[1.01] hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                   <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{post.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="font-semibold text-slate-700">{post.project}</span>
                    </span>
                    <span>•</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-medium text-slate-700">{post.platform}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.scheduledAt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <Badge variant={
                  post.status === "Published" ? "success" : 
                  post.status === "Scheduled" ? "primary" : 
                  post.status === "Review" ? "warning" : "secondary"
                }>
                  {post.status}
                </Badge>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Heart size={16} className="text-red-400" />
                  <span className="font-medium">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <MessageSquare size={16} className="text-blue-400" />
                  <span className="font-medium">{post.comments}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Share2 size={16} className="text-green-400" />
                  <span className="font-medium">{post.shares}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
