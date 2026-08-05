import { Link, useParams } from "react-router-dom";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ClipboardListIcon,
  FileBarChartIcon,
  ShieldCheckIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

import { useGetCandidateResultQuery } from "../../api/sessionApi";
import CandidateInfoCard from "./CandidateInfoCard";
import ReportSummary from "./ReportSummary";
import SecurityEventsList from "./SecurityEventsList";
import AnswerReview from "../CandidateResult/AnswerReview";

export default function InterviewReportPage() {
  const { sessionId } = useParams();
  const shouldReduceMotion = useReducedMotion();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetCandidateResultQuery(sessionId);

  if (isLoading) {
    return (
      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-base-200 px-4 py-8">
        <div className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-16 size-72 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton mt-3 h-9 w-64 max-w-full" />
              <div className="skeleton mt-3 h-4 w-96 max-w-full" />
            </div>

            <div className="skeleton h-9 w-24 rounded-xl" />
          </div>

          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="skeleton size-24 rounded-full" />

              <div className="flex-1">
                <div className="skeleton h-7 w-48 max-w-full" />
                <div className="skeleton mt-3 h-4 w-72 max-w-full" />

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="skeleton h-20 rounded-2xl"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-base-300 bg-base-100 p-5"
              >
                <div className="skeleton size-12 rounded-2xl" />
                <div className="skeleton mt-6 h-10 w-24" />
                <div className="skeleton mt-3 h-4 w-32" />
                <div className="skeleton mt-2 h-3 w-full" />
                <div className="skeleton mt-6 h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError || !data?.result) {
    return (
      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-base-200 px-4 py-8">
        <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-error/10 blur-3xl" />

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 18,
                  scale: 0.98,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-error/30 bg-base-100/90 shadow-xl backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-error/15 blur-3xl" />

          <div className="relative flex flex-col items-center p-8 text-center sm:p-12">
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      scale: 0.6,
                      rotate: -8,
                    }
              }
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 18,
              }}
              className="grid size-16 place-items-center rounded-2xl bg-error/15 text-error"
            >
              <AlertCircleIcon className="size-8" />
            </motion.div>

            <h1 className="mt-5 text-2xl font-black">
              Report could not be loaded
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-base-content/60">
              {error?.data?.message ||
                "Something went wrong while loading this interview report."}
            </p>

            <Link
              to="/reports"
              className="btn btn-primary mt-6"
            >
              <ArrowLeftIcon className="size-4" />
              Return to Reports
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const {
    session,
    submission,
    securityEvents = [],
    answerReview = [],
  } = data.result;

  const hasMcqs = answerReview.length > 0;

  const backUrl = session?.interview?._id
    ? `/interviews/${session.interview._id}`
    : "/reports";

  const sectionAnimation = shouldReduceMotion
    ? {}
    : {
        initial: {
          opacity: 0,
          y: 22,
        },
        whileInView: {
          opacity: 1,
          y: 0,
        },
        viewport: {
          once: true,
          amount: 0.12,
        },
        transition: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        },
      };

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-base-200">
      <div className="pointer-events-none absolute -left-28 top-20 size-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 top-1/3 size-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 size-72 rounded-full bg-success/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
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
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 18,
              }}
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary shadow-sm"
            >
              <FileBarChartIcon className="size-6" />
            </motion.div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Candidate Evaluation
              </p>

              <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                Interview Report
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
                Review candidate performance, submitted
                answers and recorded security activity.
              </p>
            </div>
          </div>

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
                    scale: 0.96,
                  }
            }
          >
            <Link
              to={backUrl}
              className="btn btn-outline btn-sm w-full gap-2 rounded-xl sm:w-auto"
            >
              <ArrowLeftIcon className="size-4" />
              Back to Interview
            </Link>
          </motion.div>
        </motion.header>

        <motion.div {...sectionAnimation}>
          <CandidateInfoCard session={session} />
        </motion.div>

        <motion.div
          {...sectionAnimation}
          transition={{
            duration: 0.45,
            delay: 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <ReportSummary
            session={session}
            submission={submission}
            securityEvents={securityEvents}
            answerReview={answerReview}
          />
        </motion.div>

        <motion.div
          {...sectionAnimation}
          transition={{
            duration: 0.45,
            delay: 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {hasMcqs ? (
            <AnswerReview answers={answerReview} />
          ) : (
            <section className="relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-sm backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative flex flex-col items-center p-8 text-center sm:p-12">
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          scale: 0.7,
                          rotate: -8,
                        }
                  }
                  animate={{
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 18,
                  }}
                  className="grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary"
                >
                  <ClipboardListIcon className="size-8" />
                </motion.div>

                <h2 className="mt-5 text-xl font-black">
                  No MCQ assessment
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-base-content/60">
                  This interview did not contain any
                  multiple-choice questions. The report
                  contains candidate and security activity
                  only.
                </p>

                <div className="mt-5 flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-4 py-2 text-xs font-bold text-success">
                  <ShieldCheckIcon className="size-4" />
                  Security report available below
                </div>
              </div>
            </section>
          )}
        </motion.div>

        <motion.div
          {...sectionAnimation}
          transition={{
            duration: 0.45,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <SecurityEventsList
            events={securityEvents}
          />
        </motion.div>
      </div>
    </main>
  );
}