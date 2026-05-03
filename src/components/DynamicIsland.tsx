import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const items = [
  { label: "about me", href: "#about" },
  { label: "get in touch", href: "mailto:shubhamk@usc.edu" },
];

export function DynamicIsland() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const current = items[index];

  return (
    <div className="nav-island">
      <div className="nav-island__inner">
        <a href="#top" className="nav-island__name">
          Shubham Kulkarni
        </a>

        <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.875rem" }}>
          <AnimatePresence mode="wait">
            <motion.a
              key={current.label}
              href={current.href}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="nav-island__link"
              style={{ display: "inline-block" }}
            >
              {current.label}
            </motion.a>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
