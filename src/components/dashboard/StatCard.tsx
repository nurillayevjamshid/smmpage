import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export default function StatCard({ title, value, icon: Icon, color, bg }: StatCardProps) {
  return (
    <Card className="border-none shadow-sm shadow-slate-200/50">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg}`}>
          <Icon className={color} size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
