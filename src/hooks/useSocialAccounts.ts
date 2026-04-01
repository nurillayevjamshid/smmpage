import { useState, useEffect } from "react";
import { SocialAccount } from "@/types";
import { socialAccountService } from "@/services/socialAccount.service";

export function useSocialAccounts(projectId: string | undefined) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await socialAccountService.getAccountsByProject(projectId);
      setAccounts(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching accounts:", err);
      setError(err.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [projectId]);

  const addAccount = async (data: Partial<SocialAccount>) => {
    if (!projectId) return;
    try {
      await socialAccountService.addAccount(projectId, data);
      await fetchAccounts();
    } catch (err: any) {
      throw err;
    }
  };

  const updateAccount = async (id: string, data: Partial<SocialAccount>) => {
    try {
      await socialAccountService.updateAccount(id, data);
      await fetchAccounts();
    } catch (err: any) {
      throw err;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await socialAccountService.deleteAccount(id);
      await fetchAccounts();
    } catch (err: any) {
      throw err;
    }
  };

  const testConnection = async (platform: string, token: string) => {
    return await socialAccountService.testConnection(platform, token);
  };

  return {
    accounts,
    loading,
    error,
    refresh: fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    testConnection
  };
}
