import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  CalendarClockIcon,
  CheckCircle2Icon,
  RadioTowerIcon,
  VideoIcon,
} from "lucide-react";

import { useGetDashboardStatsQuery } from "../../api/interviewApi";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      delay: index * 0.08,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function AnimatedNumber({ value = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  const motionValue = useMotionValue(0);

  const springValue = useSpring(motionValue, {
    stiffness: 110,
    damping: 20,
    mass: 0.8,
  });

  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(
    springValue,
    "change",
    (latestValue) => {
      setDisplayValue(
        Math.round(Number(latestValue) || 0),
      );
    },
  );

  useEffect(() => {
    const numericValue = Number(value) || 0;

    if (shouldReduceMotion) {
      motionValue.jump(numericValue);
      setDisplayValue(numericValue);
      return;
    }

    motionValue.set(numericValue);
  }, [
    value,
    motionValue,
    shouldReduceMotion,
  ]);

  return (
    <span>
      {displayValue.toLocaleString()}
    </span>
  );
}

export default function DashboardStats() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDashboardStatsQuery();

  const stats = [
    {
      label: "Total Interviews",
      description: "All interviews created",
      value: data?.stats?.total ?? 0,
      icon: VideoIcon,
      valueClass: "text-primary",
      iconClass:
        "bg-primary/15 text-primary",
      glowClass: "bg-primary/20",
      progressClass: "bg-primary",
    },
    {
      label: "Scheduled",
      description: "Upcoming interview sessions",
      value: data?.stats?.scheduled ?? 0,
      icon: CalendarClockIcon,
      valueClass: "text-secondary",
      iconClass:
        "bg-secondary/15 text-secondary",
      glowClass: "bg-secondary/20",
      progressClass: "bg-secondary",
    },
    {
      label: "Live",
      description: "Interviews active right now",
      value: data?.stats?.live ?? 0,
      icon: RadioTowerIcon,
      valueClass: "text-success",
      iconClass:
        "bg-success/15 text-success",
      glowClass: "bg-success/20",
      progressClass: "bg-success",
      live: true,
    },
    {
      label: "Completed",
      description: "Successfully finished sessions",
      value: data?.stats?.completed ?? 0,
      icon: CheckCircle2Icon,
      valueClass: "text-accent",
      iconClass:
        "bg-accent/15 text-accent",
      glowClass: "bg-accent/20",
      progressClass: "bg-accent",
    },
  ];

  if (isError) {
    return (
      <section className="overflow-hidden rounded-3xl border border-error/30 bg-base-100 shadow-sm">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-error/10">
            <VideoIcon className="size-7 text-error" />
          </div>

          <div>
            <h2 className="text-lg font-black">
              Dashboard statistics unavailable
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              {error?.data?.message ||
                "Statistics could not be loaded."}
            </p>
          </div>

          <button
            type="button"
            onClick={refetch}
            className="btn btn-error btn-sm"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Overview
          </p>

          <h2 className="mt-1 text-xl font-black sm:text-2xl">
            Interview Performance
          </h2>

          <p className="mt-1 text-sm text-base-content/55">
            A quick view of your interview
            activity.
          </p>
        </div>

        {!isLoading && (
          <div className="mt-2 flex items-center gap-2 text-xs text-base-content/50 sm:mt-0">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>

            Live dashboard
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats?.map((stat, index) => {
          const Icon = stat?.icon;

          const total =
            Number(data?.stats?.total) || 0;

          const percentage =
            stat?.label === "Total Interviews"
              ? 100
              : total > 0
                ? Math.min(
                    100,
                    Math.round(
                      (Number(stat?.value || 0) /
                        total) *
                        100,
                    ),
                  )
                : 0;

          return (
            <motion.article
              key={stat?.label}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{
                y: -6,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.99,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
              }}
              className="group relative isolate overflow-hidden rounded-3xl border border-base-300/80 bg-base-100/85 shadow-sm backdrop-blur-xl"
            >
              {/* Decorative glow */}
              <div
                className={`pointer-events-none absolute -right-12 -top-12 size-36 rounded-full blur-3xl transition duration-500 group-hover:scale-125 ${stat?.glowClass}`}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-content/[0.04] via-transparent to-transparent" />

              <div className="relative flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <motion.div
                    whileHover={{
                      rotate: 5,
                      scale: 1.08,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 18,
                    }}
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl shadow-sm ${stat?.iconClass}`}
                  >
                    <Icon className="size-6" />
                  </motion.div>

                  {stat?.live && (
                    <span className="badge badge-success badge-sm gap-1 border-success/20 bg-success/10 font-semibold text-success">
                      <span className="size-1.5 animate-pulse rounded-full bg-success" />
                      Live
                    </span>
                  )}

                  {!stat?.live && (
                    <span className="rounded-full border border-base-300 bg-base-200/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                      Updated
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  {isLoading ? (
                    <>
                      <div className="skeleton h-10 w-24" />
                      <div className="skeleton mt-3 h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <motion.h3
                        initial={{
                          opacity: 0,
                          scale: 0.9,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          delay:
                            0.18 +
                            index * 0.08,
                          duration: 0.35,
                        }}
                        className={`text-4xl font-black tracking-tight sm:text-5xl ${stat?.valueClass}`}
                      >
                        <AnimatedNumber
                          value={stat?.value}
                        />
                      </motion.h3>

                      <p className="mt-2 text-sm font-bold text-base-content">
                        {stat?.label}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-base-content/50">
                        {stat?.description}
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-auto pt-5">
                  {isLoading ? (
                    <div className="skeleton h-2 w-full rounded-full" />
                  ) : (
                    <>
                      <div className="mb-2 flex items-center justify-between text-[11px] text-base-content/45">
                        <span>
                          Share of total
                        </span>

                        <span className="font-bold text-base-content/65">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-base-300/70">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${percentage}%`,
                          }}
                          transition={{
                            delay:
                              0.3 +
                              index * 0.08,
                            duration: 0.8,
                            ease: [
                              0.22,
                              1,
                              0.36,
                              1,
                            ],
                          }}
                          className={`h-full rounded-full ${stat?.progressClass}`}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}