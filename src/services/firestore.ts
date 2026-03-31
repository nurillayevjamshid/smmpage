import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  type DocumentData
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Project, Post, MediaFile, ActivityLog } from "../types/firebase";

// --- PROJECT SERVICES ---
export const createProject = async (userId: string, data: Partial<Project>) => {
  try {
    const projectsRef = collection(db, "projects");
    const docRef = await addDoc(projectsRef, {
      ...data,
      userId,
      postCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getProjectsByUser = async (userId: string) => {
  try {
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const updateProject = async (projectId: string, data: Partial<Project>) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    await deleteDoc(doc(db, "projects", projectId));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// --- POST SERVICES ---
export const createPost = async (userId: string, data: Partial<Post>) => {
  try {
    const postsRef = collection(db, "posts");
    const docRef = await addDoc(postsRef, {
      ...data,
      userId,
      createdAt: serverTimestamp(),
    });
    
    // Update project's post count
    if (data.projectId) {
      const projectRef = doc(db, "projects", data.projectId);
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        await updateDoc(projectRef, {
          postCount: (projectSnap.data().postCount || 0) + 1
        });
      }
    }
    
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const getPostsByProject = async (projectId: string) => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("projectId", "==", projectId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const updatePostStatus = async (postId: string, status: Post['status']) => {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { status });
  } catch (error) {
    console.error("Error updating post status:", error);
    throw error;
  }
};

// --- MEDIA SERVICES ---
export const saveMediaMetadata = async (userId: string, projectId: string, data: Partial<MediaFile>) => {
  try {
    const mediaRef = collection(db, "media_files");
    const docRef = await addDoc(mediaRef, {
      ...data,
      userId,
      projectId,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error saving media metadata:", error);
    throw error;
  }
};

export const getMediaByProject = async (projectId: string) => {
  try {
    const mediaRef = collection(db, "media_files");
    const q = query(mediaRef, where("projectId", "==", projectId), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaFile));
  } catch (error) {
    console.error("Error fetching media:", error);
    throw error;
  }
};

export const deleteMedia = async (mediaId: string) => {
  try {
    await deleteDoc(doc(db, "media_files", mediaId));
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
};

// --- ACTIVITY LOGS ---
export const logActivity = async (userId: string, projectId: string, action: string, platform: string, status: ActivityLog['status']) => {
  try {
    const logsRef = collection(db, "activity_logs");
    await addDoc(logsRef, {
      userId,
      projectId,
      action,
      platform,
      status,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export const getRecentActivity = async (userId: string) => {
  try {
    const logsRef = collection(db, "activity_logs");
    const q = query(logsRef, where("userId", "==", userId), orderBy("timestamp", "desc"), where("timestamp", ">", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))); // 7 days
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog));
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};
