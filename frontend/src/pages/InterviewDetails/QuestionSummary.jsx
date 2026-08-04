import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  AwardIcon,
  CircleHelpIcon,
  ClipboardListIcon,
} from "lucide-react";

function AnimatedNumber({ value = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  const motionValue = useMotionValue(0);

  const springValue = useSpring(motionValue, {
    stiffness: 120,
    damping: 18,
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

  return displayValue.toLocaleString();
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.97,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      delay: index * 0.1,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function QuestionSummary({
  questions = [],
}) {
  const shouldReduceMotion = useReducedMotion();

  const totalQuestions = questions?.length ?? 0;

  const totalMarks =
    questions?.reduce(
      (sum, question) =>
        sum +
        (Number(question?.marks) || 0),
      0,
    ) ?? 0;

  const averageMarks =
    totalQuestions > 0
      ? (
          totalMarks / totalQuestions
        ).toFixed(1)
      : "0";

  const stats = [
    {
      label: "Total Questions",
      description:
        "Questions included in the assessment",
      value: totalQuestions,
      icon: ClipboardListIcon,
      valueClass: "text-primary",
      iconClass:
        "bg-primary/15 text-primary",
      glowClass: "bg-primary/15",
    },
    {
      label: "Total Marks",
      description:
        "Maximum achievable assessment score",
      value: totalMarks,
      icon: AwardIcon,
      valueClass: "text-secondary",
      iconClass:
        "bg-secondary/15 text-secondary",
      glowClass: "bg-secondary/15",
    },
  ];

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 20,
              scale: 0.98,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-primary/10 blur-3xl transition duration-700 group-hover:scale-110" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-base-300 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: 6,
                      scale: 1.08,
                    }
              }
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 18,
              }}
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary shadow-sm"
            >
              <CircleHelpIcon className="size-6" />
            </motion.div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Assessment Overview
              </p>

              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                Questions
              </h2>

              <p className="mt-1 text-sm leading-6 text-base-content/60">
                Review the size and scoring structure
                of this interview assessment.
              </p>
            </div>
          </div>

          {totalQuestions > 0 && (
            <span className="badge badge-primary badge-lg whitespace-nowrap">
              {averageMarks} avg. marks
            </span>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {stats?.map(
            (
              {
                label,
                description,
                value,
                icon: Icon,
                valueClass,
                iconClass,
                glowClass,
              },
              index,
            ) => (
              <motion.div
                key={label}
                custom={index}
                variants={cardVariants}
                initial={
                  shouldReduceMotion
                    ? false
                    : "hidden"
                }
                animate="visible"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -4,
                        scale: 1.01,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 22,
                }}
                className="group/stat relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-200/40 p-5 shadow-sm transition hover:border-primary/30 hover:bg-base-100"
              >
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 size-28 rounded-full blur-3xl transition duration-500 group-hover/stat:scale-125 ${glowClass}`}
                />

                <div className="relative">
                  <motion.div
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            rotate: 5,
                            scale: 1.08,
                          }
                    }
                    className={`grid size-11 place-items-center rounded-2xl shadow-sm ${iconClass}`}
                  >
                    <Icon className="size-5" />
                  </motion.div>

                  <motion.p
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            scale: 0.9,
                          }
                    }
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      delay:
                        0.18 +
                        index * 0.1,
                      duration: 0.35,
                    }}
                    className={`mt-5 text-4xl font-black tracking-tight sm:text-5xl ${valueClass}`}
                  >
                    <AnimatedNumber value={value} />
                  </motion.p>

                  <p className="mt-2 text-sm font-black">
                    {label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-base-content/50">
                    {description}
                  </p>
                </div>
              </motion.div>
            ),
          )}
        </div>

        {totalQuestions === 0 && (
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 14,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.4,
            }}
            className="mt-5 rounded-3xl border border-dashed border-base-300 bg-base-200/30 p-8 text-center"
          >
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <CircleHelpIcon className="size-7" />
            </div>

            <h3 className="mt-4 text-lg font-black">
              No MCQs added
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
              This interview currently contains no
              assessment questions and can be used as
              a discussion-only interview.
            </p>
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}