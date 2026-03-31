import { UserPlus, MoreVertical, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const accounts = [
  { id: 1, name: "Jamshid Nurillayev", email: "jamshid@example.com", role: "Admin", status: "Active", avatar: "https://github.com/shadcn.png" },
  { id: 2, name: "Sardor Umrdinov", email: "sardor@example.com", role: "Manager", status: "Active", avatar: "" },
  { id: 3, name: "Aziza Karimova", email: "aziza@example.com", role: "Editor", status: "Inactive", avatar: "" },
];

export default function Accounts() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-500 mt-1">Manage team members and their roles.</p>
        </div>
        <Button className="gap-2">
          <UserPlus size={18} />
          Add Member
        </Button>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                {account.avatar ? (
                  <img src={account.avatar} alt={account.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-slate-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{account.name}</h3>
                <p className="text-sm text-slate-500">{account.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                  <Shield size={14} className="text-indigo-500" />
                  {account.role}
                </div>
                <Badge variant={account.status === "Active" ? "success" : "secondary"}>
                  {account.status}
                </Badge>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
