import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  BarChart3Icon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ClipboardListIcon,
  UsersIcon,
} from "lucide-react";

import { useGetMyInterviewsQuery } from "../../api/interviewApi";

const PAGE_SIZE = 6;

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

export default function ReportsPage() {
  const [currentPage, setCurrentPage] =
    useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetMyInterviewsQuery();

  const interviews = data?.interviews ?? [];

  const reportInterviews = useMemo(
    () =>
      interviews?.filter(
        (interview) =>
          interview?.status === "completed" ||
          interview?.status === "live",
      ),
    [interviews],
  );

  const totalItems =
    reportInterviews?.length ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE),
  );

  const paginatedInterviews = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    const endIndex =
      startIndex + PAGE_SIZE;

    return reportInterviews?.slice(
      startIndex,
      endIndex,
    );
  }, [
    reportInterviews,
    currentPage,
  ]);

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
      ?.getElementById?.("reports-heading")
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
            "Interview reports could not be loaded"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header
          id="reports-heading"
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <BarChart3Icon className="size-7 text-primary" />

              <h1 className="text-3xl font-black sm:text-4xl">
                Interview Reports
              </h1>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
              Review candidate sessions, results,
              warnings and security activity from
              your live and completed interviews.
            </p>
          </div>

          {!isLoading && (
            <span className="badge badge-primary badge-lg whitespace-nowrap">
              {totalItems}{" "}
              {totalItems === 1
                ? "interview"
                : "interviews"}
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

                <div className="skeleton mt-3 h-3 w-4/5" />
                <div className="skeleton mt-6 h-4 w-3/4" />
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
                  No reports available
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-base-content/60">
                  Reports will appear after candidates
                  join your interview and submit their
                  sessions.
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
                report interviews
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
              {paginatedInterviews?.map(
                (interview) => (
                  <article
                    key={interview?._id}
                    className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="line-clamp-2 text-lg font-bold">
                          {interview?.title ||
                            "Untitled Interview"}
                        </h2>

                        <p className="mt-1 truncate text-xs text-base-content/50">
                          ID: {interview?._id}
                        </p>
                      </div>

                      <span
                        className={`badge badge-sm shrink-0 capitalize ${getStatusClass(
                          interview?.status,
                        )}`}
                      >
                        {interview?.status ||
                          "unknown"}
                      </span>
                    </div>

                    <div className="mt-5 flex-1 space-y-3 text-sm text-base-content/70">
                      <p className="flex items-start gap-2">
                        <CalendarDaysIcon className="mt-0.5 size-4 shrink-0 text-primary" />

                        <span className="line-clamp-2">
                          {interview?.startsAt
                            ? new Date(
                                interview?.startsAt,
                              )?.toLocaleString?.()
                            : "No scheduled date"}
                        </span>
                      </p>

                      <p className="flex items-center gap-2">
                        <UsersIcon className="size-4 shrink-0 text-secondary" />

                        <span>
                          Review joined candidate sessions
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/interviews/${interview?._id}`}
                      className="btn btn-primary btn-sm mt-5 w-full"
                    >
                      View Reports
                    </Link>
                  </article>
                ),
              )}
            </section>

            {totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-xs text-base-content/50 sm:text-left">
                  Navigate through your report
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