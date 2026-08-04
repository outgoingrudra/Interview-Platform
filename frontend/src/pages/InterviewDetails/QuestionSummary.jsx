import { CircleHelpIcon } from "lucide-react";

export default function QuestionSummary({ questions = [] }) {
  const totalMarks = questions.reduce(
    (sum, question) => sum + Number(question.marks || 0),
    0,
  );

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15">
            <CircleHelpIcon className="size-6 text-primary" />
          </div>

          <div>
            <h2 className="card-title">Questions</h2>
            <p className="text-sm text-base-content/60">
              Assessment overview
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-base-200 p-4">
            <p className="text-sm text-base-content/60">
              Total Questions
            </p>

            <p className="mt-1 text-3xl font-black text-primary">
              {questions.length}
            </p>
          </div>

          <div className="rounded-2xl bg-base-200 p-4">
            <p className="text-sm text-base-content/60">
              Total Marks
            </p>

            <p className="mt-1 text-3xl font-black text-secondary">
              {totalMarks}
            </p>
          </div>
        </div>

        {questions.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-base-300 p-6 text-center">
            <p className="font-semibold">No MCQs added</p>
            <p className="mt-1 text-sm text-base-content/60">
              This interview currently contains no assessment questions.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}