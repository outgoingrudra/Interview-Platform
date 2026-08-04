import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDaysIcon, Clock3Icon } from "lucide-react";

import { useGetMyInterviewsQuery } from "../../api/interviewApi";

export default function InterviewList() {
  const [filter, setFilter] = useState("all");



  const { data, isLoading, isError, error } = useGetMyInterviewsQuery();

  const interviews = data?.interviews || [];

  const filteredInterviews =
    filter === "all"
      ? interviews
      : interviews.filter((interview) => interview.status === filter);

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="card-title">My Interviews</h2>

            <p className="text-sm text-base-content/60">
              View and manage interviews you created.
            </p>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="select select-bordered w-full sm:w-44"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading && (
          <div className="grid min-h-48 place-items-center">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}

        {isError && (
          <div className="alert alert-error mt-5">
            {error?.data?.message || "Interviews could not be loaded"}
          </div>
        )}

        {!isLoading && !isError && filteredInterviews.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-base-300 p-8 text-center sm:p-12">
            <h3 className="text-xl font-bold">No interviews found</h3>

            <Link to="/interviews/create" className="btn btn-primary mt-5">
              Create Interview
            </Link>
          </div>
        )}

        {!isLoading && !isError && filteredInterviews.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredInterviews.map((interview) => (
              <article
                key={interview._id}
                className="rounded-2xl border border-base-300 bg-base-200/40 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{interview.title}</h3>

                  <span className="badge badge-primary capitalize">
                    {interview.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-base-content/70">
                  <p className="flex items-center gap-2">
                    <Clock3Icon className="size-4" />
                    {interview.durationMinutes} minutes
                  </p>

                  <p className="flex items-center gap-2">
                    <CalendarDaysIcon className="size-4" />
                    {interview.startsAt
                      ? new Date(interview.startsAt).toLocaleString()
                      : "Not scheduled"}
                  </p>
                </div>

                <Link
                  to={`/interviews/${interview._id}`}
                  className="btn btn-outline btn-sm mt-5 w-full"
                >
                  View Details
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
