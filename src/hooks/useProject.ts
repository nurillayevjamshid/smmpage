import { useState, useEffect, useCallback } from "react";
import { Project } from "@/types";
import { projectService } from "@/services/project.service";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

export function useProject(projectId: string | undefined) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await projectService.getProject(projectId);
      setProject(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const updateProject = async (data: Partial<Project>) => {
    if (!projectId || !user) return;
    try {
      await projectService.updateProject(projectId, data);
      setProject(prev => prev ? { ...prev, ...data } : null);
      toast.success("Project updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update project");
      throw err;
    }
  };

  const deleteProject = async () => {
    if (!projectId || !user) return;
    try {
      await projectService.deleteProject(user.id, projectId);
      toast.success("Project deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project");
      throw err;
    }
  };

  return { project, loading, refresh: fetchProject, updateProject, deleteProject };
}
