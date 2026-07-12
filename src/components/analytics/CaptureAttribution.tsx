"use client";

import { useEffect } from "react";
import { readAttribution } from "@/components/analytics/Analytics";

/** Persist UTM/gclid from the first landing URL for the session. */
export function CaptureAttribution() {
  useEffect(() => {
    readAttribution();
  }, []);
  return null;
}
