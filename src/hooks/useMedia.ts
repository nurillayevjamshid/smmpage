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
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaFile[];
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
