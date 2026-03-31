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

    let q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    if (projectId) {
      q = query(q, where("projectId", "==", projectId));
    } else if (userId) {
      q = query(q, where("userId", "==", userId));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
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
