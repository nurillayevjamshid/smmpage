import { useState, useEffect, useCallback } from "react";
import { Project } from "@/types";
import { projectService } from "@/services/project.service";
import toast from "react-hot-toast";

export function useProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await projectService.getProjects(userId);
      setProjects(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data: Partial<Project>) => {
    if (!userId) return;
    try {
      const newProject = await projectService.createProject(userId, data);
      setProjects(prev => [newProject, ...prev]);
      toast.success("Project created successfully");
      return newProject;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const updateProject = async (projectId: string, data: Partial<Project>) => {
    if (!userId) return;
    try {
      await projectService.updateProject(projectId, data);
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...data } : p));
      toast.success("Project updated successfully");
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!userId) return;
    try {
      // Optimistic update
      setProjects(prev => prev.filter(p => p.id !== projectId));
      await projectService.deleteProject(userId, projectId);
      toast.success("Project deleted");
    } catch (err: any) {
      fetchProjects(); // Recover
      toast.error(err.message);
      throw err;
    }
  };

  return { projects, loading, error, createProject, updateProject, deleteProject, refresh: fetchProjects };
}
