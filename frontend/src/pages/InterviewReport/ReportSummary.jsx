import {
  AlertTriangleIcon,
  AwardIcon,
  CheckCircle2Icon,
  ShieldAlertIcon,
} from "lucide-react";

export default function ReportSummary({
  session,
  submission,
  securityEvents,
}) {
  const answers = submission?.answers || [];

  const correctAnswers = answers.filter(
    (answer) => answer.isCorrect,
  ).length;

  const stats = [
    {
      label: "Score",
      value: answers.length
        ? submission?.totalMarks ?? 0
        : "N/A",
      icon: AwardIcon,
      tone: "text-primary",
    },
    {
      label: "Correct",
      value: answers.length
        ? `${correctAnswers}/${answers.length}`
        : "N/A",
      icon: CheckCircle2Icon,
      tone: "text-success",
    },
    {
      label: "Warnings",
      value: session?.warningCount ?? 0,
      icon: AlertTriangleIcon,
      tone: "text-warning",
    },
    {
      label: "Security Events",
      value: securityEvents.length,
      icon: ShieldAlertIcon,
      tone: "text-error",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <article
          key={label}
          className="card border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="card-body p-4">
            <Icon className={`size-5 ${tone}`} />

            <p className="text-xs text-base-content/60">
              {label}
            </p>

            <p className={`text-2xl font-black ${tone}`}>
              {value}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}