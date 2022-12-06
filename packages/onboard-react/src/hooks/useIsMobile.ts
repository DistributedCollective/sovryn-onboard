import { useState, useEffect, useCallback } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  const getPlatformType = useCallback(() => {
    const widthToCheck = "768px";
    const screenWidth = window?.visualViewport?.width || 0;
    return screenWidth < parseInt(widthToCheck || "0")
      ? setIsMobile(true)
      : setIsMobile(false);
  }, []);

  useEffect(() => {
    getPlatformType();
    window.addEventListener("resize", getPlatformType);

    return () => {
      window.removeEventListener("resize", getPlatformType);
    };
  }, [getPlatformType]);

  return { isMobile };
}
