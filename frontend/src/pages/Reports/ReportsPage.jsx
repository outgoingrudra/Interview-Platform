import { Link } from "react-router-dom";
import {
  BarChart3Icon,
  CalendarDaysIcon,
  ClipboardListIcon,
  UsersIcon,
} from "lucide-react";

import { useGetMyInterviewsQuery } from "../../api/interviewApi";

const getStatusClass = (status) => {
  const classes = {
    draft: "badge-ghost",
    scheduled: "badge-warning",
    live: "badge-success",
    completed: "badge-info",
    cancelled: "badge-error",
  };

  return classes?.[status] || "badge-ghost";
};

export default function ReportsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetMyInterviewsQuery();

  const interviews = data?.interviews ?? [];

  if (isLoading) {
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-base-200 p-4">
        <div className="alert alert-error mx-auto max-w-4xl">
          {error?.data?.message ||
            "Interview reports could not be loaded"}
        </div>
      </main>
    );
  }

  const completedInterviews = interviews?.filter(
    (interview) =>
      interview?.status === "completed" ||
      interview?.status === "live",
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3Icon className="size-7 text-primary" />

              <h1 className="text-3xl font-black sm:text-4xl">
                Interview Reports
              </h1>
            </div>

            <p className="mt-2 text-base-content/60">
              Review candidate sessions, results and security activity.
            </p>
          </div>

          <span className="badge badge-primary badge-lg">
            {completedInterviews?.length ?? 0} interviews
          </span>
        </header>

        {completedInterviews?.length === 0 ? (
          <section className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body items-center p-10 text-center">
              <ClipboardListIcon className="size-12 text-base-content/30" />

              <h2 className="mt-3 text-xl font-bold">
                No reports available
              </h2>

              <p className="mt-1 max-w-md text-sm text-base-content/60">
                Reports will appear after candidates join and complete
                your interviews.
              </p>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {completedInterviews?.map((interview) => (
              <article
                key={interview?._id}
                className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="card-body p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold">
                        {interview?.title || "Interview"}
                      </h2>

                      <p className="mt-1 text-xs text-base-content/60">
                        ID: {interview?._id}
                      </p>
                    </div>

                    <span
                      className={`badge badge-sm capitalize ${getStatusClass(
                        interview?.status,
                      )}`}
                    >
                      {interview?.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-base-content/70">
                    <p className="flex items-center gap-2">
                      <CalendarDaysIcon className="size-4" />

                      {interview?.startsAt
                        ? new Date(
                            interview?.startsAt,
                          ).toLocaleString()
                        : "No scheduled date"}
                    </p>

                    <p className="flex items-center gap-2">
                      <UsersIcon className="size-4" />
                      View joined candidate sessions
                    </p>
                  </div>

                  <div className="card-actions mt-5">
                    <Link
                      to={`/interviews/${interview?._id}`}
                      className="btn btn-primary btn-sm w-full"
                    >
                      View Reports
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}