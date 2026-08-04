import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClipboardCheckIcon,
} from "lucide-react";

export default function McqPanel({
  questions = [],
  answers,
  setAnswers,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];

  const selectOption = (optionIndex) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion._id]: optionIndex,
    }));
  };

  const handlePrevious = () => {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((previous) =>
      Math.min(previous + 1, questions.length - 1),
    );
  };

  if (questions.length === 0) {
    return (
      <aside className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body grid min-h-64 place-items-center p-4 text-center">
          <div>
            <ClipboardCheckIcon className="mx-auto size-8 text-primary" />
            <h2 className="mt-2 text-base font-bold">
              No MCQ Assessment
            </h2>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="card overflow-hidden border border-base-300 bg-base-100 shadow-sm lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)]">
      <div className="card-body overflow-y-auto p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold">
              Question {currentIndex + 1}
            </h2>

            <p className="text-xs text-base-content/60">
              {currentIndex + 1} of {questions.length}
            </p>
          </div>

          <span className="badge badge-primary badge-sm">
            {currentQuestion.marks} marks
          </span>
        </div>

        <progress
          className="progress progress-primary mt-2 h-1.5 w-full"
          value={currentIndex + 1}
          max={questions.length}
        />

        <div className="mt-3">
          <h3 className="text-sm font-semibold leading-5">
            {currentQuestion.question}
          </h3>

          <div className="mt-3 space-y-2">
            {currentQuestion.options.map((option, optionIndex) => {
              const selected =
                answers[currentQuestion._id] === optionIndex;

              return (
                <button
                  key={optionIndex}
                  type="button"
                  onClick={() => selectOption(optionIndex)}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                    selected
                      ? "border-primary bg-primary/15"
                      : "border-base-300 bg-base-200/40 hover:border-primary"
                  }`}
                >
                  <span
                    className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      selected
                        ? "bg-primary text-primary-content"
                        : "bg-base-300"
                    }`}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>

                  <span className="min-w-0 break-words">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn btn-outline btn-sm flex-1"
          >
            <ArrowLeftIcon className="size-3.5" />
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary btn-sm flex-1"
            >
              Next
              <ArrowRightIcon className="size-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="btn btn-ghost btn-sm flex-1"
            >
              Last Question
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {questions.map((question, index) => (
            <button
              key={question._id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`btn btn-circle btn-xs ${
                index === currentIndex
                  ? "btn-primary"
                  : answers[question._id] !== undefined
                    ? "btn-success"
                    : "btn-ghost"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}