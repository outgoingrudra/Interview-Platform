import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangleIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Clock3Icon,
  ClipboardListIcon,
} from "lucide-react";

import { useGetMySessionsQuery } from "../../api/sessionApi";

const PAGE_SIZE = 6;

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

const getVisiblePages = (
  currentPage,
  totalPages,
) => {
  if (totalPages <= 5) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
};

export default function MyInterviewsPage() {
  const [currentPage, setCurrentPage] =
    useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetMySessionsQuery();

  const sessions = data?.sessions ?? [];

  const totalItems = sessions?.length ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE),
  );

  const paginatedSessions = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    const endIndex =
      startIndex + PAGE_SIZE;

    return sessions?.slice(
      startIndex,
      endIndex,
    );
  }, [sessions, currentPage]);

  const visiblePages = useMemo(
    () =>
      getVisiblePages(
        currentPage,
        totalPages,
      ),
    [currentPage, totalPages],
  );

  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    totalItems,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const changePage = (page) => {
    const safePage = Math.min(
      Math.max(page, 1),
      totalPages,
    );

    setCurrentPage(safePage);

    document
      ?.getElementById?.(
        "my-interviews-heading",
      )
      ?.scrollIntoView?.({
        behavior: "smooth",
        block: "start",
      });
  };

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
        <header
          id="my-interviews-heading"
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">
              My Interviews
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
              View interviews you participated in,
              track their status and access available
              results.
            </p>
          </div>

          {!isLoading && (
            <span className="badge badge-primary badge-lg whitespace-nowrap">
              {totalItems}{" "}
              {totalItems === 1
                ? "session"
                : "sessions"}
            </span>
          )}
        </header>

        {isLoading && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: PAGE_SIZE,
            })?.map((_, index) => (
              <article
                key={index}
                className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="skeleton h-6 w-2/3" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>

                <div className="skeleton mt-3 h-3 w-1/2" />
                <div className="skeleton mt-6 h-4 w-2/3" />
                <div className="skeleton mt-3 h-4 w-4/5" />
                <div className="skeleton mt-3 h-4 w-1/2" />
                <div className="skeleton mt-6 h-9 w-full" />
              </article>
            ))}
          </section>
        )}

        {!isLoading &&
          totalItems === 0 && (
            <section className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body items-center p-10 text-center sm:p-14">
                <div className="grid size-16 place-items-center rounded-2xl bg-primary/10">
                  <ClipboardListIcon className="size-8 text-primary" />
                </div>

                <h2 className="mt-4 text-xl font-bold">
                  No participated interviews
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-base-content/60">
                  Interviews you join will appear here
                  along with their result status and
                  warning information.
                </p>

                <Link
                  to="/dashboard"
                  className="btn btn-primary mt-5"
                >
                  Return to Dashboard
                </Link>
              </div>
            </section>
          )}

        {!isLoading && totalItems > 0 && (
          <>
            <div className="flex flex-col gap-2 border-y border-base-300 py-3 text-xs text-base-content/60 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
              <p>
                Showing{" "}
                <span className="font-bold text-base-content">
                  {startItem}–{endItem}
                </span>{" "}
                of{" "}
                <span className="font-bold text-base-content">
                  {totalItems}
                </span>{" "}
                interview sessions
              </p>

              <p>
                Page{" "}
                <span className="font-bold text-base-content">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-bold text-base-content">
                  {totalPages}
                </span>
              </p>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paginatedSessions?.map(
                (session) => {
                  const interview =
                    session?.interview;

                  const status =
                    session?.status;

                  return (
                    <article
                      key={session?._id}
                      className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="line-clamp-2 text-lg font-bold">
                            {interview?.title ||
                              "Interview"}
                          </h2>

                          <p className="mt-1 truncate text-xs text-base-content/60">
                            Host:{" "}
                            {interview?.host?.name ||
                              interview?.host?.email ||
                              "Unknown"}
                          </p>
                        </div>

                        <span
                          className={`badge badge-sm shrink-0 capitalize ${getStatusClass(
                            status,
                          )}`}
                        >
                          {status || "unknown"}
                        </span>
                      </div>

                      <div className="mt-5 flex-1 space-y-3 text-sm text-base-content/70">
                        <p className="flex items-center gap-2">
                          <Clock3Icon className="size-4 shrink-0 text-primary" />

                          <span>
                            {interview?.durationMinutes ??
                              0}{" "}
                            minutes
                          </span>
                        </p>

                        <p className="flex items-start gap-2">
                          <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-secondary" />

                          <span className="line-clamp-2">
                            {session?.startedAt
                              ? new Date(
                                  session?.startedAt,
                                )?.toLocaleString?.()
                              : "Not started"}
                          </span>
                        </p>

                        <p className="flex items-center gap-2">
                          <AlertTriangleIcon className="size-4 shrink-0 text-warning" />

                          <span>
                            {session?.warningCount ??
                              0}{" "}
                            warnings
                          </span>
                        </p>
                      </div>

                      <div className="mt-5">
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
                    </article>
                  );
                },
              )}
            </section>

            {totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-xs text-base-content/50 sm:text-left">
                  Navigate through your interview
                  history
                </p>

                {/* Mobile pagination */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={() =>
                      changePage(
                        currentPage - 1,
                      )
                    }
                    disabled={currentPage === 1}
                    className="btn btn-outline btn-sm"
                  >
                    <ChevronLeftIcon className="size-4" />
                    Previous
                  </button>

                  <span className="badge badge-neutral whitespace-nowrap">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      changePage(
                        currentPage + 1,
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="btn btn-outline btn-sm"
                  >
                    Next
                    <ChevronRightIcon className="size-4" />
                  </button>
                </div>

                {/* Desktop pagination */}
                <div className="join hidden sm:flex">
                  <button
                    type="button"
                    onClick={() => changePage(1)}
                    disabled={currentPage === 1}
                    className="join-item btn btn-sm"
                    aria-label="First page"
                  >
                    <ChevronsLeftIcon className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changePage(
                        currentPage - 1,
                      )
                    }
                    disabled={currentPage === 1}
                    className="join-item btn btn-sm"
                    aria-label="Previous page"
                  >
                    <ChevronLeftIcon className="size-4" />
                  </button>

                  {visiblePages?.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        changePage(page)
                      }
                      className={`join-item btn btn-sm ${
                        currentPage === page
                          ? "btn-primary"
                          : ""
                      }`}
                      aria-current={
                        currentPage === page
                          ? "page"
                          : undefined
                      }
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      changePage(
                        currentPage + 1,
                      )
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="join-item btn btn-sm"
                    aria-label="Next page"
                  >
                    <ChevronRightIcon className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changePage(totalPages)
                    }
                    disabled={
                      currentPage === totalPages
                    }
                    className="join-item btn btn-sm"
                    aria-label="Last page"
                  >
                    <ChevronsRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}