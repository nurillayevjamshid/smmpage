import { useState, useEffect, useCallback } from "react";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import toast from "react-hot-toast";

export function usePosts(projectId?: string, userId?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId && !userId) {
      setLoading(false);
      return;
    }

    let baseQuery = collection(db, "posts");
    let q;

    if (projectId) {
      q = query(baseQuery, where("projectId", "==", projectId));
    } else if (userId) {
      q = query(baseQuery, where("userId", "==", userId));
    } else {
      q = query(baseQuery);
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      
      data.sort((a, b) => {
        const timeA = (a as any).createdAt?.toMillis?.() || (typeof (a as any).createdAt === 'number' ? (a as any).createdAt : 0);
        const timeB = (b as any).createdAt?.toMillis?.() || (typeof (b as any).createdAt === 'number' ? (b as any).createdAt : 0);
        return timeB - timeA;
      });

      setPosts(data);
      setLoading(false);
    }, (error) => {
      console.error("Posts Snapshot Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId, userId]);

  const createPost = async (data: Partial<Post>) => {
    if (!projectId) return;
    try {
      await addDoc(collection(db, "posts"), {
        ...data,
        projectId,
        createdAt: serverTimestamp(),
      });
      toast.success("Post created!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return { posts, loading, createPost };
}
