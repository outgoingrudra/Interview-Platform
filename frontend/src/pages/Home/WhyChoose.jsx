
import {
  CheckCircle2Icon,
  Layers3Icon,
  LockKeyholeIcon,
  MonitorSmartphoneIcon,
  SparklesIcon,
  WorkflowIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { easeOut, spring, duration, staggerContainer, staggerItem } from "../../motion/tokens";

const reasons = [
  {
    icon: Layers3Icon,
    title: "Everything in One Place",
    description:
      "Video, chat, assessments, reports and security tools work inside one platform.",
  },
  {
    icon: LockKeyholeIcon,
    title: "Security by Design",
    description:
      "Every interview can be configured with its own monitoring and warning rules.",
  },
  {
    icon: WorkflowIcon,
    title: "Complete Workflow",
    description:
      "Create, share, start, monitor, complete and review interviews without manual coordination.",
  },
  {
    icon: MonitorSmartphoneIcon,
    title: "Responsive Experience",
    description:
      "The platform remains accessible across desktop, tablet and mobile screen sizes.",
  },
];

const benefits = [
  "Reduce manual interview coordination",
  "Automatically evaluate MCQ answers",
  "Track candidate participation",
  "Review complete security timelines",
  "Share interview links instantly",
];

export default function WhyChooseSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.base, ease: easeOut }}
        >
          <span className="badge badge-primary badge-outline gap-2">
            <SparklesIcon className="size-4" />
            Why Talent IQ
          </span>

          <h2 className="mt-5 text-2xl font-black sm:text-4xl lg:text-5xl">
            Built for more than just{" "}
            <span className="text-primary">video calling</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-base-content/65 sm:mt-5 sm:text-base">
            Talent IQ turns a normal video meeting into a complete
            interview environment with structured assessments,
            monitoring and actionable reports.
          </p>

          <motion.div
            className="mt-6 space-y-3 sm:mt-7"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer(0.07, 0.1)}
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit}
                variants={staggerItem}
                className="flex items-center gap-3"
              >
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={spring.bouncy}
                >
                  <CheckCircle2Icon className="size-5 shrink-0 text-success" />
                </motion.span>

                <span className="text-sm font-medium sm:text-base">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="grid gap-3 sm:grid-cols-2 sm:gap-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer(0.08)}
        >
          {reasons.map(({ icon: Icon, title, description }) => (
            <motion.article
              key={title}
              variants={staggerItem}
              whileHover={{
                y: -5,
                boxShadow: "0 18px 36px -16px rgba(0,0,0,0.2)",
              }}
              transition={spring.soft}
              className="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5"
            >
              <motion.div
                className="grid size-11 place-items-center rounded-xl bg-secondary/10"
                whileHover={{ rotate: -6, scale: 1.08 }}
                transition={spring.soft}
              >
                <Icon className="size-5 text-secondary" />
              </motion.div>

              <h3 className="mt-4 font-bold">{title}</h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                {description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}