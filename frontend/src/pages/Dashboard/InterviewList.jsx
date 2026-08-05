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
  PlusIcon,
  SearchXIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

import { useGetMyInterviewsQuery } from "../../api/interviewApi";
import InterviewCard from "./InterviewCard";

const PAGE_SIZE = 6;

const filters = [
  "all",
  "draft",
  "scheduled",
  "live",
  "completed",
  "cancelled",
];

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
  const shouldReduceMotion = useReducedMotion();

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

  const interviews =
    data?.interviews ?? [];

  const filteredInterviews = useMemo(() => {
    if (filter === "all") {
      return interviews;
    }

    return interviews.filter(
      (interview) =>
        interview?.status === filter,
    );
  }, [interviews, filter]);

  const totalItems =
    filteredInterviews.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE),
  );

  const paginatedInterviews = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    return filteredInterviews.slice(
      startIndex,
      startIndex + PAGE_SIZE,
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
      : (currentPage - 1) *
          PAGE_SIZE +
        1;

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
      .getElementById(
        "interview-list-heading",
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <motion.section
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 22,
              scale: 0.99,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-60 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative p-4 sm:p-6">
        {/* Header */}
        <div
          id="interview-list-heading"
          className="flex flex-col gap-5 border-b border-base-300 pb-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-start gap-3">
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: 6,
                      scale: 1.08,
                    }
              }
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary shadow-sm"
            >
              <CalendarDaysIcon className="size-6" />
            </motion.div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Interview Management
              </p>

              <h2 className="mt-1 text-2xl font-black">
                My Interviews
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                View, filter and manage all interviews
                you have created.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <select
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value,
                )
              }
              className="select select-bordered w-full rounded-xl bg-base-200/40 sm:w-48"
              aria-label="Filter interviews"
            >
              {filters.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "all"
                    ? "All Interviews"
                    : item
                        .charAt(0)
                        .toUpperCase() +
                      item.slice(1)}
                </option>
              ))}
            </select>

            <motion.div
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -2,
                    }
              }
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.97,
                    }
              }
            >
              <Link
                to="/interviews/create"
                className="btn btn-primary w-full rounded-xl sm:w-auto"
              >
                <PlusIcon className="size-4" />
                Create Interview
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: PAGE_SIZE,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-base-300 bg-base-200/40 p-5"
              >
                <div className="flex justify-between gap-3">
                  <div className="skeleton h-6 w-24" />
                  <div className="skeleton size-11 rounded-2xl" />
                </div>

                <div className="skeleton mt-5 h-7 w-4/5" />
                <div className="skeleton mt-3 h-4 w-full" />

                <div className="skeleton mt-5 h-16 w-full rounded-2xl" />
                <div className="skeleton mt-3 h-16 w-full rounded-2xl" />

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="skeleton h-20 rounded-2xl" />
                  <div className="skeleton h-20 rounded-2xl" />
                </div>

                <div className="skeleton mt-5 h-9 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="alert alert-error mt-6">
            {error?.data?.message ||
              "Interviews could not be loaded"}
          </div>
        )}

        {/* Empty state */}
        {!isLoading &&
          !isError &&
          totalItems === 0 && (
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 16,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 rounded-3xl border border-dashed border-base-300 bg-base-200/30 p-8 text-center sm:p-12"
            >
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                <SearchXIcon className="size-8" />
              </div>

              <h3 className="mt-4 text-xl font-black">
                No interviews found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
                {filter === "all"
                  ? "Create your first interview and start managing candidate sessions."
                  : `There are currently no ${filter} interviews.`}
              </p>

              <Link
                to="/interviews/create"
                className="btn btn-primary mt-5 rounded-xl"
              >
                <PlusIcon className="size-4" />
                Create Interview
              </Link>
            </motion.div>
          )}

        {/* Content */}
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

              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {paginatedInterviews.map(
                  (interview, index) => (
                    <InterviewCard
                      key={interview?._id}
                      interview={interview}
                      index={index}
                    />
                  ),
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-7 flex flex-col gap-4 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-center text-xs text-base-content/50 sm:text-left">
                    Navigate through your interview history
                  </p>

                  {/* Mobile */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:hidden">
                    <button
                      type="button"
                      onClick={() =>
                        changePage(
                          currentPage - 1,
                        )
                      }
                      disabled={
                        currentPage === 1
                      }
                      className="btn btn-outline btn-sm"
                    >
                      <ChevronLeftIcon className="size-4" />
                      Previous
                    </button>

                    <span className="badge badge-neutral whitespace-nowrap">
                      {currentPage}/{totalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        changePage(
                          currentPage + 1,
                        )
                      }
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      className="btn btn-primary btn-sm"
                    >
                      Next
                      <ChevronRightIcon className="size-4" />
                    </button>
                  </div>

                  {/* Desktop */}
                  <div className="join hidden sm:flex">
                    <button
                      type="button"
                      onClick={() =>
                        changePage(1)
                      }
                      disabled={
                        currentPage === 1
                      }
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
                      disabled={
                        currentPage === 1
                      }
                      className="join-item btn btn-sm"
                      aria-label="Previous page"
                    >
                      <ChevronLeftIcon className="size-4" />
                    </button>

                    {visiblePages.map((page) => (
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
                        currentPage ===
                        totalPages
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
                        currentPage ===
                        totalPages
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
    </motion.section>
  );
}