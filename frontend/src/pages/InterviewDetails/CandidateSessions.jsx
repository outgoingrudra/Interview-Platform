import { Link } from "react-router-dom";
import {
  AlertTriangleIcon,
  Clock3Icon,
  UsersIcon,
} from "lucide-react";

import { useGetInterviewSessionsQuery } from "../../api/sessionApi";

const getStatusClass = (status) => {
  const classes = {
    waiting: "badge-ghost",
    active: "badge-success",
    submitted: "badge-primary",
    completed: "badge-info",
    expired: "badge-warning",
    terminated: "badge-error",
  };

  return classes[status] || "badge-ghost";
};

const canViewReport = (status) =>
  ["submitted", "completed", "expired", "terminated"].includes(
    status,
  );

export default function CandidateSessions({ interviewId }) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetInterviewSessionsQuery(interviewId);

  const sessions = data?.sessions || [];

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-secondary/15">
            <UsersIcon className="size-6 text-secondary" />
          </div>

          <div>
            <h2 className="card-title">
              Candidate Sessions
            </h2>

            <p className="text-sm text-base-content/60">
              View candidates who joined this interview.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="grid min-h-40 place-items-center">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}

        {isError && (
          <div className="alert alert-error mt-5">
            {error?.data?.message ||
              "Candidate sessions could not be loaded"}
          </div>
        )}

        {!isLoading &&
          !isError &&
          sessions.length === 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-base-300 p-8 text-center">
              <UsersIcon className="mx-auto size-10 text-base-content/30" />

              <p className="mt-3 font-semibold">
                No candidates have joined yet
              </p>

              <p className="mt-1 text-sm text-base-content/60">
                Candidate sessions will appear here after they join.
              </p>
            </div>
          )}

        {!isLoading &&
          !isError &&
          sessions.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Status</th>
                    <th>Warnings</th>
                    <th>Started</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {sessions.map((session) => (
                    <tr key={session._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="size-10 rounded-full bg-primary text-primary-content">
                              {session.candidate?.imageUrl ? (
                                <img
                                  src={session.candidate.imageUrl}
                                  alt={
                                    session.candidate.name ||
                                    "Candidate"
                                  }
                                />
                              ) : (
                                <span>
                                  {session.candidate?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-bold">
                              {session.candidate?.name ||
                                "Unknown"}
                            </p>

                            <p className="truncate text-xs text-base-content/60">
                              {session.candidate?.email || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge capitalize ${getStatusClass(
                            session.status,
                          )}`}
                        >
                          {session.status}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <AlertTriangleIcon className="size-4 text-warning" />
                          {session.warningCount || 0}
                        </div>
                      </td>

                      <td>
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <Clock3Icon className="size-4" />

                          {session.startedAt
                            ? new Date(
                                session.startedAt,
                              ).toLocaleString()
                            : "Not started"}
                        </div>
                      </td>

                      <td>
                        {canViewReport(session.status) ? (
                          <Link
                            to={`/sessions/${session._id}/report`}
                            className="btn btn-primary btn-sm"
                          >
                            View Report
                          </Link>
                        ) : (
                          <span className="text-xs text-base-content/50">
                            Report unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </section>
  );
}