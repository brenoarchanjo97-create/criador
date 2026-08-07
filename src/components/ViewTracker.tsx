"use client";

import { useEffect } from "react";
import { incrementPropertyViewAction } from "@/app/actions";

export function ViewTracker({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    incrementPropertyViewAction(propertyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  return null;
}
