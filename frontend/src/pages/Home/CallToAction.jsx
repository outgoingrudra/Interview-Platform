
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { easeOut, duration } from "../../motion/tokens";

export default function CallToAction() {
  return (
    <section className="px-4 pb-20 pt-8 sm:px-6">
      <motion.div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent p-[1px]"
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: duration.slow, ease: easeOut }}
      >
        <div className="rounded-[calc(1.5rem-1px)] bg-base-100 px-6 py-9 text-center sm:px-10 sm:py-14">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldCheckIcon className="mx-auto size-11 text-primary sm:size-12" />
          </motion.div>

          <h2 className="mt-5 text-2xl font-black sm:text-4xl">
            Ready to conduct a better interview?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-base-content/65 sm:text-base">
            Create structured interviews, monitor candidate activity
            and review detailed results from one platform.
          </p>

          <div className="mt-7">
            <SignedOut>
              <SignInButton mode="modal">
                <motion.button
                  type="button"
                  className="btn btn-primary btn-lg"
                  whileHover={{ filter: "brightness(1.08)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: duration.micro }}
                >
                  Get Started
                  <ArrowRightIcon className="size-5" />
                </motion.button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <motion.div
                className="inline-block"
                whileHover={{ filter: "brightness(1.08)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: duration.micro }}
              >
                <Link to="/interviews/create" className="btn btn-primary btn-lg">
                  Create Interview
                  <ArrowRightIcon className="size-5" />
                </Link>
              </motion.div>
            </SignedIn>
          </div>
        </div>
      </motion.div>
    </section>
  );
}