import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, serverTimestamp, orderBy, getDoc } from "firebase/firestore";
import { Project } from "@/types";
import { logActivity } from "./firestore";

export const projectService = {
  async getProjects(ownerId: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, "projects"), 
        where("ownerId", "==", ownerId),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  },

  async createProject(ownerId: string, data: Partial<Project>): Promise<Project> {
    try {
      const projectsRef = collection(db, "projects");
      const docRef = await addDoc(projectsRef, {
        ...data,
        ownerId,
        postCount: 0,
        createdAt: serverTimestamp(),
      });
      
      await logActivity(ownerId, docRef.id, "Created new project", "system", "success");

      return { id: docRef.id, ownerId, ...data, createdAt: Date.now() } as Project;
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

  async updateProject(projectId: string, data: Partial<Project>): Promise<void> {
    try {
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error("Failed to update project");
    }
  },

  async deleteProject(ownerId: string, projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      await logActivity(ownerId, projectId, "Deleted project", "system", "info" as any);
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }
};
