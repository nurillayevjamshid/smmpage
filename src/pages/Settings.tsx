import { Save, Bell, Shield, Palette, Globe, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your platform preferences and account details.</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 border-r border-slate-100 pr-8 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-medium">
             <Palette size={18} />
             Appearance
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium">
             <Bell size={18} />
             Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium">
             <Shield size={18} />
             Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium">
             <Globe size={18} />
             Language
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium">
             <HardDrive size={18} />
             Storage
          </button>
        </div>

        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Profile Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Display Name</label>
                <Input defaultValue="Jamshid Nurillayev" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <Input defaultValue="jamshid@example.com" type="email" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-sm font-medium text-slate-700">Bio</label>
                <textarea 
                  className="w-full min-h-[100px] p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-slate-900"
                  defaultValue="Senior Product Designer and Marketing Strategist."
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Preferences</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">Dark Mode</p>
                      <p className="text-xs text-slate-500">Enable dark theme for the interface.</p>
                   </div>
                   <input type="checkbox" className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                </div>
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                      <p className="text-xs text-slate-500">Receive weekly digests and updates.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-600 cursor-pointer" />
                </div>
             </div>
          </Card>

          <div className="flex items-center justify-end gap-3">
             <Button variant="secondary">Cancel</Button>
             <Button className="gap-2">
                <Save size={18} />
                Save Changes
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
