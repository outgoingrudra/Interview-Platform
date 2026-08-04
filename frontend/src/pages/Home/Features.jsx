
import {
  BarChart3Icon,
  ClipboardCheckIcon,
  Clock3Icon,
  MessageSquareIcon,
  ShieldCheckIcon,
  VideoIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { easeOut, spring, duration, staggerContainer, staggerItem } from "../../motion/tokens";

const features = [
  {
    icon: VideoIcon,
    title: "Live Video Interviews",
    description:
      "Host and candidates communicate through reliable real-time video calls.",
  },
  {
    icon: MessageSquareIcon,
    title: "Integrated Live Chat",
    description:
      "Share important messages and information without leaving the interview room.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "MCQ Assessments",
    description:
      "Create multiple-choice questions with marks and automatic evaluation.",
  },
  {
    icon: Clock3Icon,
    title: "Timed Sessions",
    description:
      "Control interview duration using a live session countdown timer.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Security Monitoring",
    description:
      "Detect tab switching, clipboard actions, fullscreen exits and camera violations.",
  },
  {
    icon: BarChart3Icon,
    title: "Results and Reports",
    description:
      "Review candidate scores, answers, warnings and security events.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-base-200/60 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: duration.base, ease: easeOut }}
        >
          <span className="badge badge-secondary badge-outline">
            Complete Interview Toolkit
          </span>

          <h2 className="mt-5 text-2xl font-black sm:text-4xl lg:text-5xl">
            Everything required to conduct a{" "}
            <span className="text-primary">modern interview</span>
          </h2>

          <p className="mt-4 text-sm text-base-content/65 sm:text-base">
            Manage the complete interview lifecycle without switching
            between multiple platforms.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer(0.08)}
        >
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.article
              key={title}
              variants={staggerItem}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px -16px rgba(0,0,0,0.22)",
              }}
              transition={spring.soft}
              className="group card border border-base-300 bg-base-100"
            >
              <div className="card-body p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <motion.div
                    className="grid size-11 place-items-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary sm:size-12"
                    whileHover={{ rotate: -6, scale: 1.08 }}
                    transition={spring.soft}
                  >
                    <Icon className="size-5 text-primary transition-colors duration-300 group-hover:text-primary-content sm:size-6" />
                  </motion.div>

                  <span className="text-sm font-black text-base-content/20">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold sm:text-lg">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-base-content/65">
                  {description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}