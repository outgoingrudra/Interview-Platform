import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Clock3Icon,
  FileSearchIcon,
  RefreshCwIcon,
  SearchIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import toast from "react-hot-toast";

import { useGetInterviewSessionsQuery } from "../../api/sessionApi";

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

const canViewReport = (status) =>
  [
    "submitted",
    "completed",
    "expired",
    "terminated",
  ].includes(status);

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

const getCandidateInitial = (candidate) =>
  candidate?.name
    ?.trim?.()
    ?.charAt?.(0)
    ?.toUpperCase?.() ||
  candidate?.email
    ?.trim?.()
    ?.charAt?.(0)
    ?.toUpperCase?.() ||
  "U";

export default function CandidateSessions({
  interviewId,
}) {
  const shouldReduceMotion = useReducedMotion();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [currentPage, setCurrentPage] =
    useState(1);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetInterviewSessionsQuery(interviewId);

  const sessions = data?.sessions ?? [];

  const filteredSessions = useMemo(() => {
    const normalizedSearch = search
      ?.trim?.()
      ?.toLowerCase?.();

    return sessions?.filter((session) => {
      const candidateName =
        session?.candidate?.name
          ?.toLowerCase?.() ?? "";

      const candidateEmail =
        session?.candidate?.email
          ?.toLowerCase?.() ?? "";

      const sessionStatus =
        session?.status?.toLowerCase?.() ?? "";

      const matchesSearch =
        !normalizedSearch ||
        candidateName?.includes?.(
          normalizedSearch,
        ) ||
        candidateEmail?.includes?.(
          normalizedSearch,
        ) ||
        sessionStatus?.includes?.(
          normalizedSearch,
        );

      const matchesStatus =
        statusFilter === "all" ||
        session?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, search, statusFilter]);

  const totalItems =
    filteredSessions?.length ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / PAGE_SIZE),
  );

  const paginatedSessions = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    return filteredSessions?.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );
  }, [filteredSessions, currentPage]);

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
  }, [search, statusFilter]);

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
        "candidate-sessions-heading",
      )
      ?.scrollIntoView?.({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleRefresh = async () => {
    try {
      await refetch()?.unwrap?.();

      toast.success(
        "Candidate sessions refreshed",
      );
    } catch (refreshError) {
      console.error(
        "Failed to refresh candidate sessions:",
        refreshError,
      );

      toast.error(
        "Candidate sessions could not be refreshed",
      );
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <motion.section
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
              scale: 0.98,
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
      className="group relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-secondary/10 blur-3xl transition duration-700 group-hover:scale-110" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative p-4 sm:p-6">
        {/* Header */}
        <div
          id="candidate-sessions-heading"
          className="flex flex-col gap-4 border-b border-base-300 pb-5 lg:flex-row lg:items-start lg:justify-between"
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
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary/15 text-secondary shadow-sm"
            >
              <UsersIcon className="size-6" />
            </motion.div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Candidate Management
              </p>

              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                Candidate Sessions
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                Search, monitor and review candidates
                who joined this interview.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isLoading && (
              <span className="badge badge-secondary badge-lg">
                {sessions?.length ?? 0} joined
              </span>
            )}

            <motion.button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
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
                      scale: 0.95,
                    }
              }
              className="btn btn-outline btn-sm"
            >
              <RefreshCwIcon
                className={`size-4 ${
                  isFetching
                    ? "animate-spin"
                    : ""
                }`}
              />

              {isFetching
                ? "Refreshing..."
                : "Refresh"}
            </motion.button>
          </div>
        </div>

        {/* Search and filter */}
        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px]">
          <label className="relative block">
            <span className="sr-only">
              Search candidates
            </span>

            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-base-content/40" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event?.target?.value ?? "",
                )
              }
              placeholder="Search by candidate name, email or status..."
              className="input input-bordered h-12 w-full rounded-2xl bg-base-200/40 pl-12 pr-12 focus:border-primary"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="btn btn-ghost btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2"
                aria-label="Clear candidate search"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event?.target?.value ?? "all",
              )
            }
            className="select select-bordered h-12 w-full rounded-2xl bg-base-200/40"
            aria-label="Filter candidate sessions by status"
          >
            <option value="all">
              All statuses
            </option>
            <option value="waiting">
              Waiting
            </option>
            <option value="active">
              Active
            </option>
            <option value="submitted">
              Submitted
            </option>
            <option value="completed">
              Completed
            </option>
            <option value="expired">
              Expired
            </option>
            <option value="terminated">
              Terminated
            </option>
          </select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="mt-6 space-y-3">
            {Array.from({
              length: PAGE_SIZE,
            })?.map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-base-300 bg-base-200/40 p-4"
              >
                <div className="skeleton size-11 rounded-full" />

                <div className="min-w-0 flex-1">
                  <div className="skeleton h-4 w-40" />
                  <div className="skeleton mt-2 h-3 w-56 max-w-full" />
                </div>

                <div className="skeleton hidden h-6 w-20 sm:block" />
                <div className="skeleton hidden h-9 w-24 lg:block" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="alert alert-error mt-5">
            {error?.data?.message ||
              "Candidate sessions could not be loaded"}
          </div>
        )}

        {/* Empty interview */}
        {!isLoading &&
          !isError &&
          sessions?.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 rounded-3xl border border-dashed border-base-300 bg-base-200/30 p-8 text-center sm:p-12"
            >
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-secondary/10 text-secondary">
                <UsersIcon className="size-8" />
              </div>

              <h3 className="mt-4 text-xl font-black">
                No candidates have joined yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
                Candidate sessions will appear here
                after someone joins using the invitation
                link.
              </p>
            </motion.div>
          )}

        {/* No search result */}
        {!isLoading &&
          !isError &&
          sessions?.length > 0 &&
          totalItems === 0 && (
            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-6 rounded-3xl border border-dashed border-base-300 bg-base-200/30 p-8 text-center"
            >
              <FileSearchIcon className="mx-auto size-10 text-base-content/30" />

              <h3 className="mt-3 text-lg font-black">
                No matching candidates
              </h3>

              <p className="mt-1 text-sm text-base-content/60">
                Try a different name, email or
                session status.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="btn btn-primary btn-sm mt-5"
              >
                Clear filters
              </button>
            </motion.div>
          )}

        {!isLoading &&
          !isError &&
          totalItems > 0 && (
            <>
              {/* Result count */}
              <div className="mt-5 flex flex-col gap-2 border-y border-base-300 py-3 text-xs text-base-content/60 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
                <p>
                  Showing{" "}
                  <span className="font-bold text-base-content">
                    {startItem}–{endItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-base-content">
                    {totalItems}
                  </span>{" "}
                  candidate sessions
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

              {/* Mobile cards */}
              <div className="mt-5 grid gap-4 md:hidden">
                <AnimatePresence mode="popLayout">
                  {paginatedSessions?.map(
                    (session, index) => (
                      <motion.article
                        key={session?._id}
                        layout
                        initial={
                          shouldReduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 18,
                              }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.97,
                        }}
                        transition={{
                          delay: index * 0.05,
                        }}
                        className="rounded-3xl border border-base-300 bg-base-200/35 p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="size-11 rounded-2xl bg-primary text-primary-content">
                                {session?.candidate
                                  ?.imageUrl ? (
                                  <img
                                    src={
                                      session
                                        ?.candidate
                                        ?.imageUrl
                                    }
                                    alt={
                                      session
                                        ?.candidate
                                        ?.name ||
                                      "Candidate"
                                    }
                                  />
                                ) : (
                                  <span className="font-black">
                                    {getCandidateInitial(
                                      session?.candidate,
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-black">
                                {session?.candidate
                                  ?.name ||
                                  "Unknown Candidate"}
                              </p>

                              <p className="truncate text-xs text-base-content/55">
                                {session?.candidate
                                  ?.email ||
                                  "No email"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`badge badge-sm shrink-0 capitalize ${getStatusClass(
                              session?.status,
                            )}`}
                          >
                            {session?.status ||
                              "unknown"}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 rounded-2xl bg-base-100/60 p-3 text-sm">
                          <p className="flex items-center justify-between gap-3">
                            <span className="text-base-content/55">
                              Warnings
                            </span>

                            <span className="flex items-center gap-1.5 font-bold">
                              <AlertTriangleIcon className="size-4 text-warning" />
                              {session?.warningCount ??
                                0}
                            </span>
                          </p>

                          <p className="flex items-start justify-between gap-3">
                            <span className="text-base-content/55">
                              Started
                            </span>

                            <span className="max-w-[65%] text-right font-medium">
                              {session?.startedAt
                                ? new Date(
                                    session?.startedAt,
                                  )?.toLocaleString?.()
                                : "Not started"}
                            </span>
                          </p>
                        </div>

                        <div className="mt-4">
                          {canViewReport(
                            session?.status,
                          ) ? (
                            <Link
                              to={`/sessions/${session?._id}/report`}
                              className="btn btn-primary btn-sm w-full"
                            >
                              View Candidate Report
                            </Link>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="btn btn-ghost btn-sm w-full"
                            >
                              Report unavailable
                            </button>
                          )}
                        </div>
                      </motion.article>
                    ),
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop table */}
              <div className="mt-5 hidden overflow-x-auto rounded-3xl border border-base-300 md:block">
                <table className="table">
                  <thead className="bg-base-200/70">
                    <tr>
                      <th>Candidate</th>
                      <th>Status</th>
                      <th>Warnings</th>
                      <th>Started</th>
                      <th className="text-right">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginatedSessions?.map(
                        (session, index) => (
                          <motion.tr
                            key={session?._id}
                            layout
                            initial={
                              shouldReduceMotion
                                ? false
                                : {
                                    opacity: 0,
                                    y: 12,
                                  }
                            }
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                            }}
                            transition={{
                              delay:
                                index * 0.04,
                            }}
                            className="transition hover:bg-base-200/45"
                          >
                            <td>
                              <div className="flex items-center gap-3">
                                <div className="avatar placeholder">
                                  <div className="size-11 rounded-2xl bg-primary text-primary-content">
                                    {session
                                      ?.candidate
                                      ?.imageUrl ? (
                                      <img
                                        src={
                                          session
                                            ?.candidate
                                            ?.imageUrl
                                        }
                                        alt={
                                          session
                                            ?.candidate
                                            ?.name ||
                                          "Candidate"
                                        }
                                      />
                                    ) : (
                                      <span className="font-black">
                                        {getCandidateInitial(
                                          session?.candidate,
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="min-w-0 max-w-52">
                                  <p className="truncate font-black">
                                    {session
                                      ?.candidate
                                      ?.name ||
                                      "Unknown Candidate"}
                                  </p>

                                  <p className="truncate text-xs text-base-content/55">
                                    {session
                                      ?.candidate
                                      ?.email || ""}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td>
                              <span
                                className={`badge capitalize ${getStatusClass(
                                  session?.status,
                                )}`}
                              >
                                {session?.status ||
                                  "unknown"}
                              </span>
                            </td>

                            <td>
                              <div className="flex items-center gap-2 font-semibold">
                                <AlertTriangleIcon className="size-4 text-warning" />

                                {session?.warningCount ??
                                  0}
                              </div>
                            </td>

                            <td>
                              <div className="flex items-center gap-2 whitespace-nowrap text-sm">
                                <Clock3Icon className="size-4 text-base-content/45" />

                                {session?.startedAt
                                  ? new Date(
                                      session?.startedAt,
                                    )?.toLocaleString?.()
                                  : "Not started"}
                              </div>
                            </td>

                            <td className="text-right">
                              {canViewReport(
                                session?.status,
                              ) ? (
                                <Link
                                  to={`/sessions/${session?._id}/report`}
                                  className="btn btn-primary btn-sm"
                                >
                                  View Report
                                </Link>
                              ) : (
                                <span className="text-xs text-base-content/45">
                                  Report unavailable
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ),
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col gap-4 border-t border-base-300 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-center text-xs text-base-content/50 sm:text-left">
                    Browse all candidates who joined
                    this interview.
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
    </motion.section>
  );
}