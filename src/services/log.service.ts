import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const logService = {
  async createLog(data: {
    projectId: string;
    userId: string;
    action: string;
    platform: string;
    status: 'success' | 'failed' | 'scheduled' | 'info';
  }) {
    try {
      await addDoc(collection(db, "activity_logs"), {
        ...data,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to create log:", error);
    }
  }
};
