
"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="page-loader">
      <div className="ts-loader-content">

        {/* TS LOGO */}
        <div className="ts-logo">
          <span className="ts-letter ts-letter-t">T</span>
          <span className="ts-letter ts-letter-s">S</span>
          <div className="ts-logo-glow" />
        </div>

        {/* NAME */}
        <div className="ts-loader-name">
          TAHA SIDDIQUE
        </div>

        {/* LOADING LINE */}
        <div className="ts-loader-line">
          <span />
        </div>

        {/* STATUS */}
        <p className="ts-loader-text">
          INITIALIZING SYSTEM...
        </p>

      </div>
    </div>
  );
}
