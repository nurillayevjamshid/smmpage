import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { InstagramAccountInfo, InstagramErrorState } from '../../types/instagram';
import { instagramService } from '../../services/instagram.service';

interface InstagramConnectProps {
  onConnected: (account: InstagramAccountInfo, token: string) => void;
  onDisconnect: () => void;
  initialAccount?: InstagramAccountInfo;
}

const InstagramConnect: React.FC<InstagramConnectProps> = ({ 
  onConnected, 
  onDisconnect,
  initialAccount 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{code: InstagramErrorState, message: string} | null>(null);
  const [account, setAccount] = useState<InstagramAccountInfo | null>(initialAccount || null);

  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real production app, we would use FB SDK or redirect to FB Login.
      // For this implementation, we'll prompt for the short-lived token and Page ID 
      // to demonstrate the full logic of the service.
      
      const shortToken = window.prompt("Enter your Facebook User Access Token (short-lived):");
      if (!shortToken) {
        setIsLoading(false);
        return;
      }

      const fbPageId = window.prompt("Enter your Facebook Page ID (linked to Instagram Business):");
      if (!fbPageId) {
        setIsLoading(false);
        return;
      }

      // 1. Exchange for long-lived token
      const longLivedToken = await instagramService.exchangeForLongLivedToken(shortToken);
      
      // 2. Identify IG Business ID
      const igBusinessId = await instagramService.getInstagramBusinessId(fbPageId, longLivedToken);
      
      // 3. Fetch account info
      const accountInfo = await instagramService.getAccountInfo(igBusinessId, longLivedToken);
      
      setAccount(accountInfo);
      onConnected(accountInfo, longLivedToken);
    } catch (err: any) {
      console.error("Connection Error:", err);
      setError({
        code: 'UNKNOWN_ERROR',
        message: err.message || 'Failed to connect Instagram account.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect your Instagram account?")) {
      setAccount(null);
      onDisconnect();
    }
  };

  return (
    <Card className="p-6 border-pink-200 overflow-hidden relative">
      {/* Decorative gradient background element */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-lg ring-4 ring-pink-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Instagram Business</h3>
            <p className="text-sm text-gray-500 font-medium">Auto-publish to your Instagram feed</p>
          </div>
        </div>
        {account ? (
          <Badge variant="success" className="px-3 py-1 animate-pulse-slow">Active</Badge>
        ) : (
          <Badge variant="secondary" className="px-3 py-1">Ready to Connect</Badge>
        )}
      </div>

      <div className="space-y-6 relative">
        {account ? (
          <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <img 
                src={account.profilePictureUrl || "https://via.placeholder.com/150"} 
                alt={account.username}
                className="w-14 h-14 rounded-full border-2 border-pink-100 p-0.5 shadow-sm"
              />
              <div>
                <p className="font-bold text-gray-900 text-lg leading-tight">@{account.username}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {account.followersCount?.toLocaleString() || '0'} followers
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 font-semibold px-4">
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
            <div className="space-y-4">
                <div className="p-5 bg-gradient-to-br from-pink-50/50 to-purple-50/50 rounded-2xl border border-pink-100/50">
                    <h4 className="text-sm font-bold text-pink-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        Required Account Type
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        Instagram <span className="font-bold text-pink-600">Business</span> or <span className="font-bold text-purple-600">Creator</span> account is required for direct publishing.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/60 p-2 rounded-lg border border-white/40">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Linked to Facebook Page
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-white/60 p-2 rounded-lg border border-white/40">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Direct Publishing Enabled
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center items-center text-center p-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 transition-colors hover:bg-gray-50">
              <p className="text-sm text-gray-500 mb-5 font-medium">Ready to sync your feed?</p>
              <Button 
                onClick={handleConnect} 
                isLoading={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 border-none shadow-xl hover:shadow-pink-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-bold h-11"
              >
                Connect with Facebook
              </Button>
              <p className="mt-3 text-[10px] text-gray-400 font-medium">We'll never store your Facebook password</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 mb-1.5">
              <div className="p-1 rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              </div>
              <p className="text-sm font-bold text-red-800">Connection Failed</p>
            </div>
            <p className="text-xs text-red-600 pl-9 font-medium leading-relaxed">{error.message}</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100">
        <details className="group cursor-pointer">
          <summary className="text-xs font-semibold text-gray-400 hover:text-pink-500 flex items-center justify-between transition-colors outline-none list-none">
            <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Required Permissions for Direct Publishing
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
          </summary>
          <div className="mt-3 grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100/50">
            {[
                'instagram_basic', 
                'instagram_content_publish', 
                'pages_show_list', 
                'pages_read_engagement',
                'pages_manage_posts',
                'public_profile'
            ].map(perm => (
                <div key={perm} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200/50">
                    <span className="w-1 h-1 rounded-full bg-pink-400"></span>
                    {perm}
                </div>
            ))}
          </div>
        </details>
      </div>
    </Card>
  );
};

export default InstagramConnect;

