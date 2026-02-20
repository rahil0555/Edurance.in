"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SystemProgressBar() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(20);
    const t1 = setTimeout(() => setWidth(70), 120);
    const t2 = setTimeout(() => setWidth(100), 240);
    const t3 = setTimeout(() => setWidth(0), 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "6px",
        width: `${width}%`,
        background:
          "linear-gradient(140deg, rgb(108, 30, 178), rgb(209, 79, 160))",
        borderRadius: "5px",
        zIndex: 9999,
        transition: "width 0.2s ease-out",
      }}
    />
  );
}
