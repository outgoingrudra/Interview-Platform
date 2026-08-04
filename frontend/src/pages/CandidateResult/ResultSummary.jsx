import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  AlertTriangleIcon,
  AwardIcon,
  ClipboardCheckIcon,
} from "lucide-react";

function AnimatedNumber({
  value = 0,
  suffix = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  const motionValue = useMotionValue(0);

  const springValue = useSpring(motionValue, {
    stiffness: 120,
    damping: 18,
    mass: 0.8,
  });

  const [displayValue, setDisplayValue] =
    useState(0);

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
    const numericValue =
      Number(value) || 0;

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
      {suffix}
    </span>
  );
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.96,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      delay: index * 0.1,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function ResultSummary({
  submission,
  session,
}) {
  const answers =
    submission?.answers ?? [];

  const totalQuestions =
    answers?.length ?? 0;

  const correctAnswers =
    answers?.filter?.(
      (answer) =>
        Boolean(answer?.isCorrect),
    )?.length ?? 0;

  const totalMarks = Number(
    submission?.totalMarks ?? 0,
  );

  const warningCount = Number(
    session?.warningCount ?? 0,
  );

  const accuracy =
    totalQuestions > 0
      ? Math.round(
          (correctAnswers /
            totalQuestions) *
            100,
        )
      : 0;

  const stats = [
    {
      label: "Score",
      description:
        "Total marks secured",
      value: totalMarks,
      suffix: "",
      icon: AwardIcon,
      valueClass: "text-primary",
      iconClass:
        "bg-primary/15 text-primary",
      glowClass: "bg-primary/20",
      progress: Math.min(
        100,
        totalMarks,
      ),
      progressClass: "bg-primary",
    },

    {
      label: "Correct Answers",
      description: `${accuracy}% accuracy`,
      value: correctAnswers,
      suffix: `/${totalQuestions}`,
      icon: ClipboardCheckIcon,
      valueClass: "text-success",
      iconClass:
        "bg-success/15 text-success",
      glowClass: "bg-success/20",
      progress: accuracy,
      progressClass: "bg-success",
    },

    {
      label: "Warnings",
      description:
        warningCount === 0
          ? "Excellent integrity"
          : "Security events recorded",
      value: warningCount,
      suffix: "",
      icon: AlertTriangleIcon,
      valueClass:
        warningCount > 0
          ? "text-warning"
          : "text-success",
      iconClass:
        warningCount > 0
          ? "bg-warning/15 text-warning"
          : "bg-success/15 text-success",
      glowClass:
        warningCount > 0
          ? "bg-warning/20"
          : "bg-success/20",
      progress: Math.min(
        100,
        warningCount * 25,
      ),
      progressClass:
        warningCount > 0
          ? "bg-warning"
          : "bg-success",
    },
  ];

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
    >
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Performance Overview
        </p>

        <h2 className="mt-1 text-xl font-black sm:text-2xl">
          Result Summary
        </h2>

        <p className="mt-1 text-sm text-base-content/60">
          A quick breakdown of your performance
          and interview integrity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats?.map(
          (
            {
              label,
              description,
              value,
              suffix,
              icon: Icon,
              valueClass,
              iconClass,
              glowClass,
              progress,
              progressClass,
            },
            index,
          ) => (
            <motion.article
              key={label}
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
              className="group relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl"
            >
              <div
                className={`pointer-events-none absolute -right-14 -top-14 size-36 rounded-full blur-3xl transition duration-500 group-hover:scale-125 ${glowClass}`}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-content/[0.04] via-transparent to-transparent" />

              <div className="relative flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <motion.div
                    whileHover={{
                      rotate: 6,
                      scale: 1.08,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 18,
                    }}
                    className={`grid size-12 place-items-center rounded-2xl shadow-sm ${iconClass}`}
                  >
                    <Icon className="size-6" />
                  </motion.div>

                  <span className="rounded-full border border-base-300 bg-base-200/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-base-content/45">
                    Result
                  </span>
                </div>

                <div className="mt-6">
                  <motion.p
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
                        0.2 +
                        index * 0.1,
                      duration: 0.35,
                    }}
                    className={`text-4xl font-black tracking-tight sm:text-5xl ${valueClass}`}
                  >
                    <AnimatedNumber
                      value={value}
                      suffix={suffix}
                    />
                  </motion.p>

                  <p className="mt-2 text-sm font-bold text-base-content">
                    {label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-base-content/50">
                    {description}
                  </p>
                </div>

                <div className="mt-auto pt-5">
                  <div className="mb-2 flex items-center justify-between text-[11px] text-base-content/45">
                    <span>
                      Progress
                    </span>

                    <span className="font-bold text-base-content/65">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-base-300/70">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      animate={{
                        width: `${progress}%`,
                      }}
                      transition={{
                        delay:
                          0.35 +
                          index * 0.1,
                        duration: 0.8,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      className={`h-full rounded-full ${progressClass}`}
                    />
                  </div>
                </div>
              </div>
            </motion.article>
          ),
        )}
      </div>
    </motion.section>
  );
}