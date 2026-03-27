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
  refresh: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (projectId: string, isFavorited: boolean) => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { authToken, authUser } = useAuthContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
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

  useEffect(() => {
    fetchProjects(0, false);
  }, [fetchProjects]);

  useEffect(() => {
    fetchFavoriteProjects();
  }, [fetchFavoriteProjects]);

  const loadMore = () => {
    if (!loading && hasNext) {
      fetchProjects(currentPage + 1, true);
    }
  };

  const refresh = useCallback(async () => {
    await Promise.all([fetchProjects(0, false), fetchFavoriteProjects()]);
  }, [fetchProjects, fetchFavoriteProjects]);

  const refreshFavorites = useCallback(async () => {
    await fetchFavoriteProjects();
  }, [fetchFavoriteProjects]);

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

        setProjects((prev) =>
          prev.map((project) =>
            project.id === projectId
              ? { ...project, isFavorite: nextValue }
              : project,
          ),
        );

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

  return (
    <HomeContext.Provider
      value={{
        projects,
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
        refresh,
        refreshFavorites,
        toggleFavorite,
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
