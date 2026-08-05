import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ClipboardCheckIcon,
} from "lucide-react";

export default function McqPanel({
  questions = [],
  answers = {},
  setAnswers,
}) {
  const shouldReduceMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [direction, setDirection] =
    useState(1);

  const currentQuestion =
    questions?.[currentIndex];

  const attemptedCount =
    questions?.filter((question) =>
      Object.prototype.hasOwnProperty.call(
        answers,
        question?._id,
      ),
    )?.length ?? 0;

  const progress =
    questions.length > 0
      ? Math.round(
          (attemptedCount / questions.length) *
            100,
        )
      : 0;

  const selectOption = (optionIndex) => {
    if (!currentQuestion?._id) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion._id]: optionIndex,
    }));
  };

  const goToQuestion = (nextIndex) => {
    if (
      nextIndex < 0 ||
      nextIndex >= questions.length ||
      nextIndex === currentIndex
    ) {
      return;
    }

    setDirection(
      nextIndex > currentIndex ? 1 : -1,
    );

    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    goToQuestion(currentIndex - 1);
  };

  const handleNext = () => {
    goToQuestion(currentIndex + 1);
  };

  if (questions.length === 0) {
    return (
      <motion.aside
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 20,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm"
      >
        <div className="grid min-h-64 place-items-center p-6 text-center">
          <div>
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -6, 0],
                    }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary"
            >
              <ClipboardCheckIcon className="size-8" />
            </motion.div>

            <h2 className="mt-4 text-lg font-black">
              No MCQ Assessment
            </h2>

            <p className="mt-1 text-sm text-base-content/55">
              This interview contains no questions.
            </p>
          </div>
        </div>
      </motion.aside>
    );
  }

  const selectedOption =
    answers?.[currentQuestion?._id];

  const currentQuestionAttempted =
    Object.prototype.hasOwnProperty.call(
      answers,
      currentQuestion?._id,
    );

  return (
    <motion.aside
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: 25,
              scale: 0.98,
            }
      }
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-lg backdrop-blur-xl lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative flex h-full flex-col overflow-y-auto p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-base-300 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Assessment
            </p>

            <h2 className="mt-1 text-lg font-black">
              Question {currentIndex + 1}
            </h2>

            <p className="mt-1 text-xs text-base-content/55">
              {attemptedCount} of {questions.length}{" "}
              attempted
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="badge badge-primary badge-sm">
              {currentQuestion?.marks ?? 1}{" "}
              {(currentQuestion?.marks ?? 1) === 1
                ? "mark"
                : "marks"}
            </span>

            {currentQuestionAttempted && (
              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="badge badge-success badge-sm gap-1"
              >
                <CheckCircle2Icon className="size-3" />
                Attempted
              </motion.span>
            )}
          </div>
        </div>

        {/* Attempt progress */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-[11px] text-base-content/50">
            <span>Assessment progress</span>

            <span className="font-bold text-base-content/70">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-base-300">
            <motion.div
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full rounded-full bg-success"
            />
          </div>
        </div>

        {/* Animated current question */}
        <div className="relative mt-5 overflow-hidden">
          <AnimatePresence
            mode="wait"
            custom={direction}
          >
            <motion.div
              key={currentQuestion?._id}
              custom={direction}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      x:
                        direction > 0
                          ? 45
                          : -45,
                      scale: 0.98,
                    }
              }
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : {
                      opacity: 0,
                      x:
                        direction > 0
                          ? -45
                          : 45,
                      scale: 0.98,
                    }
              }
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="rounded-3xl border border-base-300 bg-base-200/35 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/45">
                  Question {currentIndex + 1}
                </p>

                <h3 className="mt-2 text-base font-black leading-6">
                  {currentQuestion?.question}
                </h3>
              </div>

              <div className="mt-4 space-y-3">
                {currentQuestion?.options?.map(
                  (option, optionIndex) => {
                    const selected =
                      selectedOption === optionIndex;

                    return (
                      <motion.button
                        key={optionIndex}
                        type="button"
                        onClick={() =>
                          selectOption(optionIndex)
                        }
                        initial={
                          shouldReduceMotion
                            ? false
                            : {
                                opacity: 0,
                                x: -12,
                              }
                        }
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            optionIndex * 0.05,
                        }}
                        whileHover={
                          shouldReduceMotion
                            ? undefined
                            : {
                                y: -2,
                                scale: 1.005,
                              }
                        }
                        whileTap={
                          shouldReduceMotion
                            ? undefined
                            : {
                                scale: 0.98,
                              }
                        }
                        className={`group/option flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                          selected
                            ? "border-primary/60 bg-primary/10 shadow-sm ring-2 ring-primary/10"
                            : "border-base-300 bg-base-200/35 hover:border-primary/35 hover:bg-base-100"
                        }`}
                      >
                        <motion.span
                          animate={{
                            scale: selected
                              ? 1.08
                              : 1,
                          }}
                          className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-black transition ${
                            selected
                              ? "bg-primary text-primary-content"
                              : "bg-base-300 text-base-content group-hover/option:bg-primary/15 group-hover/option:text-primary"
                          }`}
                        >
                          {String.fromCharCode(
                            65 + optionIndex,
                          )}
                        </motion.span>

                        <span className="min-w-0 flex-1 break-words text-sm font-medium leading-5">
                          {option}
                        </span>

                        {selected && (
                          <motion.span
                            initial={{
                              opacity: 0,
                              scale: 0.5,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-content"
                          >
                            <CheckCircle2Icon className="size-4" />
                          </motion.span>
                        )}
                      </motion.button>
                    );
                  },
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Previous / Next */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -2,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.96,
                  }
            }
            className="btn btn-outline btn-sm"
          >
            <ArrowLeftIcon className="size-3.5" />
            Previous
          </motion.button>

          {currentIndex <
          questions.length - 1 ? (
            <motion.button
              type="button"
              onClick={handleNext}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -2,
                    }
              }
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.96,
                    }
              }
              className="btn btn-primary btn-sm"
            >
              Next
              <ArrowRightIcon className="size-3.5" />
            </motion.button>
          ) : (
            <button
              type="button"
              disabled
              className="btn btn-ghost btn-sm"
            >
              Last Question
            </button>
          )}
        </div>

        {/* Question navigator */}
        <div className="mt-5 border-t border-base-300 pt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">
              Question Navigator
            </p>

            <span className="text-[11px] text-base-content/45">
              Green = attempted
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {questions?.map(
              (question, index) => {
                const isCurrent =
                  index === currentIndex;

                const isAttempted =
                  Object.prototype.hasOwnProperty.call(
                    answers,
                    question?._id,
                  );

                return (
                  <motion.button
                    key={question?._id}
                    type="button"
                    onClick={() =>
                      goToQuestion(index)
                    }
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: -2,
                          }
                    }
                    whileTap={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 0.9,
                          }
                    }
                    aria-label={`Open question ${
                      index + 1
                    }${
                      isAttempted
                        ? ", attempted"
                        : ", not attempted"
                    }`}
                    aria-current={
                      isCurrent
                        ? "step"
                        : undefined
                    }
                    className={`btn btn-circle btn-sm border-2 ${
                      isAttempted &&
                      isCurrent
                        ? "border-success bg-success text-success-content ring-4 ring-success/20"
                        : isAttempted
                          ? "border-success/50 bg-success/15 text-success hover:bg-success/25"
                          : isCurrent
                            ? "border-primary bg-primary/10 text-primary ring-4 ring-primary/15"
                            : "border-base-300 bg-base-200/50 text-base-content/60 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {index + 1}
                  </motion.button>
                );
              },
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-base-content/50">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-success" />
              Attempted
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full border-2 border-primary bg-primary/10" />
              Current
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-base-300" />
              Not attempted
            </span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}