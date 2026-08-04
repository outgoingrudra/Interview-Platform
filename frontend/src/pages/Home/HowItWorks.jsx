
import {
  BarChart3Icon,
  LinkIcon,
  PlayCircleIcon,
  Settings2Icon,
} from "lucide-react";
import { motion } from "framer-motion";
import { easeOut, spring, duration, staggerContainer, staggerItem } from "../../motion/tokens";

const steps = [
  {
    icon: Settings2Icon,
    title: "Create Interview",
    description:
      "Set duration, questions and required security protections.",
  },
  {
    icon: LinkIcon,
    title: "Share Candidate Link",
    description:
      "Copy or share the unique interview invitation instantly.",
  },
  {
    icon: PlayCircleIcon,
    title: "Conduct and Monitor",
    description:
      "Run the live interview while the platform monitors configured events.",
  },
  {
    icon: BarChart3Icon,
    title: "Review Results",
    description:
      "Analyze assessment scores, answers, warnings and security reports.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-base-200/60 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.base, ease: easeOut }}
        >
          <span className="badge badge-accent badge-outline">
            Simple Workflow
          </span>

          <h2 className="mt-5 text-2xl font-black sm:text-4xl">
            From creation to result in{" "}
            <span className="text-primary">four steps</span>
          </h2>
        </motion.div>

        <div className="relative mt-10 sm:mt-12">
          {/* Connecting line — only meaningful on md+ where steps sit in a row */}
          <motion.div
            className="absolute left-0 right-0 top-6 hidden h-px bg-base-300 md:block"
            style={{ originX: 0 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.3 }}
          />

          <motion.div
            className="relative grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer(0.1)}
          >
            {steps.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                variants={staggerItem}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 40px -16px rgba(0,0,0,0.22)",
                }}
                transition={spring.soft}
                className="relative rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5"
              >
                <span className="absolute right-4 top-4 text-3xl font-black text-base-content/10 sm:text-4xl">
                  {index + 1}
                </span>

                <motion.div
                  className="grid size-11 place-items-center rounded-xl bg-accent/10 sm:size-12"
                  whileHover={{ rotate: -6, scale: 1.08 }}
                  transition={spring.soft}
                >
                  <Icon className="size-5 text-accent sm:size-6" />
                </motion.div>

                <h3 className="mt-4 text-base font-bold sm:mt-5 sm:text-lg">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  {description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}