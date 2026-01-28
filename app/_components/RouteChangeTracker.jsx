"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";


const RouteChangeTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    if (pathname === "/menu/deals") {
      window.gtag("event", "conversion", {
        send_to: "AW-16762107211/aSMqCL-Phr0aEMvq5bg-",
      });
    }

    if (pathname === "/menu/pizzas") {
      window.gtag("event", "conversion", {
        send_to: "AW-16762107211/1bTgCMuehr0aEMvq5bg-",
      });
    }

    if (pathname === "/menu/sides") {
      window.gtag("event", "conversion", {
        send_to: "AW-16762107211/KNARCM6ehr0aEMvq5bg-",
      });
    }

  }, [pathname]);

  return null;
};

export default RouteChangeTracker;
