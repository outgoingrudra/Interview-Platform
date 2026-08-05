import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangleIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import { useSubmitInterviewMutation } from "../../api/sessionApi";

const ALLOW_FULLSCREEN_EXIT_EVENT =
  "talent-iq:allow-fullscreen-exit";

export default function SubmitInterviewButton({
  sessionId,
  answers = {},
  disabled = false,
}) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [isConfirmOpen, setIsConfirmOpen] =
    useState(false);

  const [
    submitInterview,
    { isLoading: isSubmitting },
  ] = useSubmitInterviewMutation();

  const answeredCount =
    Object.keys(answers ?? {}).length;

  const openConfirmation = () => {
    if (!sessionId) {
      toast.error("Session ID is missing");
      return;
    }

    setIsConfirmOpen(true);
  };

  const closeConfirmation = () => {
    if (isSubmitting) return;

    setIsConfirmOpen(false);
  };

  const handleSubmit = async () => {
    if (!sessionId || isSubmitting) return;

    const formattedAnswers = Object.entries(
      answers ?? {},
    ).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      await submitInterview({
        sessionId,
        answers: formattedAnswers,
      }).unwrap();

      /*
        FullscreenGuard must receive this event before
        document.exitFullscreen() triggers fullscreenchange.
      */
      window.dispatchEvent(
        new Event(ALLOW_FULLSCREEN_EXIT_EVENT),
      );

      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (error) {
          console.error(
            "Failed to exit fullscreen:",
            error,
          );
        }
      }

      setIsConfirmOpen(false);

      toast.success(
        "Interview submitted successfully",
      );

      navigate(
        `/sessions/${sessionId}/result`,
        {
          replace: true,
        },
      );
    } catch (error) {
      console.error(
        "Interview submission failed:",
        error,
      );

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to submit interview",
      );
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={openConfirmation}
        disabled={
          disabled ||
          isSubmitting ||
          !sessionId
        }
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                y: -2,
                scale: 1.02,
              }
        }
        whileTap={
          shouldReduceMotion
            ? undefined
            : {
                scale: 0.96,
              }
        }
        className="btn btn-error btn-sm"
      >
        <SendIcon className="size-4" />
        Submit Interview
      </motion.button>

      <AnimatePresence>
        {isConfirmOpen && (
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                  }
            }
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-confirmation-title"
          >
            <motion.section
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 24,
                      scale: 0.94,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 18,
                scale: 0.96,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 24,
              }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-error/30 bg-base-100 shadow-2xl"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-error/15 blur-3xl" />

              <button
                type="button"
                onClick={closeConfirmation}
                disabled={isSubmitting}
                className="btn btn-ghost btn-circle btn-sm absolute right-3 top-3 z-10"
                aria-label="Close confirmation"
              >
                <XIcon className="size-4" />
              </button>

              <div className="relative p-6 sm:p-7">
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
                  className="grid size-14 place-items-center rounded-2xl bg-error/15 text-error"
                >
                  <AlertTriangleIcon className="size-7" />
                </motion.div>

                <h2
                  id="submit-confirmation-title"
                  className="mt-5 text-2xl font-black"
                >
                  Submit interview?
                </h2>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  Your answers will be submitted and
                  the interview session will end. You
                  cannot change your answers afterward.
                </p>

                <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-base-content/60">
                      Answers selected
                    </span>

                    <span className="font-black text-primary">
                      {answeredCount}
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={closeConfirmation}
                    disabled={isSubmitting}
                    className="btn btn-outline"
                  >
                    Continue Interview
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn btn-error"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <SendIcon className="size-4" />
                        Submit Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}