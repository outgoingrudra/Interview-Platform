
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import {
  ArrowRightIcon,
  CheckIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  easeOut,
  spring,
  duration,
  fadeUp,
  staggerContainer,
  staggerItem,
} from "../../motion/tokens";

const highlights = [
  "HD Video and Chat",
  "Timed Assessments",
  "Security Monitoring",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-20 size-[450px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer(0.08)}
        >
          <motion.div
            variants={staggerItem}
            className="badge badge-primary badge-lg gap-2"
          >
            <SparklesIcon className="size-4" />
            Smarter Remote Hiring
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl"
          >
            Run interviews that are{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              secure, structured
            </span>{" "}
            and efficient.
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mt-6 max-w-2xl text-base leading-7 text-base-content/70 sm:text-lg"
          >
            Talent IQ combines live video, chat, timed MCQs,
            automatic evaluation and intelligent security monitoring
            in one complete interview platform.
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="mt-6 flex flex-wrap gap-2"
          >
            <motion.div
              variants={staggerContainer(0.05)}
              initial="initial"
              animate="animate"
              className="contents"
            >
              {highlights.map((highlight) => (
                <motion.span
                  key={highlight}
                  variants={staggerItem}
                  className="badge badge-outline badge-lg gap-2"
                >
                  <CheckIcon className="size-4 text-success" />
                  {highlight}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <SignedOut>
              <SignInButton mode="modal">
                <motion.button
                  type="button"
                  className="btn btn-primary btn-lg"
                  whileHover={{ filter: "brightness(1.08)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: duration.micro }}
                >
                  Start Interviewing
                  <ArrowRightIcon className="size-5" />
                </motion.button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <motion.div
                whileHover={{ filter: "brightness(1.08)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: duration.micro }}
              >
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Open Dashboard
                  <ArrowRightIcon className="size-5" />
                </Link>
              </motion.div>
            </SignedIn>

            <motion.div
              whileHover={{ filter: "brightness(1.08)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: duration.micro }}
            >
              <Link to="/practice" className="btn btn-outline btn-lg">
                <PlayCircleIcon className="size-5" />
                Explore Platform
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="mt-8 flex items-center gap-3 text-sm text-base-content/60"
          >
            <ShieldCheckIcon className="size-5 text-success" />
            <span>
              Designed for secure technical and general interviews.
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: easeOut, delay: 0.15 }}
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl" />

          <motion.div
            className="card relative overflow-hidden border border-base-300 bg-base-100 shadow-2xl"
            whileHover={{ y: -4 }}
            transition={spring.soft}
          >
            <div className="card-body p-3 sm:p-4">
              <img
                src="https://ik.imagekit.io/rudra671/ChatGPT%20Image%20Aug%201,%202026,%2002_04_44%20PM.png"
                alt="Talent IQ secure interview room"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            </div>

            <motion.div
              className="absolute left-5 top-5 badge badge-success gap-2 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring.bouncy, delay: 0.5 }}
            >
              <span className="size-2 animate-pulse rounded-full bg-success-content" />
              Secure Session
            </motion.div>

            <motion.div
              className="absolute bottom-6 right-6 rounded-xl border border-base-300 bg-base-100/95 px-4 py-3 shadow-xl backdrop-blur"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.base, ease: easeOut, delay: 0.6 }}
            >
              <p className="text-xs text-base-content/60">
                Interview status
              </p>

              <p className="font-bold text-success">
                Live and monitored
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}