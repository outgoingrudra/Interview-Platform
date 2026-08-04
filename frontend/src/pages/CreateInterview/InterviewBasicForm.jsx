import { motion, useReducedMotion } from "motion/react";
import {
  CalendarDaysIcon,
  Clock3Icon,
  FileTextIcon,
  InfoIcon,
  SparklesIcon,
} from "lucide-react";

const fieldVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function InterviewBasicForm({
  details,
  setDetails,
}) {
  const shouldReduceMotion = useReducedMotion();

  const updateField = (field, value) => {
    setDetails((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const now = new Date();

  now.setMinutes(
    now.getMinutes() -
      now.getTimezoneOffset(),
  );

  const minimumDateTime = now
    .toISOString()
    .slice(0, 16);

  const maxDate = new Date();

  maxDate.setFullYear(
    maxDate.getFullYear() + 1,
  );

  maxDate.setMinutes(
    maxDate.getMinutes() -
      maxDate.getTimezoneOffset(),
  );

  const maxDateTime = maxDate
    .toISOString()
    .slice(0, 16);

  const fields = [
    {
      id: "interview-title",
      label: "Interview title",
      icon: FileTextIcon,
      wrapperClass: "md:col-span-2",
      content: (
        <input
          id="interview-title"
          type="text"
          value={details?.title ?? ""}
          onChange={(event) =>
            updateField(
              "title",
              event?.target?.value,
            )
          }
          placeholder="Frontend Developer Interview"
          className="grow bg-transparent outline-none placeholder:text-base-content/35"
          required
        />
      ),
    },
    {
      id: "interview-duration",
      label: "Duration in minutes",
      icon: Clock3Icon,
      wrapperClass: "",
      content: (
        <input
          id="interview-duration"
          type="number"
          min="1"
          value={
            details?.durationMinutes ?? ""
          }
          onChange={(event) =>
            updateField(
              "durationMinutes",
              event?.target?.value,
            )
          }
          placeholder="60"
          className="grow bg-transparent outline-none placeholder:text-base-content/35"
          required
        />
      ),
    },
    {
      id: "interview-schedule",
      label: "Schedule date and time",
      icon: CalendarDaysIcon,
      wrapperClass: "",
      content: (
        <input
          id="interview-schedule"
          type="datetime-local"
          min={minimumDateTime}
          max={maxDateTime}
          value={details?.startsAt ?? ""}
          onChange={(event) =>
            updateField(
              "startsAt",
              event?.target?.value,
            )
          }
          className="min-w-0 grow bg-transparent outline-none"
        />
      ),
    },
  ];

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

      <div className="relative p-4 sm:p-6">
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
              <SparklesIcon className="size-6" />
            </motion.div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Step 1
              </p>

              <h2 className="mt-1 text-xl font-black sm:text-2xl">
                Basic Details
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                Add the interview title,
                duration and schedule.
              </p>
            </div>
          </div>

          <span className="badge badge-primary badge-outline whitespace-nowrap">
            Interview Setup
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {fields?.map(
            (
              {
                id,
                label,
                icon: Icon,
                wrapperClass,
                content,
              },
              index,
            ) => (
              <motion.label
                key={id}
                htmlFor={id}
                custom={index}
                variants={fieldVariants}
                initial={
                  shouldReduceMotion
                    ? false
                    : "hidden"
                }
                animate="visible"
                className={`form-control ${wrapperClass}`}
              >
                <span className="mb-2 text-sm font-semibold text-base-content/80">
                  {label}
                </span>

                <motion.div
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -2,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 22,
                  }}
                  className="group/input flex min-h-12 items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 px-4 transition focus-within:border-primary/60 focus-within:bg-base-100 focus-within:shadow-md focus-within:shadow-primary/5 hover:border-primary/35"
                >
                  <motion.div
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            rotate: 5,
                            scale: 1.08,
                          }
                    }
                    className="grid size-8 shrink-0 place-items-center rounded-xl bg-base-300/70 text-base-content/55 transition group-focus-within/input:bg-primary/15 group-focus-within/input:text-primary"
                  >
                    <Icon className="size-4" />
                  </motion.div>

                  {content}
                </motion.div>
              </motion.label>
            ),
          )}
        </div>

        <motion.div
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
          transition={{
            delay: 0.28,
            duration: 0.4,
          }}
          className="mt-6 flex items-start gap-3 rounded-2xl border border-info/25 bg-info/10 p-4"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-info/15 text-info">
            <InfoIcon className="size-4" />
          </div>

          <div>
            <p className="text-sm font-bold text-base-content">
              Draft mode available
            </p>

            <p className="mt-1 text-sm leading-6 text-base-content/60">
              Leave the schedule empty to save
              the interview as a draft and
              configure it later.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}