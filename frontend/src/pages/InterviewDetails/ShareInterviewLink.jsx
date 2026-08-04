import { useState } from "react";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "motion/react";
import QRCode from "react-qr-code";
import {
  CheckIcon,
  Clock3Icon,
  CopyIcon,
  ExternalLinkIcon,
  QrCodeIcon,
  Share2Icon,
  ShieldCheckIcon,
} from "lucide-react";

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

export default function ShareInterviewLink({
  interview,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [isCopied, setIsCopied] = useState(false);

  const joinUrl = `${window?.location?.origin}/interviews/${interview?._id}/join`;

  const enabledSecurityCount =
    securityKeys?.filter((key) =>
      Boolean(
        interview?.securitySettings?.[key],
      ),
    )?.length ?? 0;

  const questionCount =
    interview?.questions?.length ?? 0;

  const copyLink = async () => {
    try {
      await navigator?.clipboard?.writeText?.(
        joinUrl,
      );

      setIsCopied(true);

      toast.success(
        "Interview invitation link copied",
      );

      window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy interview link:",
        error,
      );

      toast.error(
        "Failed to copy interview link",
      );
    }
  };

  const shareLink = async () => {
    const shareData = {
      title: `${interview?.title || "Interview"} - Invitation`,
      text: `You are invited to join the ${
        interview?.title || "Talent IQ"
      } interview.`,
      url: joinUrl,
    };

    try {
      if (navigator?.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator?.clipboard?.writeText?.(
        joinUrl,
      );

      setIsCopied(true);

      toast.success(
        "Sharing is unavailable, so the link was copied",
      );

      window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error(
          "Failed to share interview:",
          error,
        );

        toast.error(
          "Failed to share interview",
        );
      }
    }
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
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/10 blur-3xl transition duration-700 group-hover:scale-110" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-secondary/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-base-content/[0.035] via-transparent to-transparent" />

      <div className="relative grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <div className="flex flex-col gap-4 border-b border-base-300 pb-5 sm:flex-row sm:items-start sm:justify-between">
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
                <Share2Icon className="size-6" />
              </motion.div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Candidate Access
                </p>

                <h2 className="mt-1 text-xl font-black sm:text-2xl">
                  Candidate Invitation
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                  Share the interview link or let
                  candidates scan the QR code from
                  another device.
                </p>
              </div>
            </div>

            <span
              className={`badge badge-lg capitalize ${getStatusClass(
                interview?.status,
              )}`}
            >
              {interview?.status || "unknown"}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
              <Clock3Icon className="size-5 text-primary" />

              <p className="mt-3 text-xs text-base-content/50">
                Duration
              </p>

              <p className="mt-1 font-black">
                {interview?.durationMinutes ?? 0} minutes
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
              <ExternalLinkIcon className="size-5 text-secondary" />

              <p className="mt-3 text-xs text-base-content/50">
                Questions
              </p>

              <p className="mt-1 font-black">
                {questionCount} MCQs
              </p>
            </div>

            <div className="rounded-2xl border border-base-300 bg-base-200/40 p-4">
              <ShieldCheckIcon className="size-5 text-success" />

              <p className="mt-3 text-xs text-base-content/50">
                Protection
              </p>

              <p className="mt-1 font-black">
                {enabledSecurityCount} safeguards
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-base-300 bg-base-200/40 p-3 sm:p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-base-content/45">
              Secure invitation URL
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={copyLink}
                className="min-w-0 flex-1 cursor-copy rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-left transition hover:border-primary/40"
                title="Click to copy invitation link"
              >
                <span className="block truncate text-sm font-medium text-base-content/70">
                  {joinUrl}
                </span>
              </button>

              <motion.button
                type="button"
                onClick={copyLink}
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
                        scale: 0.95,
                      }
                }
                className={`btn w-full sm:w-auto ${
                  isCopied
                    ? "btn-success"
                    : "btn-outline"
                }`}
              >
                {isCopied ? (
                  <>
                    <CheckIcon className="size-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-4" />
                    Copy
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={shareLink}
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
                        scale: 0.95,
                      }
                }
                className="btn btn-primary w-full sm:w-auto"
              >
                <Share2Icon className="size-4" />
                Share
              </motion.button>
            </div>
          </div>
        </div>

        <motion.aside
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  scale: 0.9,
                  rotate: -3,
                }
          }
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 240,
            damping: 20,
          }}
          className="flex flex-col items-center justify-center rounded-3xl border border-primary/20 bg-primary/5 p-5 text-center"
        >
          <div className="mb-3 flex items-center gap-2">
            <QrCodeIcon className="size-4 text-primary" />

            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Quick Join
            </p>
          </div>

          <motion.div
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    scale: 1.04,
                    rotate: 1,
                  }
            }
            className="rounded-2xl bg-white p-3 shadow-lg"
          >
            <QRCode
              value={joinUrl}
              size={150}
              bgColor="#ffffff"
              fgColor="#111111"
              level="M"
            />
          </motion.div>

          <p className="mt-4 text-sm font-black">
            Scan to join
          </p>

          <p className="mt-1 text-xs leading-5 text-base-content/55">
            Candidates can scan this code using
            another device to open the interview.
          </p>
        </motion.aside>
      </div>
    </motion.section>
  );
}