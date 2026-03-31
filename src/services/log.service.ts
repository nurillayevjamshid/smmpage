import { db } from "@/config/firebase";
import { collection, addDoc } from "firebase/firestore";

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
        createdAt: Date.now(),
      });
    } catch (error) {
      console.error("Failed to create log:", error);
    }
  }
};
