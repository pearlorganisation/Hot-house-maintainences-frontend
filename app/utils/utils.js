import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

// food categories
export const categoryEnum = ["PIZZAS", "SIDES", "DRINKS", "DESSERTS", "DIPS"];

export const usePreviousRoute = () => {
  const pathname = usePathname();
  const previousPathRef = useRef(null);

  useEffect(() => {
    previousPathRef.current = pathname;
  }, [pathname]);

  return previousPathRef.current;
};
