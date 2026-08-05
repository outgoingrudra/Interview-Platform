import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  BarChart3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ClipboardListIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { useGetMyInterviewsQuery } from "../../api/interviewApi";
import ReportCard from "./ReportCard";

const PAGE_SIZE = 6;

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

  const interviews =
    data?.interviews ?? [];

  const reportInterviews = useMemo(
    () =>
      interviews.filter(
        (interview) =>
          interview?.status ===
            "completed" ||
          interview?.status === "live",
      ),
    [interviews],
  );

  const totalItems =
    reportInterviews.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE),
  );

  const paginatedInterviews =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) * PAGE_SIZE;

      return reportInterviews.slice(
        startIndex,
        startIndex + PAGE_SIZE,
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
      : (currentPage - 1) *
          PAGE_SIZE +
        1;

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
      .getElementById("reports-heading")
      ?.scrollIntoView({
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
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-base-200">
      <div className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-20 size-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          id="reports-heading"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <BarChart3Icon className="size-6" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Analytics
                </p>

                <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                  Interview Reports
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
              Review candidate sessions,
              results, warnings and security
              activity from your live and
              completed interviews.
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
        </motion.header>

        {isLoading && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: PAGE_SIZE,
            }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-base-300 bg-base-100 p-5"
              >
                <div className="skeleton h-4 w-32" />

                <div className="skeleton mt-3 h-6 w-3/4" />

                <div className="skeleton mt-5 h-16 w-full rounded-2xl" />

                <div className="skeleton mt-3 h-16 w-full rounded-2xl" />

                <div className="skeleton mt-3 h-16 w-full rounded-2xl" />

                <div className="skeleton mt-5 h-9 w-full" />
              </div>
            ))}
          </section>
        )}

        {!isLoading &&
          totalItems === 0 && (
            <motion.section
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl"
            >
              <div className="flex flex-col items-center p-10 text-center sm:p-14">
                <div className="grid size-16 place-items-center rounded-2xl bg-primary/10">
                  <ClipboardListIcon className="size-8 text-primary" />
                </div>

                <h2 className="mt-4 text-xl font-black">
                  No reports available
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-base-content/60">
                  Reports will appear after
                  candidates join your interview
                  and submit their sessions.
                </p>

                <Link
                  to="/dashboard"
                  className="btn btn-primary mt-5"
                >
                  Return to Dashboard
                </Link>
              </div>
            </motion.section>
          )}

        {!isLoading &&
          totalItems > 0 && (
            <>
              <div className="flex flex-col gap-2 border-y border-base-300 py-3 text-xs text-base-content/60 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                <p>
                  Showing{" "}
                  <strong className="text-base-content">
                    {startItem}–{endItem}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-base-content">
                    {totalItems}
                  </strong>{" "}
                  report interviews
                </p>

                <p>
                  Page{" "}
                  <strong className="text-base-content">
                    {currentPage}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-base-content">
                    {totalPages}
                  </strong>
                </p>
              </div>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {paginatedInterviews.map(
                  (interview, index) => (
                    <ReportCard
                      key={interview?._id}
                      interview={interview}
                      index={index}
                    />
                  ),
                )}
              </section>

              {totalPages > 1 && (
                <div className="flex flex-col gap-4 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-center text-xs text-base-content/50 sm:text-left">
                    Navigate through your report
                    history
                  </p>

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
                        currentPage === totalPages
                      }
                      className="btn btn-primary btn-sm"
                    >
                      Next
                      <ChevronRightIcon className="size-4" />
                    </button>
                  </div>

                  <div className="join hidden sm:flex">
                    <button
                      type="button"
                      onClick={() =>
                        changePage(1)
                      }
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