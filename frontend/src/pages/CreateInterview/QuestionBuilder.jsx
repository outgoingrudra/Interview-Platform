import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  CircleCheckIcon,
  CirclePlusIcon,
  GripVerticalIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";

const createEmptyQuestion = () => ({
  question: "",
  options: ["", ""],
  correctOption: 0,
  marks: 1,
});

const questionVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 40,
    scale: 0.96,
    transition: {
      duration: 0.25,
    },
  },
};

export default function QuestionBuilder({
  questions,
  setQuestions,
}) {
  const shouldReduceMotion = useReducedMotion();

  const addQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      createEmptyQuestion(),
    ]);
  };

  const removeQuestion = (questionIndex) => {
    setQuestions((previous) =>
      previous.filter(
        (_, index) => index !== questionIndex,
      ),
    );
  };

  const updateQuestion = (
    questionIndex,
    field,
    value,
  ) => {
    setQuestions((previous) =>
      previous.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              [field]: value,
            }
          : question,
      ),
    );
  };

  const updateOption = (
    questionIndex,
    optionIndex,
    value,
  ) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        const updatedOptions = [
          ...(question?.options ?? []),
        ];

        updatedOptions[optionIndex] = value;

        return {
          ...question,
          options: updatedOptions,
        };
      }),
    );
  };

  const addOption = (questionIndex) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (
          index !== questionIndex ||
          (question?.options?.length ?? 0) >= 6
        ) {
          return question;
        }

        return {
          ...question,
          options: [
            ...(question?.options ?? []),
            "",
          ],
        };
      }),
    );
  };

  const removeOption = (
    questionIndex,
    optionIndex,
  ) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (
          index !== questionIndex ||
          (question?.options?.length ?? 0) <= 2
        ) {
          return question;
        }

        const updatedOptions =
          question?.options?.filter(
            (_, index) =>
              index !== optionIndex,
          ) ?? [];

        let correctOption =
          question?.correctOption ?? 0;

        if (optionIndex === correctOption) {
          correctOption = 0;
        } else if (optionIndex < correctOption) {
          correctOption -= 1;
        }

        return {
          ...question,
          options: updatedOptions,
          correctOption,
        };
      }),
    );
  };

  const totalMarks =
    questions?.reduce(
      (sum, question) =>
        sum +
        (Number(question?.marks) || 0),
      0,
    ) ?? 0;

  return (
    <motion.section
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
              scale: 0.98,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-secondary/10 blur-3xl transition duration-700 group-hover:scale-110" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-content/[0.035] via-transparent to-transparent" />

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
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary shadow-sm"
            >
              <SparklesIcon className="size-6" />
            </motion.div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Step 2
              </p>

              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                MCQ Questions
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                Create assessment questions with
                2–6 options and select the correct
                answer.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-outline">
              {questions?.length ?? 0}{" "}
              {(questions?.length ?? 0) === 1
                ? "Question"
                : "Questions"}
            </span>

            <span className="badge badge-secondary">
              {totalMarks} Marks
            </span>

            <motion.button
              type="button"
              onClick={addQuestion}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -2,
                      scale: 1.02,
                    }
              }
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.96,
                    }
              }
              className="btn btn-primary btn-sm w-full sm:w-auto"
            >
              <CirclePlusIcon className="size-4" />
              Add Question
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {(questions?.length ?? 0) === 0 && (
            <motion.div
              key="empty-state"
              initial={{
                opacity: 0,
                y: 16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
              }}
              className="mt-6 rounded-3xl border border-dashed border-base-300 bg-base-200/30 p-8 text-center sm:p-12"
            >
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <CirclePlusIcon className="size-8" />
              </div>

              <h3 className="mt-4 text-xl font-black">
                No questions added yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
                You can create an interview without
                MCQs, or add assessment questions to
                evaluate candidates automatically.
              </p>

              <motion.button
                type="button"
                onClick={addQuestion}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="btn btn-primary mt-5"
              >
                <PlusIcon className="size-4" />
                Add First Question
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 space-y-5">
          <AnimatePresence mode="popLayout">
            {questions?.map(
              (question, questionIndex) => (
                <motion.article
                  key={
                    question?._id ??
                    question?.clientId ??
                    questionIndex
                  }
                  layout
                  variants={questionVariants}
                  initial={
                    shouldReduceMotion
                      ? false
                      : "hidden"
                  }
                  animate="visible"
                  exit={
                    shouldReduceMotion
                      ? undefined
                      : "exit"
                  }
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -3,
                        }
                  }
                  className="group/question relative overflow-hidden rounded-3xl border border-base-300 bg-base-200/35 p-4 shadow-sm transition hover:border-primary/35 hover:bg-base-100 hover:shadow-lg sm:p-5"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/8 blur-3xl transition duration-500 group-hover/question:scale-125" />

                  <div className="relative">
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
                          <span className="font-black">
                            {questionIndex + 1}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-black">
                            Question{" "}
                            {questionIndex + 1}
                          </h3>

                          <p className="mt-0.5 text-xs text-base-content/50">
                            Configure the question,
                            options and marks.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <GripVerticalIcon className="hidden size-4 text-base-content/30 sm:block" />

                        <motion.button
                          type="button"
                          onClick={() =>
                            removeQuestion(
                              questionIndex,
                            )
                          }
                          whileHover={{
                            rotate: -6,
                            scale: 1.06,
                          }}
                          whileTap={{
                            scale: 0.9,
                          }}
                          className="btn btn-error btn-sm btn-circle"
                          aria-label={`Remove question ${
                            questionIndex + 1
                          }`}
                        >
                          <Trash2Icon className="size-4" />
                        </motion.button>
                      </div>
                    </div>

                    <label className="form-control">
                      <span className="mb-2 text-sm font-semibold text-base-content/80">
                        Question text
                      </span>

                      <textarea
                        value={
                          question?.question ?? ""
                        }
                        onChange={(event) =>
                          updateQuestion(
                            questionIndex,
                            "question",
                            event?.target?.value,
                          )
                        }
                        className="textarea min-h-28 w-full rounded-2xl border border-base-300 bg-base-100/70 text-base leading-6 outline-none transition focus:border-primary/60 focus:shadow-md focus:shadow-primary/5"
                        placeholder="Enter your question"
                        required
                      />
                    </label>

                    <div className="mt-6">
                      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-bold">
                            Answer options
                          </p>

                          <p className="text-xs text-base-content/50">
                            Select the radio button
                            beside the correct answer.
                          </p>
                        </div>

                        <span className="badge badge-ghost badge-sm">
                          {question?.options?.length ??
                            0}
                          /6 options
                        </span>
                      </div>

                      <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                          {question?.options?.map(
                            (
                              option,
                              optionIndex,
                            ) => {
                              const isCorrect =
                                question?.correctOption ===
                                optionIndex;

                              return (
                                <motion.div
                                  key={optionIndex}
                                  layout
                                  initial={{
                                    opacity: 0,
                                    x: -16,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    x: 20,
                                  }}
                                  transition={{
                                    duration: 0.28,
                                  }}
                                  className={`group/option flex items-center gap-3 rounded-2xl border p-3 transition ${
                                    isCorrect
                                      ? "border-success/40 bg-success/10"
                                      : "border-base-300 bg-base-100/65 hover:border-primary/30"
                                  }`}
                                >
                                  <label className="relative grid shrink-0 cursor-pointer place-items-center">
                                    <input
                                      type="radio"
                                      name={`correct-${questionIndex}`}
                                      checked={
                                        isCorrect
                                      }
                                      onChange={() =>
                                        updateQuestion(
                                          questionIndex,
                                          "correctOption",
                                          optionIndex,
                                        )
                                      }
                                      className="radio radio-success"
                                    />

                                    {isCorrect && (
                                      <motion.span
                                        initial={{
                                          scale: 0,
                                        }}
                                        animate={{
                                          scale: 1,
                                        }}
                                        className="pointer-events-none absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-success text-success-content"
                                      >
                                        <CircleCheckIcon className="size-3" />
                                      </motion.span>
                                    )}
                                  </label>

                                  <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-base-300/70 text-sm font-black text-base-content">
                                    {String.fromCharCode(
                                      65 +
                                        optionIndex,
                                    )}
                                  </div>

                                  <input
                                    type="text"
                                    value={option ?? ""}
                                    onChange={(event) =>
                                      updateOption(
                                        questionIndex,
                                        optionIndex,
                                        event?.target
                                          ?.value,
                                      )
                                    }
                                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-base-content/35 sm:text-base"
                                    placeholder={`Option ${
                                      optionIndex + 1
                                    }`}
                                    required
                                  />

                                  <motion.button
                                    type="button"
                                    disabled={
                                      (question?.options
                                        ?.length ?? 0) <=
                                      2
                                    }
                                    onClick={() =>
                                      removeOption(
                                        questionIndex,
                                        optionIndex,
                                      )
                                    }
                                    whileHover={{
                                      rotate: -6,
                                    }}
                                    whileTap={{
                                      scale: 0.9,
                                    }}
                                    className="btn btn-ghost btn-sm btn-circle shrink-0 text-base-content/45 hover:text-error"
                                    aria-label={`Remove option ${
                                      optionIndex + 1
                                    }`}
                                  >
                                    <Trash2Icon className="size-4" />
                                  </motion.button>
                                </motion.div>
                              );
                            },
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4 border-t border-base-300 pt-5 sm:flex-row sm:items-end sm:justify-between">
                      <motion.button
                        type="button"
                        disabled={
                          (question?.options?.length ??
                            0) >= 6
                        }
                        onClick={() =>
                          addOption(questionIndex)
                        }
                        whileHover={{
                          y: -2,
                        }}
                        whileTap={{
                          scale: 0.96,
                        }}
                        className="btn btn-outline btn-sm w-full sm:w-auto"
                      >
                        <PlusIcon className="size-4" />
                        Add Option
                      </motion.button>

                      <label className="form-control w-full sm:w-36">
                        <span className="mb-2 text-sm font-semibold text-base-content/80">
                          Marks
                        </span>

                        <input
                          type="number"
                          min="1"
                          value={
                            question?.marks ?? 1
                          }
                          onChange={(event) =>
                            updateQuestion(
                              questionIndex,
                              "marks",
                              Number(
                                event?.target
                                  ?.value,
                              ),
                            )
                          }
                          className="input input-bordered w-full rounded-2xl bg-base-100"
                        />
                      </label>
                    </div>
                  </div>
                </motion.article>
              ),
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}