import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { SocialAccount } from "@/types";

export const socialAccountService = {
  async getAccountsByProject(projectId: string): Promise<SocialAccount[]> {
    try {
      const q = query(
        collection(db, "social_accounts"),
        where("projectId", "==", projectId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SocialAccount));
    } catch (error) {
      console.error("Error fetching social accounts:", error);
      throw error;
    }
  },

  async addAccount(projectId: string, data: Partial<SocialAccount>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "social_accounts"), {
        ...data,
        projectId,
        status: data.status || "active",
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding social account:", error);
      throw error;
    }
  },

  async updateAccount(accountId: string, data: Partial<SocialAccount>): Promise<void> {
    try {
      const docRef = doc(db, "social_accounts", accountId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating social account:", error);
      throw error;
    }
  },

  async deleteAccount(accountId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "social_accounts", accountId));
    } catch (error) {
      console.error("Error deleting social account:", error);
      throw error;
    }
  },

  async testConnection(platform: string, token: string): Promise<boolean> {
    // Simulate connection testing
    return new Promise((resolve) => {
      setTimeout(() => {
        // Here you would typically call your backend API to verify the token/connection
        resolve(token.length > 5);
      }, 1500);
    });
  }
};
