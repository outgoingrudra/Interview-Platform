import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  motion,
  useReducedMotion,
} from "motion/react";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  Clock3Icon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  VideoIcon,
} from "lucide-react";

import { useGetInterviewByIdQuery } from "../../api/interviewApi";
import { useJoinInterviewMutation } from "../../api/sessionApi";

const securityKeys = [
  "preventCopyPaste",
  "detectTabSwitch",
  "requireFullscreen",
  "detectFace",
  "detectMultipleFaces",
  "detectSuspiciousGesture",
  "detectCameraDisconnect",
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

export default function JoinInterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const {
    data,
    isLoading: isInterviewLoading,
    isError,
    error,
  } = useGetInterviewByIdQuery(id);

  const [joinInterview, { isLoading: isJoining }] =
    useJoinInterviewMutation();

  const interview = data?.interview;
  const isHost = Boolean(data?.isHost);

  const enabledSecurityCount =
    securityKeys.filter((key) =>
      Boolean(interview?.securitySettings?.[key]),
    ).length;

  const handleJoin = async () => {
    if (isHost) {
      navigate(`/interviews/${id}/room`);
      return;
    }

    try {
      const response = await joinInterview(id).unwrap();

      toast.success("Interview joined successfully");

      navigate(
        `/interviews/${id}/room?sessionId=${response?.session?._id}`,
      );
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Failed to join interview",
      );
    }
  };

  if (isInterviewLoading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-base-200 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
            <div className="skeleton h-6 w-24 rounded-full" />
            <div className="skeleton mt-6 h-10 w-4/5" />
            <div className="skeleton mt-3 h-5 w-2/3" />

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-base-300 p-4"
                >
                  <div className="skeleton size-10 rounded-2xl" />
                  <div className="skeleton mt-4 h-4 w-20" />
                  <div className="skeleton mt-2 h-6 w-28" />
                </div>
              ))}
            </div>

            <div className="skeleton mt-8 h-14 w-full rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !interview) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-base-200 p-4">
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
          className="alert alert-error mx-auto max-w-3xl"
        >
          {error?.data?.message ||
            "Interview not found"}
        </motion.div>
      </main>
    );
  }

  const isLive = interview?.status === "live";

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-base-200 px-4 py-8 sm:px-6 sm:py-12">
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-72 rounded-full bg-secondary/10 blur-3xl" />

      <motion.section
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                y: 28,
                scale: 0.98,
              }
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-base-300 bg-base-100/90 shadow-2xl backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-success/10 blur-3xl" />

        <div className="relative p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 border-b border-base-300 pb-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
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
                className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary shadow-sm"
              >
                <SparklesIcon className="size-7" />
              </motion.div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`badge badge-lg capitalize ${getStatusClass(
                      interview?.status,
                    )}`}
                  >
                    {interview?.status || "unknown"}
                  </span>

                  <span className="badge badge-outline gap-1">
                    <LockKeyholeIcon className="size-3.5" />
                    Secure access
                  </span>
                </div>

                <h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                  {interview?.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
                  {isHost
                    ? "Open your live interview room and manage the candidate session."
                    : "Review the interview details and security requirements before joining."}
                </p>
              </div>
            </div>

            {isLive && (
              <div className="flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-4 py-2 text-sm font-bold text-success">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-success" />
                </span>
                Interview live
              </div>
            )}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Duration",
                value: `${interview?.durationMinutes ?? 0} minutes`,
                icon: Clock3Icon,
                iconClass: "bg-primary/15 text-primary",
              },
              {
                label: "Security",
                value: isHost
                  ? "Host session"
                  : "Monitored session",
                icon: ShieldCheckIcon,
                iconClass: "bg-success/15 text-success",
              },
              {
                label: "Protections",
                value: `${enabledSecurityCount} enabled`,
                icon: CheckCircle2Icon,
                iconClass: "bg-secondary/15 text-secondary",
              },
            ].map(
              (
                {
                  label,
                  value,
                  icon: Icon,
                  iconClass,
                },
                index,
              ) => (
                <motion.div
                  key={label}
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
                  transition={{
                    delay: index * 0.08,
                    duration: 0.4,
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -4,
                          scale: 1.01,
                        }
                  }
                  className="rounded-3xl border border-base-300 bg-base-200/40 p-5 shadow-sm transition hover:border-primary/30 hover:bg-base-100"
                >
                  <div
                    className={`grid size-11 place-items-center rounded-2xl ${iconClass}`}
                  >
                    <Icon className="size-5" />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-wider text-base-content/45">
                    {label}
                  </p>

                  <p className="mt-1 text-lg font-black">
                    {value}
                  </p>
                </motion.div>
              ),
            )}
          </div>

          {!isHost && (
            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 14,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.24,
                duration: 0.4,
              }}
              className="mt-7 rounded-3xl border border-warning/25 bg-warning/5 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-warning/15 text-warning">
                  <ShieldCheckIcon className="size-5" />
                </div>

                <div>
                  <p className="font-black">
                    Interview rules
                  </p>

                  <p className="mt-1 text-sm leading-6 text-base-content/60">
                    Stay in fullscreen mode, keep your camera
                    available and avoid switching tabs during
                    the interview.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {interview?.startsAt && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-base-300 bg-base-200/40 p-4">
              <CalendarDaysIcon className="mt-0.5 size-5 shrink-0 text-secondary" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-base-content/45">
                  Scheduled time
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {new Date(
                    interview.startsAt,
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <motion.button
            type="button"
            onClick={handleJoin}
            disabled={
              isJoining ||
              interview?.status !== "live"
            }
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    y: -3,
                    scale: 1.01,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 0.97,
                  }
            }
            className="btn btn-primary btn-lg mt-7 w-full rounded-2xl shadow-lg shadow-primary/15"
          >
            {isJoining ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Joining Interview...
              </>
            ) : (
              <>
                <VideoIcon className="size-5" />

                {isHost
                  ? "Open Interview Room"
                  : interview?.status === "live"
                    ? "Join Interview"
                    : "Interview is not live"}
              </>
            )}
          </motion.button>

          <p className="mt-4 text-center text-xs text-base-content/45">
            By continuing, you agree to the configured
            interview monitoring rules.
          </p>
        </div>
      </motion.section>
    </main>
  );
}