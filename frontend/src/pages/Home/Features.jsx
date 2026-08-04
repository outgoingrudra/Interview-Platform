import {
  BarChart3Icon,
  ClipboardCheckIcon,
  Clock3Icon,
  MessageSquareIcon,
  ShieldCheckIcon,
  VideoIcon,
} from "lucide-react";

const features = [
  {
    icon: VideoIcon,
    title: "Live Video Interviews",
    description:
      "Host and candidates communicate through reliable real-time video calls.",
  },
  {
    icon: MessageSquareIcon,
    title: "Integrated Live Chat",
    description:
      "Share important messages and information without leaving the interview room.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "MCQ Assessments",
    description:
      "Create multiple-choice questions with marks and automatic evaluation.",
  },
  {
    icon: Clock3Icon,
    title: "Timed Sessions",
    description:
      "Control interview duration using a live session countdown timer.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Security Monitoring",
    description:
      "Detect tab switching, clipboard actions, fullscreen exits and camera violations.",
  },
  {
    icon: BarChart3Icon,
    title: "Results and Reports",
    description:
      "Review candidate scores, answers, warnings and security events.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-base-200/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge badge-secondary badge-outline">
            Complete Interview Toolkit
          </span>

          <h2 className="mt-5 text-3xl font-black sm:text-4xl lg:text-5xl">
            Everything required to conduct a{" "}
            <span className="text-primary">
              modern interview
            </span>
          </h2>

          <p className="mt-4 text-base-content/65">
            Manage the complete interview lifecycle without switching
            between multiple platforms.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(
            ({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="group card border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="card-body p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-xl bg-primary/10 transition group-hover:bg-primary group-hover:text-primary-content">
                      <Icon className="size-6 text-primary group-hover:text-primary-content" />
                    </div>

                    <span className="text-sm font-black text-base-content/20">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-bold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-base-content/65">
                    {description}
                  </p>
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}