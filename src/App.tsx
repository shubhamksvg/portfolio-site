import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MousePointer2, Box, Layers, Users } from "lucide-react";
import { DynamicIsland } from "./components/DynamicIsland";
import "./index.css";

type Mode = "dev" | "design";

const content: Record<Mode, { title: string; lines: string[] }> = {
  dev: {
    title:
      "I build spatial interfaces, AI-powered creative tools, and interaction systems.",
    lines: [
      "Next.js / React / TypeScript",
      "Python / ML pipelines",
      "Unity / C# / ARKit",
      "structured logic, working prototypes",
    ],
  },
  design: {
    title:
      "I design experiences that humanize technology. shaping systems to feel intuitive, responsive, and usable.",
    lines: [],
  },
};

const base = import.meta.env.BASE_URL;

const projects = [
  {
    title: "Loci.",
    desc: "A spatial widget system designed for vision OS",
    video: `${base}locihero.mp4`,
    url: `${base}loci/index.html`,
  },
  {
    title: "Monet.",
    desc: "An AI image generation tool for precise creative control",
    video: `${base}monethero.mp4`,
    url: `${base}monet/index.html`,
  },
];

const designFoci = [
  { icon: MousePointer2, label: "Interaction Design" },
  { icon: Box, label: "Spatial & Immersive UX" },
  { icon: Layers, label: "Design Systems" },
  { icon: Users, label: "User Research" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function App() {
  const [mode, setMode] = useState<Mode>("dev");
  const isDesign = mode === "design";
  const active = content[mode];

  return (
    <div className="page" id="top">
      <DynamicIsland />

      <div className="grid-layout">
        {/* ─── Left Column ──────────────────────────────── */}
        <section className="left-col" id="about">
          {/* Toggle */}
          <div className="toggle-wrap">
            {(["dev", "design"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className="toggle-btn"
              >
                {mode === item && (
                  <motion.div
                    layoutId="toggle-pill"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 9999,
                      backgroundColor: isDesign ? "#1100FF" : "#000000",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  className={`toggle-btn__label ${
                    mode === item
                      ? "toggle-btn__label--active"
                      : "toggle-btn__label--inactive"
                  }`}
                >
                  {item}
                </span>
              </button>
            ))}
          </div>

          {/* Card */}
          <motion.div
            className="content-card"
            animate={{
              borderRadius: isDesign ? 42 : 34,
              backgroundColor: isDesign ? "#e8e6e0" : "#404040",
              color: isDesign ? "#1a1a1a" : "#f5f5f5",
            }}
            transition={{ duration: 0.45, ease }}
          >
            <AnimatePresence mode="wait">
              {isDesign ? (
                /* ── Design Mode ────────────────────────── */
                <motion.div
                  key="design"
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.38, ease }}
                >
                  <p className="content-card__title--design">
                    {content.design.title}
                  </p>
                  <div className="content-card__divider--design">
                    <div className="content-card__section-label content-card__section-label--design">
                      FOCUS
                    </div>
                    <div className="content-card__list content-card__list--design">
                      {designFoci.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.06, duration: 0.32 }}
                          className="content-card__item content-card__item--design"
                        >
                          <item.icon
                            className="content-card__item-icon"
                            strokeWidth={1.5}
                          />
                          <span>{item.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ── Dev Mode ───────────────────────────── */
                <motion.div
                  key="dev"
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.38, ease }}
                >
                  <p className="content-card__title--dev">{active.title}</p>
                  <div className="content-card__divider--dev">
                    <div className="content-card__section-label content-card__section-label--dev">
                      stack
                    </div>
                    <div className="content-card__list content-card__list--dev">
                      {active.lines.map((line, index) => (
                        <motion.div
                          key={line}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.06, duration: 0.32 }}
                          className="content-card__item content-card__item--dev"
                        >
                          <span className="content-card__item-prefix">├─</span>
                          <span>{line}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ─── Right Column ─────────────────────────────── */}
        <section className="right-col">
          {projects.map((project) => (
            <a key={project.title} href={project.url} className="block group">
              <motion.div
                className="project-thumb"
                animate={{ scale: isDesign ? 1.015 : 1 }}
                transition={{ duration: 0.45 }}
              >
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <>
                    <div className="project-thumb__gradient" />
                    <div
                      className={`project-thumb__mock ${
                        isDesign
                          ? "project-thumb__mock--design"
                          : "project-thumb__mock--dev"
                      }`}
                    />
                  </>
                )}
              </motion.div>
              <div className="project-info group-hover:opacity-80 transition-opacity">
                <h2>{project.title}</h2>
                <p>{project.desc}</p>
              </div>
            </a>
          ))}
        </section>
      </div>
    </div>
  );
}
