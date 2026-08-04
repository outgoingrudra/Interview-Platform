import { Link } from "react-router-dom";
import {
  AlertTriangleIcon,
  CalendarDaysIcon,
  Clock3Icon,
  ClipboardListIcon,
} from "lucide-react";

import { useGetMySessionsQuery } from "../../api/sessionApi";

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

const canViewResult = (status) =>
  ["submitted", "completed"].includes(status);

export default function MyInterviewsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetMySessionsQuery();

  const sessions = data?.sessions ?? [];

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
            "Participated interviews could not be loaded"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-3xl font-black sm:text-4xl">
            My Interviews
          </h1>

          <p className="mt-2 text-base-content/60">
            View interviews you participated in and access available results.
          </p>
        </header>

        {sessions?.length === 0 ? (
          <section className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body items-center p-10 text-center">
              <ClipboardListIcon className="size-12 text-base-content/30" />

              <h2 className="mt-3 text-xl font-bold">
                No participated interviews
              </h2>

              <p className="mt-1 text-sm text-base-content/60">
                Interviews you join will appear here.
              </p>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sessions?.map((session) => {
              const interview = session?.interview;
              const status = session?.status;

              return (
                <article
                  key={session?._id}
                  className="card border border-base-300 bg-base-100 shadow-sm"
                >
                  <div className="card-body p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-bold">
                          {interview?.title || "Interview"}
                        </h2>

                        <p className="mt-1 text-xs text-base-content/60">
                          Host:{" "}
                          {interview?.host?.name ||
                            interview?.host?.email ||
                            "Unknown"}
                        </p>
                      </div>

                      <span
                        className={`badge badge-sm capitalize ${getStatusClass(
                          status,
                        )}`}
                      >
                        {status || "unknown"}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-base-content/70">
                      <p className="flex items-center gap-2">
                        <Clock3Icon className="size-4" />
                        {interview?.durationMinutes ?? 0} minutes
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDaysIcon className="size-4" />
                        {session?.startedAt
                          ? new Date(
                              session?.startedAt,
                            ).toLocaleString()
                          : "Not started"}
                      </p>

                      <p className="flex items-center gap-2">
                        <AlertTriangleIcon className="size-4 text-warning" />
                        {session?.warningCount ?? 0} warnings
                      </p>
                    </div>

                    <div className="card-actions mt-5">
                      {canViewResult(status) ? (
                        <Link
                          to={`/sessions/${session?._id}/result`}
                          className="btn btn-primary btn-sm w-full"
                        >
                          View Result
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="btn btn-ghost btn-sm w-full"
                        >
                          Result unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}