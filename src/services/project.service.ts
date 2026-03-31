import { db } from "@/config/firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Project } from "@/types";
import { logService } from "./log.service";

export const projectService = {
  async getProjects(userId: string): Promise<Project[]> {
    try {
      const q = query(collection(db, "projects"), where("userId", "==", userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Failed to fetch projects");
    }
  },

  async createProject(userId: string, data: Omit<Project, "id" | "userId" | "createdAt" | "platforms">): Promise<Project> {
    try {
      const newProject = {
        ...data,
        userId,
        platforms: [],
        createdAt: Date.now(),
      };
      const docRef = await addDoc(collection(db, "projects"), newProject);
      
      await logService.createLog({
        projectId: docRef.id,
        userId,
        action: "Created new project",
        platform: "system",
        status: "success"
      });

      return { id: docRef.id, ...newProject };
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  },

  async deleteProject(userId: string, projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      await logService.createLog({
        projectId,
        userId,
        action: "Deleted project",
        platform: "system",
        status: "info"
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Failed to delete project");
    }
  }
};
