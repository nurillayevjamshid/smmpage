import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface MediaFile {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  url: string;
  type: string;
  size: string;
  createdAt: any;
}

export function useMedia(userId: string | undefined) {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "media_files"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaFile[];

      data.sort((a, b) => {
        const timeA = (a as any).createdAt?.toMillis?.() || (typeof (a as any).createdAt === 'number' ? (a as any).createdAt : 0);
        const timeB = (b as any).createdAt?.toMillis?.() || (typeof (b as any).createdAt === 'number' ? (b as any).createdAt : 0);
        return timeB - timeA;
      });

      setMedia(data);
      setLoading(false);
    }, (error) => {
      console.error("Media Snapshot Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { media, loading };
}
