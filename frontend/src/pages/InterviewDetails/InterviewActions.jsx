import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "motion/react";
import {
  LogInIcon,
  PlayIcon,
  Trash2Icon,
  XCircleIcon,
  SquareIcon,
} from "lucide-react";

import {
  useCancelInterviewMutation,
  useCompleteInterviewMutation,
  useDeleteInterviewMutation,
  useStartInterviewMutation,
} from "../../api/interviewApi";

export default function InterviewActions({
  interview,
}) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [
    startInterview,
    { isLoading: isStarting },
  ] = useStartInterviewMutation();

  const [
    cancelInterview,
    { isLoading: isCancelling },
  ] = useCancelInterviewMutation();

  const [
    deleteInterview,
    { isLoading: isDeleting },
  ] = useDeleteInterviewMutation();

  const [
    completeInterview,
    { isLoading: isCompleting },
  ] = useCompleteInterviewMutation();

  const status = interview?.status;

  const canModify = [
    "draft",
    "scheduled",
  ].includes(status);

  const handleStart = async () => {
    try {
      await startInterview(
        interview?._id,
      ).unwrap();

      toast.success(
        "Interview started successfully",
      );
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Failed to start interview",
      );
    }
  };

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this interview?",
    );

    if (!confirmed) return;

    try {
      await cancelInterview(
        interview?._id,
      ).unwrap();

      toast.success(
        "Interview cancelled successfully",
      );
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Failed to cancel interview",
      );
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this interview?",
    );

    if (!confirmed) return;

    try {
      await deleteInterview(
        interview?._id,
      ).unwrap();

      toast.success(
        "Interview deleted successfully",
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Failed to delete interview",
      );
    }
  };

  const handleComplete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to end this live interview?",
    );

    if (!confirmed) return;

    try {
      await completeInterview(
        interview?._id,
      ).unwrap();

      toast.success(
        "Interview completed successfully",
      );
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Failed to complete interview",
      );
    }
  };

  const buttonMotion = shouldReduceMotion
    ? {}
    : {
        whileHover: {
          y: -2,
          scale: 1.02,
        },
        whileTap: {
          scale: 0.96,
        },
      };

  if (status === "live") {
    return (
      <motion.div
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                x: 20,
              }
        }
        animate={{
          opacity: 1,
          x: 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full lg:w-auto"
      >
        <div className="relative overflow-hidden rounded-3xl border border-success/25 bg-success/5 p-3 shadow-sm">
          <div className="pointer-events-none absolute -right-12 -top-12 size-28 rounded-full bg-success/15 blur-3xl" />

          <div className="relative mb-3 flex items-center gap-2 px-1">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-success">
              Interview Live
            </p>
          </div>

          <div className="relative flex w-full flex-col gap-3 sm:flex-row">
            <motion.div
              {...buttonMotion}
              className="w-full sm:w-auto"
            >
              <Link
                to={`/interviews/${interview?._id}/room`}
                className="btn btn-primary w-full gap-2 shadow-sm sm:w-auto"
              >
                <LogInIcon className="size-4" />
                Open Room
              </Link>
            </motion.div>

            <motion.button
              type="button"
              onClick={handleComplete}
              disabled={isCompleting}
              {...buttonMotion}
              className="btn btn-error w-full gap-2 shadow-sm sm:w-auto"
            >
              {isCompleting ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Ending...
                </>
              ) : (
                <>
                  <SquareIcon className="size-4 fill-current" />
                  End Interview
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!canModify) {
    return null;
  }

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: 20,
            }
      }
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full lg:w-auto"
    >
      <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-200/40 p-3 shadow-sm">
        <div className="pointer-events-none absolute -right-12 -top-12 size-28 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mb-3 flex items-center justify-between gap-3 px-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              Interview Actions
            </p>

            <p className="mt-1 text-xs text-base-content/50">
              Manage this{" "}
              {status || "interview"} session.
            </p>
          </div>

          <span className="badge badge-outline capitalize">
            {status || "unknown"}
          </span>
        </div>

        <div className="relative grid w-full gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-end">
          <motion.button
            type="button"
            onClick={handleStart}
            disabled={
              isStarting ||
              isCancelling ||
              isDeleting
            }
            {...buttonMotion}
            className="btn btn-success w-full gap-2 shadow-sm lg:w-auto"
          >
            {isStarting ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Starting...
              </>
            ) : (
              <>
                <PlayIcon className="size-4 fill-current" />
                Start
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleCancel}
            disabled={
              isCancelling ||
              isStarting ||
              isDeleting
            }
            {...buttonMotion}
            className="btn btn-warning w-full gap-2 shadow-sm lg:w-auto"
          >
            {isCancelling ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircleIcon className="size-4" />
                Cancel
              </>
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleDelete}
            disabled={
              isDeleting ||
              isStarting ||
              isCancelling
            }
            {...buttonMotion}
            className="btn btn-error w-full gap-2 shadow-sm lg:w-auto"
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-xs" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Delete
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}