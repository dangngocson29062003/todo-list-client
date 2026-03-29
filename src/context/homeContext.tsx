"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAuthContext } from "./authContext";
import { Project } from "@/src/types/project";

interface HomeContextType {
  projects: Project[];
  recentProjects: Project[];
  favoriteProjects: Project[];
  loading: boolean;
  favoriteLoading: boolean;
  hasNext: boolean;
  currentPage: number;
  currentSort: string;
  searchTerm: string;
  limit: number;
  setLimit: (val: number) => void;
  setSearchTerm: (val: string) => void;
  setCurrentSort: (val: "recent" | "alphabetical" | "created") => void;
  loadMore: () => void;
  toggleFavorite: (projectId: string, isFavorited: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  removeProject: (id: string) => void;
  updateProject: (id: string, updater: (p: Project) => Project) => void;
  addRecent: (project: Project) => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { authToken, authUser } = useAuthContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentSort, setCurrentSort] = useState<
    "recent" | "alphabetical" | "created"
  >("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(6);

  const fetchProjects = useCallback(
    async (pageToFetch: number, isAppending: boolean) => {
      if (!authToken) return;

      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageToFetch.toString(),
          limit: limit.toString(),
          sortBy: currentSort,
          ...(searchTerm && { name: searchTerm }),
        });

        const res = await fetch(`/api/projects?${params.toString()}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (res.status === 404) {
          setProjects([]);
          setCurrentPage(0);
          setHasNext(false);
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

        const result = await res.json();
        const {
          projects: fetchedProjects,
          currentPage: respPage,
          hasNext: respHasNext,
        } = result.data;

        setProjects((prev) =>
          isAppending ? [...prev, ...fetchedProjects] : fetchedProjects,
        );
        setCurrentPage(respPage);
        setHasNext(respHasNext);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    },
    [authToken, currentSort, searchTerm, limit],
  );

  const fetchFavoriteProjects = useCallback(async () => {
    if (!authToken) return;

    setFavoriteLoading(true);
    try {
      const params = new URLSearchParams({
        favorite: "true",
        limit: "50",
      });

      const res = await fetch(`/api/projects?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch favorite projects");
      }

      const result = await res.json();
      setFavoriteProjects(result.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch favorite projects:", error);
    } finally {
      setFavoriteLoading(false);
    }
  }, [authToken]);
  const fetchRecentProjects = useCallback(async () => {
    if (!authToken) return;

    try {
      const res = await fetch(`/api/projects?sortBy=recent&limit=6`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) throw new Error("Failed to fetch recent projects");

      const result = await res.json();
      setRecentProjects(result.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch recent projects:", error);
    }
  }, [authToken]);
  useEffect(() => {
    fetchProjects(0, false);
  }, [fetchProjects]);
  useEffect(() => {
    fetchRecentProjects();
  }, [fetchRecentProjects]);
  useEffect(() => {
    fetchFavoriteProjects();
  }, [fetchFavoriteProjects]);
  const removeProjectEverywhere = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setRecentProjects((prev) => prev.filter((p) => p.id !== projectId));
    setFavoriteProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const updateProjectEverywhere = (
    projectId: string,
    updater: (p: Project) => Project,
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? updater(p) : p)),
    );
    setRecentProjects((prev) =>
      prev.map((p) => (p.id === projectId ? updater(p) : p)),
    );
    setFavoriteProjects((prev) =>
      prev.map((p) => (p.id === projectId ? updater(p) : p)),
    );
  };

  const addToRecent = (project: Project) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== project.id);
      return [project, ...filtered];
    });
    setRecentProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== project.id);
      return [project, ...filtered].slice(0, 6);
    });
  };
  const loadMore = () => {
    if (!loading && hasNext) {
      fetchProjects(currentPage + 1, true);
    }
  };

  const toggleFavorite = useCallback(
    async (projectId: string, isFavorited: boolean) => {
      if (!authToken || !authUser?.id) return;

      const nextValue = !isFavorited;

      const targetProject =
        projects.find((p) => p.id === projectId) ??
        favoriteProjects.find((p) => p.id === projectId);

      try {
        const res = await fetch(
          `/api/projects/${projectId}/members/${authUser.id}/favorite`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              favorite: nextValue,
            }),
          },
        );

        if (!res.ok) {
          throw new Error("Failed to update favorite");
        }

        updateProjectEverywhere(projectId, (p) => ({
          ...p,
          isFavorite: nextValue,
        }));

        if (nextValue) {
          if (targetProject) {
            setFavoriteProjects((prev) => {
              const exists = prev.some((p) => p.id === projectId);
              if (exists) return prev;
              return [{ ...targetProject, isFavorite: true }, ...prev];
            });
          } else {
            await fetchFavoriteProjects();
          }
        } else {
          setFavoriteProjects((prev) =>
            prev.filter((project) => project.id !== projectId),
          );
        }
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
      }
    },
    [
      authToken,
      authUser?.id,
      projects,
      favoriteProjects,
      fetchFavoriteProjects,
    ],
  );
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchProjects(0, false),
      fetchFavoriteProjects(),
      fetchRecentProjects(),
    ]);
  }, [fetchProjects, fetchFavoriteProjects]);
  return (
    <HomeContext.Provider
      value={{
        projects,
        recentProjects,
        favoriteProjects,
        loading,
        favoriteLoading,
        hasNext,
        currentPage,
        currentSort,
        searchTerm,
        limit,
        setLimit,
        setSearchTerm,
        setCurrentSort,
        loadMore,
        toggleFavorite,
        refresh,
        removeProject: removeProjectEverywhere,
        updateProject: updateProjectEverywhere,
        addRecent: addToRecent,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useProjects must be used within ProjectProvider");
  }
  return context;
};
