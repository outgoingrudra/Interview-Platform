import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Clock3Icon,
  PlusIcon,
} from "lucide-react";

import { useGetMyInterviewsQuery } from "../../api/interviewApi";

const PAGE_SIZE = 6;

const filters = [
  "all",
  "draft",
  "scheduled",
  "live",
  "completed",
  "cancelled",
];

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

export default function InterviewList() {
  const [filter, setFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetMyInterviewsQuery();

  const interviews = data?.interviews ?? [];

  const filteredInterviews = useMemo(() => {
    if (filter === "all") {
      return interviews;
    }

    return interviews?.filter(
      (interview) =>
        interview?.status === filter,
    );
  }, [interviews, filter]);

  const totalItems =
    filteredInterviews?.length ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE),
  );

  const paginatedInterviews = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    const endIndex =
      startIndex + PAGE_SIZE;

    return filteredInterviews?.slice(
      startIndex,
      endIndex,
    );
  }, [
    filteredInterviews,
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
    setCurrentPage(1);
  }, [filter]);

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
        "interview-list-heading",
      )
      ?.scrollIntoView?.({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4 sm:p-6">
        <div
          id="interview-list-heading"
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="card-title">
              My Interviews
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              View and manage interviews you
              created.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <select
              value={filter}
              onChange={(event) =>
                setFilter(event?.target?.value)
              }
              className="select select-bordered w-full sm:w-44"
              aria-label="Filter interviews"
            >
              {filters?.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "all"
                    ? "All Interviews"
                    : item
                        ?.charAt?.(0)
                        ?.toUpperCase() +
                      item?.slice?.(1)}
                </option>
              ))}
            </select>

            <Link
              to="/interviews/create"
              className="btn btn-primary"
            >
              <PlusIcon className="size-4" />
              Create
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: PAGE_SIZE,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-base-300 bg-base-200/40 p-5"
              >
                <div className="skeleton h-6 w-2/3" />

                <div className="skeleton mt-4 h-4 w-1/2" />

                <div className="skeleton mt-3 h-4 w-3/4" />

                <div className="skeleton mt-6 h-9 w-full" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="alert alert-error mt-5">
            {error?.data?.message ||
              "Interviews could not be loaded"}
          </div>
        )}

        {!isLoading &&
          !isError &&
          totalItems === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-base-300 bg-base-200/30 p-8 text-center sm:p-12">
              <h3 className="text-xl font-bold">
                No interviews found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
                {filter === "all"
                  ? "Create your first interview to get started."
                  : `There are no ${filter} interviews right now.`}
              </p>

              <Link
                to="/interviews/create"
                className="btn btn-primary mt-5"
              >
                <PlusIcon className="size-4" />
                Create Interview
              </Link>
            </div>
          )}

        {!isLoading &&
          !isError &&
          totalItems > 0 && (
            <>
              <div className="mt-5 flex items-center justify-between gap-3 border-y border-base-300 py-3 text-xs text-base-content/60 sm:text-sm">
                <p>
                  Showing{" "}
                  <span className="font-bold text-base-content">
                    {startItem}–{endItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-base-content">
                    {totalItems}
                  </span>{" "}
                  interviews
                </p>

                <p className="hidden sm:block">
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

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedInterviews?.map(
                  (interview) => (
                    <article
                      key={interview?._id}
                      className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-200/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-base-100 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 min-w-0 text-lg font-bold">
                          {interview?.title ||
                            "Untitled Interview"}
                        </h3>

                        <span
                          className={`badge badge-sm shrink-0 capitalize ${getStatusClass(
                            interview?.status,
                          )}`}
                        >
                          {interview?.status ||
                            "unknown"}
                        </span>
                      </div>

                      <div className="mt-4 flex-1 space-y-3 text-sm text-base-content/70">
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
                            {interview?.startsAt
                              ? new Date(
                                  interview?.startsAt,
                                )?.toLocaleString?.()
                              : "Not scheduled"}
                          </span>
                        </p>
                      </div>

                      <Link
                        to={`/interviews/${interview?._id}`}
                        className="btn btn-outline btn-sm mt-5 w-full transition group-hover:btn-primary"
                      >
                        View Details
                      </Link>
                    </article>
                  ),
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-7 flex flex-col gap-4 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
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
    </section>
  );
}