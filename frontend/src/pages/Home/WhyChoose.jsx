import {
  CheckCircle2Icon,
  Layers3Icon,
  LockKeyholeIcon,
  MonitorSmartphoneIcon,
  SparklesIcon,
  WorkflowIcon,
} from "lucide-react";

const reasons = [
  {
    icon: Layers3Icon,
    title: "Everything in One Place",
    description:
      "Video, chat, assessments, reports and security tools work inside one platform.",
  },
  {
    icon: LockKeyholeIcon,
    title: "Security by Design",
    description:
      "Every interview can be configured with its own monitoring and warning rules.",
  },
  {
    icon: WorkflowIcon,
    title: "Complete Workflow",
    description:
      "Create, share, start, monitor, complete and review interviews without manual coordination.",
  },
  {
    icon: MonitorSmartphoneIcon,
    title: "Responsive Experience",
    description:
      "The platform remains accessible across desktop, tablet and mobile screen sizes.",
  },
];

const benefits = [
  "Reduce manual interview coordination",
  "Automatically evaluate MCQ answers",
  "Track candidate participation",
  "Review complete security timelines",
  "Share interview links instantly",
];

export default function WhyChooseSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="badge badge-primary badge-outline gap-2">
            <SparklesIcon className="size-4" />
            Why Talent IQ
          </span>

          <h2 className="mt-5 text-3xl font-black sm:text-4xl lg:text-5xl">
            Built for more than just{" "}
            <span className="text-primary">
              video calling
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-base-content/65">
            Talent IQ turns a normal video meeting into a complete
            interview environment with structured assessments,
            monitoring and actionable reports.
          </p>

          <div className="mt-7 space-y-3">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3"
              >
                <CheckCircle2Icon className="size-5 shrink-0 text-success" />

                <span className="text-sm font-medium sm:text-base">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
            >
              <div className="grid size-11 place-items-center rounded-xl bg-secondary/10">
                <Icon className="size-5 text-secondary" />
              </div>

              <h3 className="mt-4 font-bold">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}