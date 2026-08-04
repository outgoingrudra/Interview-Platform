import {
  CheckCircle2Icon,
  XCircleIcon,
} from "lucide-react";

export default function AnswerReview({ answers = [] }) {
  if (answers.length === 0) {
    return (
      <section className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body p-5 text-center">
          <p className="font-semibold">
            No answered questions to review
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <div>
          <h2 className="card-title">Answer Review</h2>

          <p className="text-sm text-base-content/60">
            Review the evaluation of your submitted answers.
          </p>
        </div>

        <div className="space-y-3">
          {answers.map((answer, index) => (
            <article
              key={answer._id || answer.questionId || index}
              className="flex items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-200/40 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {answer.isCorrect ? (
                  <CheckCircle2Icon className="size-5 shrink-0 text-success" />
                ) : (
                  <XCircleIcon className="size-5 shrink-0 text-error" />
                )}

                <div>
                  <p className="text-sm font-semibold">
                    Question {index + 1}
                  </p>

                  <p className="text-xs text-base-content/60">
                    Selected option:{" "}
                    {Number.isInteger(answer.selectedOption)
                      ? String.fromCharCode(
                          65 + answer.selectedOption,
                        )
                      : "Not answered"}
                  </p>
                </div>
              </div>

              <span
                className={`badge badge-sm ${
                  answer.isCorrect
                    ? "badge-success"
                    : "badge-error"
                }`}
              >
                {answer.marksAwarded || 0} marks
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}