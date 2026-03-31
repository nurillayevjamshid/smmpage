import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ActivityLog } from "@/types";

export function useActivityLog(userId: string | undefined) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "activity_logs"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityLog[];
      setActivities(data);
      setLoading(false);
    }, (error) => {
      console.error("Activity Log Snapshot Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { activities, loading };
}
