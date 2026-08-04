import {
  AlertTriangleIcon,
  AwardIcon,
  ClipboardCheckIcon,
} from "lucide-react";

export default function ResultSummary({
  submission,
  session,
}) {
  const answers = submission?.answers ?? [];

  const totalQuestions = answers?.length ?? 0;

  const correctAnswers = answers?.filter(
    (answer) => Boolean(answer?.isCorrect),
  )?.length ?? 0;

  const totalMarks = Number(
    submission?.totalMarks ?? 0,
  );

  const warningCount = Number(
    session?.warningCount ?? 0,
  );

  const stats = [
    {
      label: "Score",
      value: totalMarks,
      icon: AwardIcon,
      className: "text-primary",
    },
    {
      label: "Correct Answers",
      value: `${correctAnswers}/${totalQuestions}`,
      icon: ClipboardCheckIcon,
      className: "text-success",
    },
    {
      label: "Warnings",
      value: warningCount,
      icon: AlertTriangleIcon,
      className: "text-warning",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {stats?.map(
        ({
          label,
          value,
          icon: Icon,
          className,
        }) => (
          <article
            key={label}
            className="card border border-base-300 bg-base-100 shadow-sm"
          >
            <div className="card-body p-4">
              <Icon className={`size-6 ${className}`} />

              <p className="text-xs text-base-content/60">
                {label}
              </p>

              <p
                className={`text-2xl font-black ${className}`}
              >
                {value}
              </p>
            </div>
          </article>
        ),
      )}
    </section>
  );
}