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
  loading: boolean;
  hasNext: boolean;
  currentPage: number;
  currentSort: string;
  searchTerm: string;
  limit: number;
  setLimit: (val: number) => void;
  setSearchTerm: (val: string) => void;
  setCurrentSort: (val: "recent" | "alphabetical" | "created") => void;
  loadMore: () => void;
  refresh: () => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { authToken } = useAuthContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSort, setCurrentSort] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);

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

        if (res.ok) {
          const result = await res.json();
          const {
            projects,
            currentPage: respPage,
            hasNext: respHasNext,
          } = result.data;

          setProjects((prev) =>
            isAppending ? [...prev, ...projects] : projects,
          );
          setCurrentPage(respPage);
          setHasNext(respHasNext);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    },
    [authToken, currentSort, searchTerm, limit],
  );
  useEffect(() => {
    fetchProjects(0, false);
  }, [currentSort, searchTerm, limit, fetchProjects]);

  const loadMore = () => {
    if (!loading && hasNext) {
      fetchProjects(currentPage + 1, true);
    }
  };

  const refresh = () => fetchProjects(0, false);

  return (
    <HomeContext.Provider
      value={{
        projects,
        loading,
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
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(HomeContext);
  if (!context)
    throw new Error("useProjects must be used within ProjectProvider");
  return context;
};
