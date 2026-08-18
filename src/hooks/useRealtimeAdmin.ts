"use client";

import { useEffect } from "react";

export function useRealtimeAdmin(
  arg1: (() => void) | string | string[],
  arg2?: (() => void) | string | string[]
) {
  let onRefresh: () => void = () => {};
  let tablesList: string[] = ["products", "orders", "categories", "offers", "hero_banners"];

  if (typeof arg1 === "function") {
    onRefresh = arg1;
    if (Array.isArray(arg2)) {
      tablesList = arg2;
    } else if (typeof arg2 === "string") {
      tablesList = [arg2];
    }
  } else if (typeof arg1 === "string" || Array.isArray(arg1)) {
    tablesList = Array.isArray(arg1) ? arg1 : [arg1];
    if (typeof arg2 === "function") {
      onRefresh = arg2;
    }
  }

  const tablesKey = tablesList.join(",");

  useEffect(() => {
   
  }, [onRefresh, tablesKey]);
}

