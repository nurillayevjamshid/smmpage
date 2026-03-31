import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, serverTimestamp, orderBy, getDoc } from "firebase/firestore";
import { Project } from "@/types";
import { logActivity } from "./firestore";

export const projectService = {
  async getProjects(userId: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, "projects"), 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  },

  async createProject(userId: string, data: Partial<Project>): Promise<Project> {
    try {
      const projectsRef = collection(db, "projects");
      const docRef = await addDoc(projectsRef, {
        ...data,
        userId,
        postCount: 0,
        createdAt: serverTimestamp(),
      });
      
      await logActivity(userId, docRef.id, "Created new project", "system", "success");

      return { id: docRef.id, userId, ...data, createdAt: Date.now() } as Project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  },

  async getProject(projectId: string): Promise<Project | null> {
    try {
      const docSnap = await getDoc(doc(db, "projects", projectId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Project;
      }
      return null;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw new Error("Failed to fetch project");
    }
  },

  async deleteProject(userId: string, projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      await logActivity(userId, projectId, "Deleted project", "system", "info" as any);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }
};
