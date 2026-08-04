import {
  BarChart3Icon,
  LinkIcon,
  PlayCircleIcon,
  Settings2Icon,
} from "lucide-react";

const steps = [
  {
    icon: Settings2Icon,
    title: "Create Interview",
    description:
      "Set duration, questions and required security protections.",
  },
  {
    icon: LinkIcon,
    title: "Share Candidate Link",
    description:
      "Copy or share the unique interview invitation instantly.",
  },
  {
    icon: PlayCircleIcon,
    title: "Conduct and Monitor",
    description:
      "Run the live interview while the platform monitors configured events.",
  },
  {
    icon: BarChart3Icon,
    title: "Review Results",
    description:
      "Analyze assessment scores, answers, warnings and security reports.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-base-200/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="badge badge-accent badge-outline">
            Simple Workflow
          </span>

          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            From creation to result in{" "}
            <span className="text-primary">
              four steps
            </span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(
            ({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="relative rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <span className="absolute right-4 top-4 text-4xl font-black text-base-content/10">
                  {index + 1}
                </span>

                <div className="grid size-12 place-items-center rounded-xl bg-accent/10">
                  <Icon className="size-6 text-accent" />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  {description}
                </p>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}