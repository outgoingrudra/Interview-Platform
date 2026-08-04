
import { motion } from "framer-motion";
import { spring, duration, staggerContainer, staggerItem } from "../../motion/tokens";

const stats = [
  {
    value: "1",
    label: "Unified Interview Platform",
    className: "text-primary",
  },
  {
    value: "7+",
    label: "Configurable Security Checks",
    className: "text-secondary",
  },
  {
    value: "Live",
    label: "Video, Chat and Monitoring",
    className: "text-accent",
  },
];

export default function StatsSection() {
  return (
    <section className="px-4 py-14 sm:px-6">
      <motion.div
        className="stats stats-vertical mx-auto w-full max-w-5xl overflow-hidden border border-base-300 bg-base-100 shadow-xl md:stats-horizontal"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer(0.1)}
      >
        {stats.map((stat) => (
          <motion.div
            className="stat place-items-center text-center"
            key={stat.label}
            variants={staggerItem}
            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
            transition={{ duration: duration.fast }}
          >
            <div
              className={`stat-value flex items-center gap-2 text-3xl sm:text-4xl ${stat.className}`}
            >
              {stat.value === "Live" && (
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
                </span>
              )}
              {stat.value}
            </div>

            <div className="stat-title mt-1 whitespace-normal">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}