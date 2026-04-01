import React, { useState } from "react";
import { Plus, Trash2, CheckCircle2, AlertCircle, RefreshCw, Send, Camera } from "lucide-react";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { X } from "lucide-react";

interface Props {
  projectId: string;
}

export default function ProjectSocialAccounts({ projectId }: Props) {
  const { accounts, loading, addAccount, deleteAccount, testConnection } = useSocialAccounts(projectId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const [formData, setFormData] = useState({
    platform: 'telegram' as 'telegram' | 'instagram',
    accountName: '',
    accountId: '',
    accessToken: '',
    chatId: ''
  });

  const handleTest = async () => {
    if (!formData.accessToken) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const targetChat = formData.chatId || formData.accountId;
      const result = await testConnection(formData.platform, formData.accessToken, targetChat);
      setTestResult(result ? 'success' : 'error');
    } catch (e) {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addAccount({
        platform: formData.platform,
        accountName: formData.accountName,
        accountId: formData.accountId,
        accessToken: formData.accessToken,
        chatId: formData.chatId,
        status: testResult === 'success' ? 'active' : 'error'
      });
      setIsModalOpen(false);
      setFormData({ platform: 'telegram', accountName: '', accountId: '', accessToken: '', chatId: '' });
      setTestResult(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    if (platform === 'telegram') return <Send size={16} className="text-blue-500" />;
    if (platform === 'instagram') return <Camera size={16} className="text-pink-500" />;
    return <RefreshCw size={16} />;
  };

  if (loading) return <div className="animate-pulse space-y-4 h-32 bg-slate-50 rounded-2xl"></div>;

  return (
    <Card className="p-6 sm:p-8 bg-white border border-slate-100 shadow-sm shadow-slate-200/20 rounded-[2.5rem] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-3">
          Social Accounts
        </h3>
        <Button 
          variant="secondary" 
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-3 gap-2 rounded-xl text-xs font-semibold"
        >
          <Plus size={14} /> Connect
        </Button>
      </div>

      <div className="space-y-4">
        {accounts.length > 0 ? (
          accounts.map(acc => (
            <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group transition-all hover:bg-slate-100/50">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm `}>
                  {getPlatformIcon(acc.platform)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 capitalize">{acc.accountName}</h4>
                  <p className="text-xs text-slate-500 capitalize">{acc.platform}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={acc.status === 'active' ? 'success' : 'destructive'}>
                  {acc.status}
                </Badge>
                <button 
                  onClick={() => {
                    if (window.confirm('Remove this account?')) {
                      deleteAccount(acc.id);
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-sm font-medium text-slate-500 mb-2">No connected accounts</p>
            <p className="text-xs text-slate-400">Connect Telegram or Instagram to publish posts.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <Card className="w-full max-w-lg bg-white border-none shadow-2xl rounded-[2.5rem] relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-600">
                  <Plus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Connect Account</h2>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Add Social Profile</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setFormData({...formData, platform: 'telegram'})}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formData.platform === 'telegram' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <Send size={18} /> <span className="font-bold text-sm">Telegram</span>
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, platform: 'instagram'})}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      formData.platform === 'instagram' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <Camera size={18} /> <span className="font-bold text-sm">Instagram</span>
                  </div>
                </div>
              </div>

              <div>
                 <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Account Name</label>
                 <input
                   type="text"
                   required
                   value={formData.accountName}
                   onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                   className="w-full h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 px-6 font-semibold text-slate-900 outline-none transition-all"
                   placeholder="e.g. My Awesome Channel"
                 />
              </div>

              <div>
                 <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">{formData.platform === 'telegram' ? 'Bot Username / Channel ID' : 'Instagram Username'}</label>
                 <input
                   type="text"
                   required
                   value={formData.accountId}
                   onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                   className="w-full h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 px-6 font-semibold text-slate-900 outline-none transition-all"
                   placeholder={formData.platform === 'telegram' ? "@username" : "username"}
                 />
              </div>

              <div>
                 <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Access Token</label>
                 <input
                   type="text"
                   required
                   value={formData.accessToken}
                   onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                   className="w-full h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 px-6 font-semibold text-slate-900 outline-none transition-all"
                   placeholder="Enter API token or access key"
                 />
              </div>

              {formData.platform === 'telegram' && (
                 <div>
                   <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Chat ID (Optional)</label>
                   <input
                     type="text"
                     value={formData.chatId}
                     onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                     className="w-full h-14 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 px-6 font-semibold text-slate-900 outline-none transition-all"
                     placeholder="-100xxxxxxxxx"
                   />
                 </div>
              )}

              <div className="flex flex-col gap-4 pt-2">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={handleTest}
                  disabled={!formData.accessToken || isTesting}
                  className="w-full h-14 rounded-2xl font-bold bg-slate-100 hover:bg-slate-200 border-none text-slate-700"
                >
                  {isTesting ? <RefreshCw className="animate-spin" size={18} /> : 'Test Connection'}
                </Button>
                
                {testResult && (
                  <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
                    testResult === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {testResult === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {testResult === 'success' ? 'Connection verified successfully!' : 'Connection failed. Please check your credentials.'}
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || testResult === 'error'} 
                    className="flex-1 h-16 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl shadow-indigo-100 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? "Saving..." : "Save Account"}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}
    </Card>
  );
}
