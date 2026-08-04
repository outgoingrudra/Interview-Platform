import {
  CirclePlusIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

const createEmptyQuestion = () => ({
  question: "",
  options: ["", ""],
  correctOption: 0,
  marks: 1,
});

export default function QuestionBuilder({
  questions,
  setQuestions,
}) {
  const addQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      createEmptyQuestion(),
    ]);
  };

  const removeQuestion = (questionIndex) => {
    setQuestions((previous) =>
      previous.filter((_, index) => index !== questionIndex),
    );
  };

  const updateQuestion = (questionIndex, field, value) => {
    setQuestions((previous) =>
      previous.map((question, index) =>
        index === questionIndex
          ? { ...question, [field]: value }
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
        if (index !== questionIndex) return question;

        const updatedOptions = [...question.options];
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
          question.options.length >= 6
        ) {
          return question;
        }

        return {
          ...question,
          options: [...question.options, ""],
        };
      }),
    );
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((previous) =>
      previous.map((question, index) => {
        if (
          index !== questionIndex ||
          question.options.length <= 2
        ) {
          return question;
        }

        const updatedOptions = question.options.filter(
          (_, index) => index !== optionIndex,
        );

        let correctOption = question.correctOption;

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

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="card-title text-xl">
              MCQ Questions
            </h2>

            <p className="text-sm text-base-content/60">
              Add between 2 and 6 options per question.
            </p>
          </div>

          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-primary btn-sm w-full sm:w-auto"
          >
            <CirclePlusIcon className="size-4" />
            Add Question
          </button>
        </div>

        {questions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-base-300 p-8 text-center">
            <p className="font-semibold">
              No questions added yet
            </p>

            <p className="mt-1 text-sm text-base-content/60">
              You can also create an interview without MCQs.
            </p>
          </div>
        )}

        <div className="space-y-5">
          {questions.map((question, questionIndex) => (
            <article
              key={questionIndex}
              className="rounded-2xl border border-base-300 bg-base-200/40 p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-bold">
                  Question {questionIndex + 1}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    removeQuestion(questionIndex)
                  }
                  className="btn btn-error btn-sm btn-circle"
                  aria-label="Remove question"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>

              <textarea
                value={question.question}
                onChange={(event) =>
                  updateQuestion(
                    questionIndex,
                    "question",
                    event.target.value,
                  )
                }
                className="textarea textarea-bordered min-h-24 w-full"
                placeholder="Enter the question"
                required
              />

              <div className="mt-5 space-y-3">
                {question.options.map(
                  (option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="radio"
                        name={`correct-${questionIndex}`}
                        checked={
                          question.correctOption ===
                          optionIndex
                        }
                        onChange={() =>
                          updateQuestion(
                            questionIndex,
                            "correctOption",
                            optionIndex,
                          )
                        }
                        className="radio radio-success shrink-0"
                      />

                      <input
                        type="text"
                        value={option}
                        onChange={(event) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            event.target.value,
                          )
                        }
                        className="input input-bordered min-w-0 flex-1"
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />

                      <button
                        type="button"
                        disabled={
                          question.options.length <= 2
                        }
                        onClick={() =>
                          removeOption(
                            questionIndex,
                            optionIndex,
                          )
                        }
                        className="btn btn-ghost btn-sm btn-circle"
                        aria-label="Remove option"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <button
                  type="button"
                  disabled={question.options.length >= 6}
                  onClick={() => addOption(questionIndex)}
                  className="btn btn-outline btn-sm w-full sm:w-auto"
                >
                  <PlusIcon className="size-4" />
                  Add Option
                </button>

                <label className="form-control w-full sm:w-32">
                  <span className="label-text mb-2">
                    Marks
                  </span>

                  <input
                    type="number"
                    min="1"
                    value={question.marks}
                    onChange={(event) =>
                      updateQuestion(
                        questionIndex,
                        "marks",
                        Number(event.target.value),
                      )
                    }
                    className="input input-bordered w-full"
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}