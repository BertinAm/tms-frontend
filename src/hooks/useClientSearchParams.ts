"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function useClientSearchParams() {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const get = (key: string) => {
    return isClient ? searchParams.get(key) : null;
  };

  return { get, isClient };
}
