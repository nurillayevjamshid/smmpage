import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

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

  const uploadFile = async (file: File, onProgress?: (p: number) => void): Promise<MediaFile> => {
    if (!userId) throw new Error("User not found");
    return new Promise((resolve, reject) => {
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `media/${userId}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => reject(error),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            const bytes = file.size;
            const size = bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

            const docRef = await addDoc(collection(db, "media_files"), {
              userId,
              projectId: "",
              name: file.name,
              url,
              type: file.type || "application/octet-stream",
              size,
              createdAt: serverTimestamp(),
            });

            resolve({
              id: docRef.id,
              userId,
              projectId: "",
              name: file.name,
              url,
              type: file.type || "application/octet-stream",
              size,
              createdAt: new Date(),
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const deleteFile = async (id: string, url: string) => {
    try {
      if (url.includes('firebasestorage')) {
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
      }
      await deleteDoc(doc(db, "media_files", id));
    } catch (error) {
      console.error("Error deleting media:", error);
      throw error;
    }
  };

  return { media, loading, uploadFile, deleteFile };
}
