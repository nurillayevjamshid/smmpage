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
      // 1. Trigger Facebook Login Window (Skeleton)
      console.log("Opening Facebook Login...");
      
      // 2. Mock receiving short-lived token
      const mockShortToken = "short_lived_user_token_123";
      
      // 3. Exchange for long-lived token
      const longLivedToken = await instagramService.exchangeForLongLivedToken(mockShortToken);
      
      // 4. Mock IG Business ID discovery
      const igBusinessId = await instagramService.getInstagramBusinessId("dummy_page_id", longLivedToken);
      
      // 5. Fetch account info
      const accountInfo = await instagramService.getAccountInfo(igBusinessId, longLivedToken);
      
      setAccount(accountInfo);
      onConnected(accountInfo, longLivedToken);
    } catch (err: any) {
      setError({
        code: 'UNKNOWN_ERROR',
        message: err.message || 'Failed to connect Instagram account.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    onDisconnect();
  };

  return (
    <Card className="p-6 border-pink-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">Instagram Business</h3>
            <p className="text-sm text-gray-500">Connect to publish posts and view insights</p>
          </div>
        </div>
        {account ? (
          <Badge variant="success" className="px-3 py-1">Active</Badge>
        ) : (
          <Badge variant="secondary" className="px-3 py-1">Not Connected</Badge>
        )}
      </div>

      <div className="space-y-4">
        {account ? (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <img 
                src={account.profilePictureUrl} 
                alt={account.username}
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div>
                <p className="font-medium text-gray-900">@{account.username}</p>
                <p className="text-xs text-gray-500">{account.followersCount.toLocaleString()} followers</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-600 mb-4">You need an Instagram Business Account linked to a Facebook Page.</p>
            <Button 
              onClick={handleConnect} 
              isLoading={isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-none shadow-lg hover:shadow-pink-200"
            >
              Connect with Facebook
            </Button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <p className="text-sm font-medium text-red-800">Connection Error [{error.code}]</p>
            </div>
            <p className="text-xs text-red-600 pl-6">{error.message}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <details className="group">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 flex items-center gap-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
            Show Required Meta Permissions
          </summary>
          <ul className="mt-2 text-[10px] text-gray-400 list-disc list-inside space-y-1 pl-1">
            <li>instagram_basic</li>
            <li>instagram_content_publish</li>
            <li>pages_show_list</li>
            <li>pages_read_engagement</li>
          </ul>
        </details>
      </div>
    </Card>
  );
};

export default InstagramConnect;
