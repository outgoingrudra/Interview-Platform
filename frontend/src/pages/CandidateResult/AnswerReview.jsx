import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  HelpCircleIcon,
  ListChecksIcon,
  XCircleIcon,
} from "lucide-react";

const getOptionLabel = (index) =>
  String.fromCharCode(65 + index);

export default function AnswerReview({
  answers = [],
}) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [direction, setDirection] =
    useState(1);

  const totalQuestions = answers?.length ?? 0;
  const currentAnswer =
    answers?.[currentIndex];

  useEffect(() => {
    if (
      currentIndex >= totalQuestions &&
      totalQuestions > 0
    ) {
      setCurrentIndex(totalQuestions - 1);
    }
  }, [currentIndex, totalQuestions]);

  if (!totalQuestions) {
    return (
      <motion.section
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm"
      >
        <div className="flex flex-col items-center p-8 text-center sm:p-12">
          <div className="grid size-16 place-items-center rounded-2xl bg-primary/10">
            <HelpCircleIcon className="size-8 text-primary" />
          </div>

          <h2 className="mt-4 text-xl font-black">
            No answers to review
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-base-content/60">
            This interview did not contain any submitted
            MCQ answers.
          </p>
        </div>
      </motion.section>
    );
  }

  const options =
    currentAnswer?.options ?? [];

  const selectedOptionIndex =
    currentAnswer?.selectedOptionIndex ??
    (Number.isInteger(
      currentAnswer?.selectedOption,
    )
      ? currentAnswer?.selectedOption
      : null);

  const correctOptionIndex =
    currentAnswer?.correctOptionIndex ??
    null;

  const isAnswered = Number.isInteger(
    selectedOptionIndex,
  );

  const isCorrect = Boolean(
    currentAnswer?.isCorrect,
  );

  const awardedMarks =
    currentAnswer?.awardedMarks ??
    currentAnswer?.marksAwarded ??
    0;

  const totalMarks =
    currentAnswer?.marks ?? 0;

  const correctCount =
    answers?.filter?.(
      (answer) =>
        Boolean(answer?.isCorrect),
    )?.length ?? 0;

  const incorrectCount =
    answers?.filter?.((answer) => {
      const selected =
        answer?.selectedOptionIndex ??
        (Number.isInteger(
          answer?.selectedOption,
        )
          ? answer?.selectedOption
          : null);

      return (
        Number.isInteger(selected) &&
        !answer?.isCorrect
      );
    })?.length ?? 0;

  const unansweredCount =
    totalQuestions -
    correctCount -
    incorrectCount;

  const progress =
    ((currentIndex + 1) /
      totalQuestions) *
    100;

  const goToQuestion = (nextIndex) => {
    if (
      nextIndex < 0 ||
      nextIndex >= totalQuestions ||
      nextIndex === currentIndex
    ) {
      return;
    }

    setDirection(
      nextIndex > currentIndex ? 1 : -1,
    );

    setCurrentIndex(nextIndex);
  };

  const goToPrevious = () => {
    goToQuestion(currentIndex - 1);
  };

  const goToNext = () => {
    goToQuestion(currentIndex + 1);
  };

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
      className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm"
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-base-300 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Assessment Breakdown
            </p>

            <h2 className="mt-1 text-2xl font-black">
              Answer Review
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Review each question, your answer and the
              correct option.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-success gap-1">
              <CheckCircle2Icon className="size-3.5" />
              {correctCount} Correct
            </span>

            <span className="badge badge-error gap-1">
              <XCircleIcon className="size-3.5" />
              {incorrectCount} Incorrect
            </span>

            <span className="badge badge-warning gap-1">
              <HelpCircleIcon className="size-3.5" />
              {unansweredCount} Unanswered
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-base-content/60">
            <span>
              Question{" "}
              <strong className="text-base-content">
                {currentIndex + 1}
              </strong>{" "}
              of{" "}
              <strong className="text-base-content">
                {totalQuestions}
              </strong>
            </span>

            <span className="font-semibold">
              {Math.round(progress)}%
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
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        {/* Question number navigator */}
        <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/40 p-3 sm:p-4">
          <div className="mb-3 flex items-center gap-2">
            <ListChecksIcon className="size-4 text-primary" />

            <p className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Question Navigator
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {answers?.map((answer, index) => {
              const answerSelected =
                answer?.selectedOptionIndex ??
                (Number.isInteger(
                  answer?.selectedOption,
                )
                  ? answer?.selectedOption
                  : null);

              const answered =
                Number.isInteger(
                  answerSelected,
                );

              const active =
                index === currentIndex;

              return (
                <motion.button
                  key={
                    answer?.questionId ||
                    answer?._id ||
                    index
                  }
                  type="button"
                  onClick={() =>
                    goToQuestion(index)
                  }
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.92,
                  }}
                  aria-label={`Open question ${
                    index + 1
                  }`}
                  aria-current={
                    active
                      ? "step"
                      : undefined
                  }
                  className={`btn btn-circle btn-sm shrink-0 border-2 ${
                    active
                      ? "btn-primary border-primary ring-4 ring-primary/15"
                      : answer?.isCorrect
                        ? "border-success/50 bg-success/10 text-success hover:bg-success/20"
                        : answered
                          ? "border-error/50 bg-error/10 text-error hover:bg-error/20"
                          : "border-warning/50 bg-warning/10 text-warning hover:bg-warning/20"
                  }`}
                >
                  {index + 1}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-base-content/55">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-success" />
              Correct
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-error" />
              Incorrect
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-warning" />
              Unanswered
            </span>
          </div>
        </div>

        {/* One question at a time */}
        <div className="relative mt-6 overflow-hidden">
          <AnimatePresence
            mode="wait"
            custom={direction}
          >
            <motion.article
              key={
                currentAnswer?.questionId ||
                currentAnswer?._id ||
                currentIndex
              }
              custom={direction}
              initial={{
                opacity: 0,
                x:
                  direction > 0
                    ? 60
                    : -60,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x:
                  direction > 0
                    ? -60
                    : 60,
                scale: 0.98,
              }}
              transition={{
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative overflow-hidden rounded-3xl border p-4 shadow-sm sm:p-6 ${
                isCorrect
                  ? "border-success/30 bg-success/5"
                  : isAnswered
                    ? "border-error/30 bg-error/5"
                    : "border-warning/30 bg-warning/5"
              }`}
            >
              <div
                className={`pointer-events-none absolute -right-16 -top-16 size-44 rounded-full blur-3xl ${
                  isCorrect
                    ? "bg-success/15"
                    : isAnswered
                      ? "bg-error/15"
                      : "bg-warning/15"
                }`}
              />

              <div className="relative">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <motion.div
                      initial={{
                        scale: 0.5,
                        rotate: -12,
                      }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                      }}
                      className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
                        isCorrect
                          ? "bg-success/15 text-success"
                          : isAnswered
                            ? "bg-error/15 text-error"
                            : "bg-warning/15 text-warning"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2Icon className="size-7" />
                      ) : isAnswered ? (
                        <XCircleIcon className="size-7" />
                      ) : (
                        <HelpCircleIcon className="size-7" />
                      )}
                    </motion.div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-base-content/45">
                        Question {currentIndex + 1}
                      </p>

                      <h3 className="mt-1 text-lg font-black leading-7 sm:text-xl">
                        {currentAnswer?.question ||
                          `Question ${
                            currentIndex + 1
                          }`}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`badge ${
                        isCorrect
                          ? "badge-success"
                          : isAnswered
                            ? "badge-error"
                            : "badge-warning"
                      }`}
                    >
                      {isCorrect
                        ? "Correct"
                        : isAnswered
                          ? "Incorrect"
                          : "Not Answered"}
                    </span>

                    <span className="badge badge-outline">
                      {awardedMarks}/{totalMarks} marks
                    </span>
                  </div>
                </div>

                {/* Options */}
                <div className="mt-6 grid gap-3">
                  {options?.map(
                    (option, optionIndex) => {
                      const isSelected =
                        selectedOptionIndex ===
                        optionIndex;

                      const isCorrectOption =
                        correctOptionIndex ===
                        optionIndex;

                      const isWrongSelected =
                        isSelected &&
                        !isCorrectOption;

                      return (
                        <motion.div
                          key={`${currentAnswer?.questionId}-${optionIndex}`}
                          initial={{
                            opacity: 0,
                            x: -16,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          transition={{
                            delay:
                              optionIndex * 0.06,
                          }}
                          className={`flex items-start gap-3 rounded-2xl border p-3 sm:p-4 ${
                            isCorrectOption
                              ? "border-success/40 bg-success/10"
                              : isWrongSelected
                                ? "border-error/40 bg-error/10"
                                : "border-base-300 bg-base-100/60"
                          }`}
                        >
                          <div
                            className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-black ${
                              isCorrectOption
                                ? "bg-success text-success-content"
                                : isWrongSelected
                                  ? "bg-error text-error-content"
                                  : "bg-base-300 text-base-content"
                            }`}
                          >
                            {getOptionLabel(
                              optionIndex,
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-6 sm:text-base">
                              {option}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {isSelected && (
                                <span
                                  className={`badge badge-sm ${
                                    isCorrectOption
                                      ? "badge-success"
                                      : "badge-error"
                                  }`}
                                >
                                   Selected 
                                </span>
                              )}

                              {isCorrectOption && (
                                <span className="badge badge-success badge-sm">
                                  Correct answer
                                </span>
                              )}
                            </div>
                          </div>

                          {isCorrectOption ? (
                            <CheckCircle2Icon className="size-5 shrink-0 text-success" />
                          ) : isWrongSelected ? (
                            <XCircleIcon className="size-5 shrink-0 text-error" />
                          ) : (
                            <CircleIcon className="size-5 shrink-0 text-base-content/25" />
                          )}
                        </motion.div>
                      );
                    },
                  )}
                </div>

                {/* Answer summary */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-base-300 bg-base-100/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-base-content/45">
                      Selected Option
                    </p>

                    <p
                      className={`mt-2 text-sm font-semibold ${
                        isCorrect
                          ? "text-success"
                          : isAnswered
                            ? "text-error"
                            : "text-warning"
                      }`}
                    >
                      {isAnswered
                        ? currentAnswer?.selectedOption ??
                          options?.[
                            selectedOptionIndex
                          ] ??
                          "Unknown option"
                        : "Not answered"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-success/30 bg-success/5 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-success/80">
                      Correct Answer
                    </p>

                    <p className="mt-2 text-sm font-semibold text-success">
                      {currentAnswer?.correctOption ??
                        options?.[
                          correctOptionIndex
                        ] ??
                        "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {/* Previous and next */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="btn btn-outline w-full sm:w-auto"
          >
            <ChevronLeftIcon className="size-4" />
            Previous Question
          </button>

          <p className="text-center text-xs text-base-content/50">
            Use the question numbers to jump directly
            to any answer.
          </p>

          <button
            type="button"
            onClick={goToNext}
            disabled={
              currentIndex ===
              totalQuestions - 1
            }
            className="btn btn-primary w-full sm:w-auto"
          >
            Next Question
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}