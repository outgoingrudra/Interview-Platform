import {
  AlertTriangleIcon,
  Clock3Icon,
  ShieldCheckIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const formatEventName = (type = "") =>
  type
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");

const severityClasses = {
  low: {
    badge: "badge-success",
    icon: "bg-success/15 text-success",
    line: "bg-success",
  },
  medium: {
    badge: "badge-warning",
    icon: "bg-warning/15 text-warning",
    line: "bg-warning",
  },
  high: {
    badge: "badge-error",
    icon: "bg-error/15 text-error",
    line: "bg-error",
  },
};

export default function SecurityEventsList({
  events = [],
}) {
  const shouldReduceMotion =
    useReducedMotion();

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-xl backdrop-blur-xl"
    >
      <div className="absolute -right-20 -top-20 size-52 rounded-full bg-error/10 blur-3xl" />

      <div className="absolute -left-20 bottom-0 size-52 rounded-full bg-warning/10 blur-3xl" />

      <div className="relative p-5 sm:p-7">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-error">
            Security Audit
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Security Events
          </h2>

          <p className="mt-2 text-sm leading-6 text-base-content/60">
            Complete chronological record of
            suspicious activity detected during
            the interview.
          </p>
        </div>

        {events.length === 0 ? (
          <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            className="rounded-3xl border border-success/20 bg-success/5 p-10 text-center"
          >
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-success/10">
              <ShieldCheckIcon className="size-8 text-success" />
            </div>

            <h3 className="mt-4 text-xl font-black">
              Clean Interview
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              No suspicious activity was
              recorded during this interview.
            </p>
          </motion.div>
        ) : (
          <div className="relative">
            <div className="absolute bottom-0 left-6 top-0 w-[2px] bg-base-300" />

            <div className="space-y-5">
              {events.map((event, index) => {
                const severity =
                  severityClasses[
                    event?.severity
                  ] ||
                  severityClasses.medium;

                return (
                  <motion.article
                    key={event._id}
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            x: -25,
                          }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.08,
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.01,
                    }}
                    className="relative ml-14 rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm transition hover:shadow-lg"
                  >
                    <div
                      className={`absolute -left-[54px] top-5 grid size-12 place-items-center rounded-full border-4 border-base-100 ${severity.icon}`}
                    >
                      <AlertTriangleIcon className="size-5" />
                    </div>

                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-neutral">
                            #{index + 1}
                          </span>

                          <h3 className="text-lg font-black">
                            {formatEventName(
                              event.type,
                            )}
                          </h3>
                        </div>

                        {event.message && (
                          <p className="mt-3 text-sm leading-6 text-base-content/65">
                            {event.message}
                          </p>
                        )}
                      </div>

                      <span
                        className={`badge capitalize ${severity.badge}`}
                      >
                        {event.severity ||
                          "medium"}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm text-base-content/50">
                      <Clock3Icon className="size-4" />

                      {new Date(
                        event.createdAt,
                      ).toLocaleString()}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}