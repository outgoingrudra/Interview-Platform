import {
  CalendarClockIcon,
  CheckCircle2Icon,
  MailIcon,
  ShieldAlertIcon,
  UserIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

const getStatusClass = (status) => {
  const classes = {
    waiting: "badge-ghost",
    active: "badge-success",
    submitted: "badge-primary",
    completed: "badge-info",
    expired: "badge-warning",
    terminated: "badge-error",
  };

  return classes?.[status] || "badge-ghost";
};

export default function CandidateInfoCard({ session }) {
  const candidate = session?.candidate;

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 25,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
      }}
      className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-xl backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -left-20 bottom-0 size-56 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <motion.div
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 1.05,
                  }
            }
            className="avatar"
          >
            <div className="w-24 rounded-full ring ring-primary ring-offset-4 ring-offset-base-100">
              {candidate?.imageUrl ? (
                <img
                  src={candidate.imageUrl}
                  alt={candidate?.name}
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-primary text-3xl font-black text-primary-content">
                  {candidate?.name?.charAt(0)?.toUpperCase() ||
                    "U"}
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex-1">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Candidate Report
                </p>

                <h2 className="mt-1 text-3xl font-black">
                  {candidate?.name ||
                    "Unknown Candidate"}
                </h2>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span
                    className={`badge badge-lg capitalize ${getStatusClass(
                      session?.status,
                    )}`}
                  >
                    {session?.status}
                  </span>

                  <span className="badge badge-outline">
                    Session Report
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-success/20 bg-success/10 px-5 py-4 text-center">
                <p className="text-xs uppercase tracking-wider text-success">
                  Warnings
                </p>

                <p className="mt-1 text-3xl font-black text-success">
                  {session?.warningCount ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <MailIcon className="size-5 text-primary" />

                  <div>
                    <p className="text-xs uppercase tracking-wider text-base-content/50">
                      Email
                    </p>

                    <p className="font-semibold break-all">
                      {candidate?.email ||
                        "No email"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <UserIcon className="size-5 text-secondary" />

                  <div>
                    <p className="text-xs uppercase tracking-wider text-base-content/50">
                      Candidate Status
                    </p>

                    <p className="font-semibold capitalize">
                      {session?.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <CalendarClockIcon className="size-5 text-info" />

                  <div>
                    <p className="text-xs uppercase tracking-wider text-base-content/50">
                      Started At
                    </p>

                    <p className="font-semibold">
                      {formatDate(
                        session?.startedAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4 transition hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2Icon className="size-5 text-success" />

                  <div>
                    <p className="text-xs uppercase tracking-wider text-base-content/50">
                      Submitted At
                    </p>

                    <p className="font-semibold">
                      {formatDate(
                        session?.submittedAt,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-warning/20 bg-warning/5 p-4">
              <div className="flex items-center gap-3">
                <ShieldAlertIcon className="size-5 text-warning" />

                <div>
                  <p className="font-bold">
                    Security Monitoring
                  </p>

                  <p className="text-sm text-base-content/60">
                    This report contains candidate
                    activity, warnings and security
                    events recorded during the
                    interview.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}