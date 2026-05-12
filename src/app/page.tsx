"use client";
import { useEffect } from "react";
import { getDeviceId } from "../lib/device";
import LandingPage from "./landing/page";

export default function App() {
  useEffect(() => {
    const id = getDeviceId();
    console.log("Device ID initialized:", id);
  }, []);
  return (
    <div>
      <LandingPage />
    </div>
  );
}
