"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getHomeData } from "../service/main-service";

interface HomeData {
  projects: any[];
  tasks: any[];
}

interface HomeContextType {
  data: HomeData | null;
  loading: boolean;
  refetch: () => void;
}

const HomeContext = createContext<HomeContextType | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getHomeData();
      console.log(res)
      setData(res);
    } catch (err) {
      console.error("Failed to fetch home data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <HomeContext.Provider value={{ data, loading, refetch: fetchData }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHomeContext() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error("useHome must be used within HomeProvider");
  }
  return context;
}